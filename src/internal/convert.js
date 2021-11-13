import {
  includes,
  arrayToObject,
  isFunction,
  isNumber,
  isObject,
  isString,
  canConvertValue,
} from './utils'
import propertyValueConverters from './property-value-converters'

// this will be an object of properties that map to their corresponding rtl property (their doppelganger)
export const propertiesToConvert = arrayToObject([
  ['paddingLeft', 'paddingRight'],
  ['marginLeft', 'marginRight'],
  ['left', 'right'],
  ['borderLeft', 'borderRight'],
  ['borderLeftColor', 'borderRightColor'],
  ['borderLeftStyle', 'borderRightStyle'],
  ['borderLeftWidth', 'borderRightWidth'],
  ['borderTopLeftRadius', 'borderTopRightRadius'],
  ['borderBottomLeftRadius', 'borderBottomRightRadius'],
  // kebab-case versions
  ['padding-left', 'padding-right'],
  ['margin-left', 'margin-right'],
  ['border-left', 'border-right'],
  ['border-left-color', 'border-right-color'],
  ['border-left-style', 'border-right-style'],
  ['border-left-width', 'border-right-width'],
  ['border-top-left-radius', 'border-top-right-radius'],
  ['border-bottom-left-radius', 'border-bottom-right-radius'],
])

export const propsToIgnore = ['content']

// this is the same as the propertiesToConvert except for values
export const valuesToConvert = arrayToObject([
  ['ltr', 'rtl'],
  ['left', 'right'],
  ['w-resize', 'e-resize'],
  ['sw-resize', 'se-resize'],
  ['nw-resize', 'ne-resize'],
])

// Sorry for the regex 😞, but basically thisis used to replace _every_ instance of
// `ltr`, `rtl`, `right`, and `left` in `backgroundimage` with the corresponding opposite.
// A situation we're accepting here:
// url('/left/right/rtl/ltr.png') will be changed to url('/right/left/ltr/rtl.png')
// Definite trade-offs here, but I think it's a good call.
const bgImgDirectionRegex = new RegExp(
  '(^|\\W|_)((ltr)|(rtl)|(left)|(right))(\\W|_|$)',
  'g',
)
const bgPosDirectionRegex = new RegExp('(left)|(right)')

/**
 * converts properties and values in the CSS in JS object to their corresponding RTL values
 * @param {Object} object the CSS in JS object
 * @return {Object} the RTL converted object
 */
export function convert(object) {
  return Object.keys(object).reduce(
    (newObj, originalKey) => {
      let originalValue = object[originalKey]
      if (isString(originalValue)) {
        // you're welcome to later code 😺
        originalValue = originalValue.trim()
      }

      // Some properties should never be transformed
      if (includes(propsToIgnore, originalKey)) {
        newObj[originalKey] = originalValue
        return newObj
      }

      const {key, value} = convertProperty(originalKey, originalValue)
      newObj[key] = value
      return newObj
    },
    Array.isArray(object) ? [] : {},
  )
}

/**
 * Converts a property and its value to the corresponding RTL key and value
 * @param {String} originalKey the original property key
 * @param {Number|String|Object} originalValue the original css property value
 * @return {Object} the new {key, value} pair
 */
export function convertProperty(originalKey, originalValue) {
  const isNoFlip = /\/\*\s?@noflip\s?\*\//.test(originalValue)
  const key = isNoFlip ? originalKey : getPropertyDoppelganger(originalKey)
  const value = isNoFlip
    ? originalValue
    : getValueDoppelganger(key, originalValue)
  return {key, value}
}

/**
 * This gets the RTL version of the given property if it has a corresponding RTL property
 * @param {String} property the name of the property
 * @return {String} the name of the RTL property
 */
export function getPropertyDoppelganger(property) {
  return propertiesToConvert[property] || property
}

/**
 * This converts the given value to the RTL version of that value based on the key
 * @param {String} key this is the key (note: this should be the RTL version of the originalKey)
 * @param {String|Number|Object} originalValue the original css property value. If it's an object, then we'll convert that as well
 * @return {String|Number|Object} the converted value
 */
export function getValueDoppelganger(key, originalValue) {
  if (!canConvertValue(originalValue)) {
    return originalValue
  }

  if (isObject(originalValue)) {
    return convert(originalValue) // recurssion 🌀
  }
  const isNum = isNumber(originalValue)
  const isFunc = isFunction(originalValue)

  const importantlessValue =
    isNum || isFunc
      ? originalValue
      : originalValue.replace(/ !important.*?$/, '')
  const isImportant =
    !isNum && importantlessValue.length !== originalValue.length
  const valueConverter = propertyValueConverters[key]
  let newValue
  if (valueConverter) {
    newValue = valueConverter({
      value: importantlessValue,
      valuesToConvert,
      propertiesToConvert,
      isRtl: true,
      bgImgDirectionRegex,
      bgPosDirectionRegex,
    })
  } else {
    newValue = valuesToConvert[importantlessValue] || importantlessValue
  }
  if (isImportant) {
    return `${newValue} !important`
  }
  return newValue
}
