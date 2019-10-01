var path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); 
var webpack = require("webpack");


module.exports = {
    devtool: 'eval-source-map',              //dev-mode only,
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "index.js",
        // chunkFilename: '[name].bundle.js',
        publicPath:'dist'
    },
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              'style-loader',
              // Translates CSS into CommonJS
              'css-loader',
              // Compiles Sass to CSS
              'sass-loader',
            ],
          },
          {
            test: /\.css$/i,
            use: [
              // Creates `style` nodes from JS strings
              'style-loader',
              // Translates CSS into CommonJS
              'css-loader',
            ],
          },
          {
            test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.eot$|\.woff$|\.woff2$|\.ttf$|\.wav$|\.mp3$/,
            loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
         }, 
         {
          test: require.resolve('jquery'),
          use: [{
          loader: 'expose-loader',
          options: '$'
          }]
          }
        ],
        
      },
      plugins: [
        new UglifyJsPlugin(),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery'",
          "window.$": "jquery"
         })
     ],
     resolve: {
      alias: {
          'uikit-util': path.resolve(__dirname, 'node_modules/uikit/src/js/util')
      }
     },
     performance: {
      hints: process.env.NODE_ENV === 'production' ? "warning" : false
    }
    
};
