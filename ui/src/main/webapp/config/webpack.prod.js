var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var commonConfig = require('./webpack.common.js');
var path = require('path');
var helpers = require('./helpers');
var ngtools = require('@ngtools/webpack');
var AotPlugin = ngtools.AngularCompilerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var cssnano = require('cssnano');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    mode: ENV,

    devtool: 'source-map',

    output: {
        path: helpers.root('../../../target/rhamt-web'),
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[id].[hash].chunk.js'
    },

    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: 'single',
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),
            
             new OptimizeCSSAssetsPlugin({
                 cssProcessor: cssnano,
                 cssProcessorOptions: {
                     discardComments: {
                         removeAll: true
                     }
                 },
                 canPrint: false
             })
        ]
    },
    
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                exclude: /jquery*\.js/,
                use: [ '@ngtools/webpack' ]
            }
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new AotPlugin({
            tsConfigPath: './tsconfig-production.json',
            basePath: '.',
            mainPath: 'src/main.ts',
            skipCodeGeneration: true // I'm not sure what it means, but without it code would be in bundle twice
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        })
    ]
});
