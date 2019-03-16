const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer')

module.exports = {
    entry: path.join(__dirname, 'js/app/index.js'),
    output: {
        path: path.join(__dirname, '../public/js'),
        filename: 'index.js'
    },
    module: {
        rules: [{
            test: /\.less$/,
            // use: ['style-loader', 'css-loader', 'less-loader']
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "less-loader", "postcss-loader"]
            })  // 把 css 抽离出来生成一个文件
        }]
    },
    resolve: {
        alias: {
            // jquery: path.join(__dirname, 'js/lib/jquery-2.1.4.min.js'),
            mod: path.join(__dirname, 'js/mod'),
            less: path.join(__dirname, 'less')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer(),
                ]
            }
        }),
        new ExtractTextPlugin('../css/style.css')
    ]
}

