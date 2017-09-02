/**
 * Takes an array of [keyValue1, keyValue2] pairs and creates an object of {keyValue1: keyValue2, keyValue2: keyValue1}
 * @param {Array} array the array of pairs
 * @return {Object} the {key, value} pair object
 */
export default function arrayToObject(array) {
  return array.reduce((obj, [prop1, prop2]) => {
    obj[prop1] = prop2
    obj[prop2] = prop1
    return obj
  }, {})
}
