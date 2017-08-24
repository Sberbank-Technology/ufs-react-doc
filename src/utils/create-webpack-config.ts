import * as path from 'path';
import * as webpack from 'webpack';
import GenerateJSON from '../webpack-plugins/generate-json';
import config, { CACHE_DIR_PATH } from './config';
import getPackagePath from './get-package-path';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

export default function (isDev: boolean) {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const PORT = process.env.PORT || '3000';

    const entry = [
        path.resolve(__dirname, '../../lib/client/App.js')
    ];

    const plugins = [
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
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new GenerateJSON()
    ];

    if (isDev) {
        entry.push('webpack/hot/dev-server'),
        entry.push('webpack-hot-middleware/client')

        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return {
        entry,
        output: {
            path: path.resolve(__dirname, '../../public'),
            publicPath: isDev ? `/public/` : '',
            filename: 'bundle.js',
            chunkFilename: '[name].bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include: path.resolve(__dirname, '../../lib'),
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
            alias: {
                'webpack-hot-middleware': getPackagePath('webpack-hot-middleware')
            },
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

        plugins,
        cache: true
    };
}
