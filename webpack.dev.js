var path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') 

var webpack = require('webpack')


module.exports = {
    devtool: 'eval-source-map',              //dev-mode only,
    entry: './src/js/app.dev.js',
    //   entry: './src/js/module/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
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
                ],
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
                test: path.resolve('jquery'),
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
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery\'',
            'window.$': 'jquery'
        })
    ],
    resolve: {
        alias: {
            'uikit-util': path.resolve(__dirname, 'node_modules/uikit/src/js/util'),
            'css': path.resolve(__dirname, 'src/plugin/css'),
            'js': path.resolve(__dirname, 'src/plugin/js')
        }
    },
    performance: {
        hints:  false
    }
    
}
