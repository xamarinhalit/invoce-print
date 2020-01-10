const { resolve } = require('path')
var webpack = require('webpack')
const UglifyEsPlugin = require('uglify-es-webpack-plugin')
module.exports = {
    entry: './src/js/app.dev.js',
    // entry: './src/js/module/index.js',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'index.js',
        // chunkFilename: '[name].bundle.js',
        publicPath:'dist/'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.eot$|\.woff$|\.woff2$|\.ttf$|\.wav$|\.mp3$/,
                loader: 'file-loader?name=[name].[ext]',  // <-- retain original file name,
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }, 
            {
                test: /\.jpeg$|\.jpg$|\.ico$|\.gif$|\.png$|\.svg$/,
                loader: 'file-loader?name=[name].[ext]',  // <-- retain original file name,
                options: {
                    name: '[name].[ext]',
                    outputPath: 'img/'
                }
            }, 
            {
                test: resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$'
                }]
            }
        ],
        
    },
    plugins: [
        new UglifyEsPlugin({
          compress:{
            drop_console: true
          }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery\'',
            'window.$': 'jquery'
        })
    ],
    resolve: {
        alias: {
            'uikit-util': resolve(__dirname, 'node_modules/uikit/src/js/util'),
            'css': resolve(__dirname, 'src/js/plugin/css'),
            'js': resolve(__dirname, 'src/js/plugin/js')
        }
    },
    performance: {
        hints:  false
    }
}
