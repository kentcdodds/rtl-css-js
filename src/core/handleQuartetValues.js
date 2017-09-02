import {getValuesAsList} from './index'

/**
 * This is intended for properties that are `top right bottom left` and will switch them to `top left bottom right`
 * @param {String} value - `1px 2px 3px 4px` for example, but also handles cases where there are too few/too many and
 * simply returns the value in those cases (which is the correct behavior)
 * @return {String} the result - `1px 4px 3px 2px` for example.
 */
export default function handleQuartetValues(value) {
  const splitValues = getValuesAsList(value)
  if (splitValues.length <= 3 || splitValues.length > 4) {
    return value
  }
  const [top, right, bottom, left] = splitValues
  return [top, left, bottom, right].join(' ')
}
