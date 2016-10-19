var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map', //devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:8080/windup-web/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('css/[name].css'),
        new DashboardPlugin()
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});
