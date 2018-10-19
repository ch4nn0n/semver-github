const merge = require('webpack-merge');
const common = require('./webpack.common');

const CrxPlugin = require('crx-webpack-plugin');

const pkg = require('./package.json');
const appName = `${pkg.name}-${pkg.version}`;

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CrxPlugin({
            keyFile: './mykey.pem',
            contentPath: './dist',
            outputPath: './dist',
            name: appName
        })
    ]
});
