var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map', //devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('../../../target/windup-web'), //
        //publicPath: 'http://localhost:8080/windup-web/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('css/[name].css')
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});
