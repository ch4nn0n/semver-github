const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VersionFilePlugin = require('webpack-version-file-plugin');

module.exports = {
    entry: {
        content: './src/js/content.js'
    },
    output: {
        path: path.resolve(__dirname, './dist/src'),
        filename: './js/[name].js'
    },
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, './dist/*')]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './src'),
            to: path.resolve(__dirname, './dist')
        }], {
            ignore: ['js/**/*', 'manifest.ejs'],
            copyUnmodified: true
        }),
        new VersionFilePlugin({
            packageFile: path.resolve(__dirname, './package.json'),
            template: path.resolve(__dirname, './manifest.ejs'),
            outputFile: path.resolve(__dirname, './dist/manifest.json'),
        })
    ]
};
