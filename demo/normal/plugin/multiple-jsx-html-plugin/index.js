const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (Param) => {
  const {jsxTemplate, pagespath, parameters} = Param;
  return pagespath.map((path, index) => new HtmlWebpackPlugin({
    filename: (path + '.html').toLowerCase(),
    template: 'plugin/multiple-jsx-html-plugin/html.js',
    templateParameters: {...parameters[index], jsxTemplate}
  }))
}