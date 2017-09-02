/**
 * Takes a percentage for background position and inverts it.
 * This was copied and modified from CSSJanus:
 * https://github.com/cssjanus/cssjanus/blob/4245f834365f6cfb0239191a151432fb85abab23/src/cssjanus.js#L152-L175
 * @param {String} value - the original value (for example 77%)
 * @return {String} the result (for example 23%)
 */
export default function calculateNewBackgroundPosition(value) {
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
