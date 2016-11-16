const {join} = require('path')

const include = join(__dirname, 'src')

module.exports = {
  entry: './src/index',
  output: {
    path: join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'rtlCSSJS',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel', include},
    ],
  },
}
