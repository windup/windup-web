var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var ngtools = require('@ngtools/webpack');
var AotPlugin = ngtools.AotPlugin;

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    output: {
        path: helpers.root('../../../target/windup-web'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].chunk.js'
    },


    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin('css/[name].css'),
        new AotPlugin({
            tsConfigPath: './tsconfig-production.json',
            basePath: '.',
            mainPath: 'src/main.ts'
        }),
        new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
            mangle: {
                keep_fnames: true
            }
        })
    ]
});
