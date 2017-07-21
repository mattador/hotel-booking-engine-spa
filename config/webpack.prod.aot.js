var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ngToolsWebpack = require('@ngtools/webpack');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const CDN = process.env.CDN = '';

module.exports = webpackMerge(commonConfig, {
    //devtool: 'source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: '@ngtools/webpack',
        }]
    },
    plugins: [
        new ngToolsWebpack.AotPlugin({
            tsConfigPath: 'tsconfig.json',
            entryModule: helpers.root('src','app', 'app.module#AppModule')
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                warnings: false,
                screw_ie8: true
            },
            comments: false
        }),
        new ExtractTextPlugin('[name].[hash].css'),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
                'CDN': JSON.stringify(CDN)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        }),
        new CopyWebpackPlugin([
            {from: 'assets', to: 'assets', ignore: ['scss/**', 'img/hotels/**', '*.zip']}
        ])
    ]
});