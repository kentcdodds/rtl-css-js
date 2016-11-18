const mainExport = require('./index')

module.exports = mainExport.default
for (const key in mainExport) {
  if (mainExport.hasOwnProperty(key)) {
    module.exports[key] = mainExport[key]
  }
}
