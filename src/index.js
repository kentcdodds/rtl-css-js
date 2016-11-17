// this will be an object of properties that map to their corresponding rtl property (their doppelganger)
const propertiesToConvert = arrayToObject([
  ['paddingLeft', 'paddingRight'],
  ['marginLeft', 'marginRight'],
  ['left', 'right'],
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
    const splitValues = value.replace(/ +/g, ' ').split(' ')
    if (splitValues.length <= 3 || splitValues.length > 4) {
      return value
    }
    const [top, right, bottom, left] = splitValues
    return [top, left, bottom, right].filter(Boolean).join(' ')
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
}
propertyValueConverters.boxShadow = propertyValueConverters.textShadow
propertyValueConverters.webkitBoxShadow = propertyValueConverters.textShadow
propertyValueConverters.mozBoxShadow = propertyValueConverters.textShadow

// here's our main export! 👋
export default convert

/**
 * converts properties and values in the CSS in JS object to their corresponding RTL values
 * @param {Object} object the CSS in JS object
 * @return {Object} the RTL converted object
 */
function convert(object) {
  return Object.keys(object).reduce((newObj, originalKey) => {
    const {key, value} = convertProperty(originalKey, object[originalKey])
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
  const key = getPropertyDoppelganger(originalKey)
  const value = getValueDoppelganger(key, originalValue)
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
