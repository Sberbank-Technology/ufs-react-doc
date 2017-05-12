import * as path from 'path';
import * as webpack from 'webpack';
var ExtractTextPlugin = require('extract-text-webpack-plugin');

import config, { CACHE_DIR_PATH } from './config';

export default function (isDev: boolean) {
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
                    include: path.resolve(__dirname, '../../src'),
                    loader: 'ts-loader'
                },
                {
                    test: /\.css$/,
                    include: path.resolve(__dirname, '../../src'),
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader',
                    }),
                },
                {
                    test: /\.json$/,
                    include: CACHE_DIR_PATH,
                    loader: 'json-loader'
                }
            ].concat(config.webpackLoaders)
        },
        resolve: {
            extensions: [
                '.tsx', '.ts', '.jsx', '.js', '.css'
            ].concat(config.webpackExtensions)
        },
        resolveLoader: {
            modules: [
                path.resolve(__dirname, '../../node_modules'),
                path.resolve(__dirname, '../../src/loaders'),
                config.webpackLoadersDir
            ]
        },
        plugins: [
            new ExtractTextPlugin('styles.css'),
            new webpack.DefinePlugin({
                '__DEV__': JSON.stringify(isDev),
                'process.env': {
                    'NODE_ENV': `"${NODE_ENV}"`
                }
            }),
            new webpack.LoaderOptionsPlugin({
                options: {
                    examples: config
                }
            })
        ]
    };
}