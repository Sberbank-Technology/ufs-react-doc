var path = require('path');

const projectDir = path.resolve(__dirname, 'src');
module.exports = {
    srcPath: "src/index.tsx",
    projectType: "typescript",
    webpackLoaders: [
        {
            test: /\.tsx?$/,
            include: projectDir,
            loader: "ts-loader"
        },
        {
            test: /\.css$/,
            include: projectDir,
            loader: "style-loader!css-loader"
        }
    ]
}
