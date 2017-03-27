'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-eval-source-map',
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
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    }
};
