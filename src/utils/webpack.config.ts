'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


export default function(isDev: boolean) {
    const NODE_ENV = process.env.NODE_ENV || 'development';

    return {
        entry: path.resolve(__dirname, '../../src/client/App.tsx'),
        output: {
            path: path.resolve(__dirname, '../../public'),
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
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use: 'file-loader'
                }
            ]
        },

        plugins: [
            new ExtractTextPlugin('styles.css'),
            new webpack.DefinePlugin({
                '__DEV__': JSON.stringify(isDev),
                'process.env': {
                    'NODE_ENV': `"${NODE_ENV}"`
                }
            })
        ],

        resolve: {
            extensions: ['.js', 'jsx', '.ts', '.tsx', '.css']
        }
    }
}
