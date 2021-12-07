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

function containsCssVar(val) {
  return typeof val === 'string' && val.match(/var\(.*\)/g)
}

function isBoolean(val) {
  return typeof val === 'boolean'
}

function isFunction(val) {
  return typeof val === 'function'
}

function isNumber(val) {
  return typeof val === 'number'
}

function isNullOrUndefined(val) {
  return val === null || typeof val === 'undefined'
}

function isObject(val) {
  return val && typeof val === 'object'
}

function isString(val) {
  return typeof val === 'string'
}

function includes(inclusive, inclusee) {
  return inclusive.indexOf(inclusee) !== -1
}

/**
 * Flip the sign of a CSS value, possibly with a unit.
 *
 * We can't just negate the value with unary minus due to the units.
 *
 * @private
 * @param {String} value - the original value (for example 77%)
 * @return {String} the result (for example -77%)
 */
function flipSign(value) {
  if (parseFloat(value) === 0) {
    // Don't mangle zeroes
    return value
  }

  if (value[0] === '-') {
    return value.slice(1)
  }

  return `-${value}`
}

function flipTransformSign(match, prefix, offset, suffix) {
  return prefix + flipSign(offset) + suffix
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
 * This takes a list of CSS values and converts it to an array
 * @param {String} value - something like `1px`, `1px 2em`, or `3pt rgb(150, 230, 550) 40px calc(100% - 5px)`
 * @return {Array} the split values (for example: `['3pt', 'rgb(150, 230, 550)', '40px', 'calc(100% - 5px)']`)
 */
function getValuesAsList(value) {
  return (
    value
      .replace(/ +/g, ' ') // remove all extraneous spaces
      .split(' ')
      .map(i => i.trim()) // get rid of extra space before/after each item
      .filter(Boolean) // get rid of empty strings
      // join items which are within parenthese
      // luckily `calc (100% - 5px)` is invalid syntax and it must be `calc(100% - 5px)`, otherwise this would be even more complex
      .reduce(
        ({list, state}, item) => {
          const openParansCount = (item.match(/\(/g) || []).length
          const closedParansCount = (item.match(/\)/g) || []).length
          if (state.parensDepth > 0) {
            list[list.length - 1] = `${list[list.length - 1]} ${item}`
          } else {
            list.push(item)
          }
          state.parensDepth += openParansCount - closedParansCount
          return {list, state}
        },
        {list: [], state: {parensDepth: 0}},
      ).list
  )
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
 *
 * @param {String|Number|Object} value css property value to test
 * @returns If the css property value can(should?) have an RTL equivalent
 */
function canConvertValue(value) {
  return (
    !isBoolean(value) && !isNullOrUndefined(value) && !containsCssVar(value)
  )
}

/**
 * Splits a shadow style into its separate shadows using the comma delimiter, but creating an exception
 * for comma separated values in parentheses often used for rgba colours.
 * @param {String} value
 * @returns {Array} array of all box shadow values in the string
 */
function splitShadow(value) {
  const shadows = []
  let start = 0
  let end = 0
  let rgba = false
  while (end < value.length) {
    if (!rgba && value[end] === ',') {
      shadows.push(value.substring(start, end).trim())
      end++
      start = end
    } else if (value[end] === `(`) {
      rgba = true
      end++
    } else if (value[end] === ')') {
      rgba = false
      end++
    } else {
      end++
    }
  }

  // push the last shadow value if there is one
  // istanbul ignore next
  if (start != end) {
    shadows.push(value.substring(start, end + 1))
  }

  return shadows
}

export {
  arrayToObject,
  calculateNewBackgroundPosition,
  canConvertValue,
  flipTransformSign as calculateNewTranslate,
  flipTransformSign,
  flipSign,
  handleQuartetValues,
  includes,
  isBoolean,
  containsCssVar,
  isFunction,
  isNumber,
  isNullOrUndefined,
  isObject,
  isString,
  getValuesAsList,
  splitShadow,
}
