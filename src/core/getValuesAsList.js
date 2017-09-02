/**
 * This takes a list of CSS values and converts it to an array
 * @param {String} value - something like `1px`, `1px 2em`, or `3pt rgb(150, 230, 550) 40px calc(100% - 5px)`
 * @return {Array} the split values (for example: `['3pt', 'rgb(150, 230, 550)', '40px', 'calc(100% - 5px)']`)
 */
export default function getValuesAsList(value) {
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
