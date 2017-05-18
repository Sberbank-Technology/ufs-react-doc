var path = require('path');

const projectDir = path.resolve(__dirname, 'src');
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');

module.exports = {
    srcPath: "src/index.tsx",
    projectType: "typescript",
    webpackLoaders: [
        {
            test: /\.tsx?$/,
            include: projectDir,
            use: [{
                loader: "ts-loader",
                options: {
                    configFileName: tsconfigPath
                }
            }]
        },
        {
            test: /\.css$/,
            include: projectDir,
            loader: "style-loader!css-loader"
        }
    ]
}
