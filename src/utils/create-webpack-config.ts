import * as path from 'path';
import * as webpack from 'webpack';

import config, { CACHE_DIR_PATH } from './config';

const result = {
    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        path.resolve(__dirname, '../../src/client/index.tsx'),
    ],
    output: {
        path: '/',
        publicPath: 'http://localhost:3000/public/',
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
                test: /\.json$/,
                include: CACHE_DIR_PATH,
                loader: 'json-loader'
            }
        ].concat(config.webpackLoaders)
    },
    resolve: {
        extensions: [
            '.tsx', '.ts', '.jsx', '.js'
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
        new webpack.LoaderOptionsPlugin({
            options: {
                examples: config
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};
export default result;
