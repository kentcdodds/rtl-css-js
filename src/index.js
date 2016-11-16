const propertiesToConvert = {
  paddingLeft: 'paddingRight',
  paddingRight: 'paddingLeft',
  marginLeft: 'marginRight',
  marginRight: 'marginLeft',
}

export default convert

function convert(object) {
  return Object.keys(object).reduce((newObj, originalKey) => {
    const {key, value} = convertProperty(originalKey, object[originalKey])
    newObj[key] = value
    return newObj
  }, {})
}

function convertProperty(originalKey, value) {
  const key = getPropertyDoppelganger(originalKey)
  return {key, value}
}

function getPropertyDoppelganger(property) {
  return propertiesToConvert[property] || property
}
