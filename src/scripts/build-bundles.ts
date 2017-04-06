import * as fs from 'fs';
import * as webpack from 'webpack';

import WebpackConfig from '../utils/create-webpack-config';

function buildWithWebpack(config: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const compiler = webpack(config);
        compiler.run(function(err, stats) {
            if (err) {
                reject(err);

            } else if (
                stats.compilation.errors &&
                stats.compilation.errors.length > 0
            ) {
                reject(stats.compilation.errors);

            } else {
                resolve();

            }
        });
    });
}

export default function() {
    return buildWithWebpack(WebpackConfig);
}
