'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'dev';
const isDev = NODE_ENV === 'dev';

module.exports = {
    entry: path.resolve(__dirname, 'src/client/App.tsx'),
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
        ]
    },

    plugins: [
        new ExtractTextPlugin('styles.css'),
        new webpack.DefinePlugin({
            '__DEV__': JSON.stringify(isDev)
        })
    ],

    resolve: {
        extensions: ['.js', 'jsx', '.ts', '.tsx', '.css']
    }
};
