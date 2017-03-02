module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".css"]
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { test: /\.css$/, loader: "css-loader?modules" }
        ],

        preLoaders: [
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};