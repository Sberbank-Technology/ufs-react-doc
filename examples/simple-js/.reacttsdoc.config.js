var path = require('path');

const dir = path.resolve(__dirname, 'src');

module.exports = {
    srcPath: "src/index.js",
    projectType: "javascript",
    webpackLoaders: [
        {
            test: /\.jsx?$/,
            include: dir,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        'es2015',
                        'react',
                        'stage-0'
                    ]
                }
            }]
        },
        {
            test: /\.css?$/,
            include: dir,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }
            ]
        }
    ]
}
