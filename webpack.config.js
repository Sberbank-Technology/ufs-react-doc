'use strict';

const path = require('path');
const webpack = require('webpack');

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
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
            },
        ]
    },

    resolve: {
        extensions: ['.js', 'jsx', '.ts', '.tsx', '.css']
    }
};
