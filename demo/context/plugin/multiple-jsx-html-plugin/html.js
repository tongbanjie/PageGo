// Webpack require:
const React = require('react');
const ReactDOMServer = require('react-dom/server');;
// 生成对应的html文件
module.exports = templateParams => {
  const {jsxTemplate, ...jsxParams} = templateParams;
  return ReactDOMServer.renderToStaticMarkup(React.createElement(jsxTemplate, jsxParams))
}