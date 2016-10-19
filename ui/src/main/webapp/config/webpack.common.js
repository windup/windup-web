var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ProvidePlugin = webpack.ProvidePlugin;
var ContextReplacementPlugin = webpack.ContextReplacementPlugin;
var DedupePlugin = webpack.optimize.DedupePlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var helpers = require('./helpers');

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts',
        'vendor-global': './src/vendor-global.ts'
    },

    resolve: {
        extensions: ['.js', '.ts']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.json$/,
                loader: 'file?name=[name].[ext]'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style', loader: ['css?sourceMap'] })
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw'
            },
            // jQuery needs to be exposed in window.jQuery and window.$ because of plugins dependencies
            {
                test: require.resolve("jquery"),
                loader: 'expose?$!expose?jQuery'
            },
            {
                test: /dataTables*\.js|jquery*\.js|colVis*\.js/,
                loader: "imports?define=>false!imports?exports=>false"
            }
        ]
    },

    plugins: [
        // Cannot be used until this is solved: https://github.com/webpack/webpack/issues/2644
        // new DedupePlugin(),
        new CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new ProvidePlugin({
            $: 'jquery',
            jquery: "jquery",
            jQuery:"jquery",
            'window.jquery': 'jquery',
            "windows.jQuery": "jquery",
            "window.jQuery": "jquery"
//            DataTables: 'datatables',
//            datatables: 'datatables'
        }),
        // This is needed to suppress warning caused by some angular issue
        // see https://github.com/angular/angular/issues/11580
        new ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        )
    ]
};
