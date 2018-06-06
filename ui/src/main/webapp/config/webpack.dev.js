var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map', //devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('../../../target/rhamt-web'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].chunk.js'
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
        new ExtractTextPlugin('css/[name].css')
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});
