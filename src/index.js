export default convert

function convert(object) {
  return Object.keys(object).reduce((newObj, originalKey) => {
    const {key, value} = convertProperty(originalKey, object[originalKey])
    newObj[key] = value
    return newObj
  }, {})
}

function convertProperty(key, value) {
  if (endsWith(key, 'Left')) {
    return {key: key.replace('Left', 'Right'), value}
  } else if (endsWith(key, 'Right')) {
    return {key: key.replace('Right', 'Left'), value}
  }
  return {key, value}
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1
}
