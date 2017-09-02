/**
 * Flip the sign of a CSS value, possibly with a unit.
 *
 * We can't just negate the value with unary minus due to the units.
 *
 * @private
 * @param {String} value - the original value (for example 77%)
 * @return {String} the result (for example -77%)
 */
export default function flipSign(value) {
  if (parseFloat(value) === 0) {
    // Don't mangle zeroes
    return value
  }

  if (value[0] === '-') {
    return value.slice(1)
  }

  return `-${value}`
}
