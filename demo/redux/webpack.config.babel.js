var webpack = require('webpack'),
  WebpackChunkHash = require('webpack-chunk-hash'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  MultipleJsxHtmlPlugin = require('./plugin/multiple-jsx-html-plugin'),
  path = require('path');

var pagesPath = require('./plugin/tools').getPages(path.resolve(__dirname, './src/pages')),
  _html = require('./src/_html.jsx').default;

process.traceDeprecation = true;
module.exports = function(env){
  const production = env === 'production';
  return {
    mode: env,
    devtool: production ? '' : 'inline-source-map',
    plugins: [
      new webpack.EnvironmentPlugin({NODE_ENV: env}),
      new WebpackChunkHash({algorithm: 'md5'}),
      new MiniCssExtractPlugin({
        filename: production ? '[name].[chunkhash].css' : '[name].css',
        chunkFilename: production ? '[id].[chunkhash].css' : '[id].css'
      }),
      ... MultipleJsxHtmlPlugin({
        jsxTemplate: _html,
        pagespath: pagesPath,
        parameters: pagesPath.map(ps=>{
          // 可以基于页面路径为每个页面单独设置参数
          return {
            title: '',
            path: ps.toLowerCase()
          }
        })
      })
    ],
    // 页面入口文件配置
    entry: {
      'index': './src/index.js'
    },
    // 入口文件输出配置
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: production ? '[name].[chunkhash].js' : '[name].js',
      publicPath: '/',
      chunkFilename: production ? 'js/[name].[chunkhash].js' : 'js/[name].js'
    },
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      hot: true
    },
    performance: {
      hints: false
    },
    optimization: {
      minimize: production,
      splitChunks: {
        // 相关配置查看 https://webpack.js.org/plugins/split-chunks-plugin/
        // 手动分割公用缓存模块
        cacheGroups:{
          react: {test:/react/, name: "react", chunks: 'all', reuseExistingChunk: true, enforce: true}
        }
      }
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'plugin')
      ]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'route-loader',
              options: {
                test: /\/pagesroute\.(js|ts)$/,
                pagesPath: pagesPath,
                pageRootPathRelativeToRouteFile: '../pages'
              }
            },
          ]
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader?cacheDirectory'
            }
          ],
          include: /node_modules\/pagego/
        },
        {
          test: /^(?!.*base)(?=.*\.css$)/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /base\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !production,
              },
            },
            'css-loader'
          ]
        },
        // 若有在jsx中使用img标签的，打开下方loader为图片添加hash
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: './',
                useRelativePath: true,
                name: '[name].[ext]?[hash]'
              }
            }
          ]
        }
      ]
    },
    resolve: {
      modules: [
        path.join(__dirname, 'src'),
        'node_modules'
      ],
      extensions: ['.ts', '.tsx', '.js', '.json', '.jsx', '.css']
    }
  }
};