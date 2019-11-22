var webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    mode: 'development',

    devtool: 'source-map', //devtool: 'cheap-module-eval-source-map',
 
    output: {
        path: helpers.root('../../../target/rhamt-web'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].chunk.js'
    },

    optimization: {
        noEmitOnErrors: true
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /jquery*\.js/,
                use: [
                    { loader: 'awesome-typescript-loader' },
                    { loader: 'angular2-template-loader' },
                    { loader: 'angular-router-loader' }
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});
