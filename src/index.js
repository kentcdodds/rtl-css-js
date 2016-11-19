// this will be an object of properties that map to their corresponding rtl property (their doppelganger)
const propertiesToConvert = arrayToObject([
  ['paddingLeft', 'paddingRight'],
  ['marginLeft', 'marginRight'],
  ['left', 'right'],
  ['borderLeft', 'borderRight'],
  ['borderLeftColor', 'borderRightColor'],
  ['borderLeftStyle', 'borderRightStyle'],
  ['borderTopLeftRadius', 'borderTopRightRadius'],
  ['borderBottomLeftRadius', 'borderBottomRightRadius'],
])

// this is the same as the propertiesToConvert except for values
const valuesToConvert = arrayToObject([
  ['ltr', 'rtl'],
  ['left', 'right'],
  ['w-resize', 'e-resize'],
  ['sw-resize', 'se-resize'],
  ['nw-resize', 'ne-resize'],
])

// some values require a little fudging, that fudging goes here.
const propertyValueConverters = {
  padding(value) {
    if (isNumber(value)) {
      return value
    }
    return handleQuartetValues(value)
  },
  textShadow(value) {
    // intentionally leaving off the `g` flag here because we only want to change the first number (which is the offset-x)
    return value.replace(/(-*)([.|\d]+)/, (match, negative, number) => {
      if (number === '0') {
        return match
      }
      const doubleNegative = negative === '' ? '-' : ''
      return `${doubleNegative}${number}`
    })
  },
  borderColor(value) {
    return handleQuartetValues(value)
  },
  borderRadius(value) {
    if (isNumber(value)) {
      return value
    }
    if (includes(value, '/')) {
      const [radius1, radius2] = value.split('/')
      const convertedRadius1 = propertyValueConverters.borderRadius(radius1.trim())
      const convertedRadius2 = propertyValueConverters.borderRadius(radius2.trim())
      return `${convertedRadius1} / ${convertedRadius2}`
    }
    const splitValues = getValuesAsList(value)
    switch (splitValues.length) {
      case 2: {
        return splitValues.reverse().join(' ')
      }
      case 4: {
        const [topLeft, topRight, bottomRight, bottomLeft] = splitValues
        return [topRight, topLeft, bottomLeft, bottomRight].join(' ')
      }
      default: {
        return value
      }
    }
  },
  background(value) {
    // Yeah, this is in need of a refactor 🙃...
    // but this property is a tough cookie 🍪
    // get the backgroundPosition out of the string by removing everything that couldn't be the backgroundPosition value
    const backgroundPositionValue = value
      .replace(/(url\(.*?\))|(rgba?\(.*?\))|(hsl\(.*?\))|(#[a-fA-F0-9]+)|((^| )(\D)+( |$))/g, '').trim()
    // replace that backgroundPosition value with the converted version
    value = value
      .replace(backgroundPositionValue, propertyValueConverters.backgroundPosition(backgroundPositionValue))
    // do the backgroundImage value replacing on the whole value (because why not?)
    return propertyValueConverters.backgroundImage(value)
  },
  backgroundImage(value) {
    if (!includes(value, 'url(')) {
      return value
    }
    // sorry for the regex 😞, but basically this replaces _every_ instance of `ltr`, `rtl`, `right`, and `left` with
    // the corresponding opposite. A situation we're accepting here:
    // url('/left/right/rtl/ltr.png') will be changed to url('/right/left/ltr/rtl.png')
    // Definite trade-offs here, but I think it's a good call.
    return value.replace(/(^|\W|_)((ltr)|(rtl)|(left)|(right))(\W|_|$)/g, (match, g1, group2) => {
      return match.replace(group2, valuesToConvert[group2])
    })
  },
  backgroundPosition(value) {
    return value
      // intentionally only grabbing the first instance of this because that represents `left`
      .replace(/^((-|\d|\.)+%)/, (match, group) => calculateNewBackgroundPosition(group))
      .replace(/(left)|(right)/, match => valuesToConvert[match])
  },
  backgroundPositionX(value) {
    if (isNumber(value)) {
      return value
    }
    return propertyValueConverters.backgroundPosition(value)
  },
}
propertyValueConverters.borderWidth = propertyValueConverters.padding
propertyValueConverters.boxShadow = propertyValueConverters.textShadow
propertyValueConverters.webkitBoxShadow = propertyValueConverters.textShadow
propertyValueConverters.mozBoxShadow = propertyValueConverters.textShadow
propertyValueConverters.borderStyle = propertyValueConverters.borderColor

// here's our main export! 👋
export default convert

/**
 * converts properties and values in the CSS in JS object to their corresponding RTL values
 * @param {Object} object the CSS in JS object
 * @return {Object} the RTL converted object
 */
function convert(object) {
  return Object.keys(object).reduce((newObj, originalKey) => {
    let originalValue = object[originalKey]
    if (isString(originalValue)) {
      // you're welcome to later code 😺
      originalValue = originalValue.trim()
    }
    const {key, value} = convertProperty(originalKey, originalValue)
    newObj[key] = value
    return newObj
  }, {})
}

/**
 * Converts a property and its value to the corresponding RTL key and value
 * @param {String} originalKey the original property key
 * @param {Number|String|Object} originalValue the original css property value
 * @return {Object} the new {key, value} pair
 */
function convertProperty(originalKey, originalValue) {
  const isNoFlip = /\/\*\s?@noflip\s?\*\//.test(originalValue)
  const key = isNoFlip ? originalKey : getPropertyDoppelganger(originalKey)
  const value = isNoFlip ? originalValue : getValueDoppelganger(key, originalValue)
  return {key, value}
}

/**
 * This gets the RTL version of the given property if it has a corresponding RTL property
 * @param {String} property the name of the property
 * @return {String} the name of the RTL property
 */
function getPropertyDoppelganger(property) {
  return propertiesToConvert[property] || property
}

/**
 * This converts the given value to the RTL version of that value based on the key
 * @param {String} key this is the key (note: this should be the RTL version of the originalKey)
 * @param {String|Number|Object} originalValue the original css property value. If it's an object, then we'll convert that as well
 * @return {String|Number|Object} the converted value
 */
function getValueDoppelganger(key, originalValue) {
  /* eslint complexity:[2, 7] */ // let's try to keep the complexity down... If we have to do this much more, let's break this up
  if (isObject(originalValue)) {
    return convert(originalValue) // recurssion 🌀
  }
  const isNum = isNumber(originalValue)
  const importantlessValue = isNum ? originalValue : originalValue.replace(/ !important.*?$/, '')
  const isImportant = !isNum && importantlessValue.length !== originalValue.length
  const valueConverter = propertyValueConverters[key]
  let newValue
  if (valueConverter) {
    newValue = valueConverter(importantlessValue)
  } else {
    newValue = valuesToConvert[importantlessValue] || importantlessValue
  }
  if (isImportant) {
    return `${newValue} !important`
  }
  return newValue
}

/**
 * This takes a list of CSS values and converts it to an array
 * @param {String} value - something like `1px`, `1px 2em`, or `3pt rgb(150, 230, 550) 40px calc(100% - 5px)`
 * @return {Array} the split values (for example: `['3pt', 'rgb(150, 230, 550)', '40px', 'calc(100% - 5px)']`)
 */
function getValuesAsList(value) {
  return value
    .replace(/ +/g, ' ') // remove all extraneous spaces
    .split(' ')
    .map(i => i.trim()) // get rid of extra space before/after each item
    .filter(Boolean) // get rid of empty strings
     // join items which are within parenthese
     // luckily `calc (100% - 5px)` is invalid syntax and it must be `calc(100% - 5px)`, otherwise this would be even more complex
    .reduce(({list, state}, item) => {
      const openParansCount = (item.match(/\(/g) || []).length
      const closedParansCount = (item.match(/\)/g) || []).length
      if (state.parensDepth > 0) {
        list[list.length - 1] = `${list[list.length - 1]} ${item}`
      } else {
        list.push(item)
      }
      state.parensDepth += openParansCount - closedParansCount
      return {list, state}
    }, {list: [], state: {parensDepth: 0}}).list
}

/**
 * This is intended for properties that are `top right bottom left` and will switch them to `top left bottom right`
 * @param {String} value - `1px 2px 3px 4px` for example, but also handles cases where there are too few/too many and
 * simply returns the value in those cases (which is the correct behavior)
 * @return {String} the result - `1px 4px 3px 2px` for example.
 */
function handleQuartetValues(value) {
  const splitValues = getValuesAsList(value)
  if (splitValues.length <= 3 || splitValues.length > 4) {
    return value
  }
  const [top, right, bottom, left] = splitValues
  return [top, left, bottom, right].join(' ')
}

/**
 * Takes a percentage for background position and inverts it.
 * This was copied and modified from CSSJanus:
 * https://github.com/cssjanus/cssjanus/blob/4245f834365f6cfb0239191a151432fb85abab23/src/cssjanus.js#L152-L175
 * @param {String} value - the original value (for example 77%)
 * @return {String} the result (for example 23%)
 */
function calculateNewBackgroundPosition(value) {
  const idx = value.indexOf('.')
  if (idx === -1) {
    value = `${100 - parseFloat(value)}%`
  } else {
    // Two off, one for the "%" at the end, one for the dot itself
    const len = value.length - idx - 2
    value = 100 - parseFloat(value)
    value = `${value.toFixed(len)}%`
  }
  return value
}

/**
 * Takes an array of [keyValue1, keyValue2] pairs and creates an object of {keyValue1: keyValue2, keyValue2: keyValue1}
 * @param {Array} array the array of pairs
 * @return {Object} the {key, value} pair object
 */
function arrayToObject(array) {
  return array.reduce((obj, [prop1, prop2]) => {
    obj[prop1] = prop2
    obj[prop2] = prop1
    return obj
  }, {})
}

function isNumber(val) {
  return typeof val === 'number'
}

function isObject(val) {
  return typeof val === 'object'
}

function isString(val) {
  return typeof val === 'string'
}

function includes(inclusive, inclusee) {
  return inclusive.indexOf(inclusee) !== -1
}
