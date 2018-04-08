const fs = require('fs')
const glob = require('tiny-glob/sync')

const getEntryPkg = entry => `${process.cwd()}/${entry}/package.json`

glob('*.d.ts')
  .filter(typing => typing !== 'types.d.ts')
  .map(typing => typing.replace(/\.d\.ts$/, ''))
  .filter(entry => fs.existsSync(getEntryPkg(entry)))
  .forEach(entry => {
    const pkgPath = getEntryPkg(entry)
    // eslint-disable-next-line import/no-dynamic-require
    const pkg = require(pkgPath)
    pkg.types = `../${entry}.d.ts`
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  })
