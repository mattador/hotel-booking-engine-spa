var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
const CDN = process.env.CDN = '';

module.exports = webpackMerge(commonConfig, {
    devtool: 'inline-source-map',

    module: {
        rules: [{
            test: /\.ts$/,
            loaders: [{
                loader: 'awesome-typescript-loader',
                options: {configFileName: 'tsconfig.json'}
            }, 'angular2-template-loader']
        }]
    },

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:8080/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
                'CDN': JSON.stringify(CDN)
            }
        })
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});