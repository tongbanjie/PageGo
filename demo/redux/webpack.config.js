var webpack = require('webpack'),
  WebpackChunkHash = require('webpack-chunk-hash'),
  ManifestPlugin = require('webpack-manifest-plugin'),
  path = require('path');
process.traceDeprecation = true;

module.exports = function(env){
  var param = env ? JSON.parse(env.param) : '',
    plugins = [];
  plugins.push(new WebpackChunkHash({algorithm: 'md5'}));
  plugins.push(new webpack.NamedModulesPlugin());
  plugins.push(new webpack.NamedChunksPlugin());

  plugins.push(new ManifestPlugin({
    fileName: '../.rev-manifest.json',
    publicPath: ''
  }));

  return {
    mode: "production",
    devtool: !!param.PRODUCTION ? '' : 'inline-source-map',
    // 插件项
    plugins: plugins,
    // 页面入口文件配置
    entry: {
      'init': './src/js/initLoad'
    },
    // 入口文件输出配置
    output: {
      path: path.resolve(__dirname, 'dest/js'),
      publicPath: './js/',
      filename: param.PRODUCTION ? '[name].[chunkhash].js' : '[name].js',
      // 当需要按需加载时打开
      chunkFilename: param.PRODUCTION ? '[name].[chunkhash].js' : '[name].js'
    },
    performance: {
      hints: false
    },
    optimization: {
      minimize: !!param.PRODUCTION
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader?cacheDirectory'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader?cacheDirectory'
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
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
      extensions: ['.js', '.json', '.jsx', '.css']
    }
  }
};