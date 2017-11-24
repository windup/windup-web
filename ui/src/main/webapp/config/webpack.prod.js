var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var path = require('path');
var helpers = require('./helpers');
var ngtools = require('@ngtools/webpack');
var AotPlugin = ngtools.AotPlugin;

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

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
                use: [ '@ngtools/webpack' ]
            }
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin('css/[name].css'),
        new AotPlugin({
            tsConfigPath: './tsconfig-production.json',
            basePath: '.',
            mainPath: 'src/main.ts'
//            skipCodeGeneration: true // I'm not sure what it means, but without it code would be in bundle twice
        }),
        new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
            mangle: {
                keep_fnames: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        })
    ]
});
