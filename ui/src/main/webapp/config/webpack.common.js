var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ContextReplacementPlugin = webpack.ContextReplacementPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var helpers = require('./helpers');

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts'
    },

    resolve: {
        extensions: ['.js', '.ts']
    },

    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(json|ftl)$/,
                exclude: /index\.html\.ftl/,
                loader: 'file-loader?name=[name].[ext]'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: [helpers.root('src', 'app'), helpers.root('node_modules', '@swimlane')],
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', loader: ['css-loader?sourceMap'], publicPath: '../' })
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['raw-loader', 'sass-loader'] // sass-loader not scss-loader
//                include: helpers.root('src', 'app'),
//                loader: 'sass-loader'
            },
            {
                test: /\.css$/,
                include: [helpers.root('src', 'app'), helpers.root('node_modules', '@swimlane')],
                loader: 'raw-loader'
            },
            // All the sh*t for jQuery and other global plugins
            // jQuery needs to be exposed in window.jQuery and window.$ because of plugins dependencies
            // I'm not even sure if this helped, I had to expose jQuery manually anyway
            {
                test: '/jquery/',
                exclude: /\.css/,
                loader: 'expose-loader?$!expose?jQuery'
            },
            // Force those plugins to be loaded into global scope
            // They can load using AMD or CommonJS, but it doesn't work properly
            // They depend on global jQuery variable
            {
                test: /dataTables*\.js|jquery*\.js|colVis*\.js|colReorder*\.js|jstree\.js/,
                loader: "imports-loader?define=>false!imports-loader?exports=>false"
            },
            {
                test: /jstree\.js/,
                loader: 'imports-loader?define=>false!imports-loader?exports=>false!imports-loader?module=>false'
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
            template: 'text-loader!src/index.html.ftl',
            filename: 'index.html.ftl'
        }),
        // This is needed to suppress warning caused by some angular issue
        // see https://github.com/angular/angular/issues/11580
        new ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./src'), // location of your src
            {} // a map of your routes
        )
    ],
    // TODO: Find out if it helps,
    // tried this to get jquery externally loaded into global scope using <script> tag
/*    externals: {
        'jquery': 'jQuery'
    }
*/
};
