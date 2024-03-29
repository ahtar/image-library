const fs = require('fs');
const webpack = require('webpack');

module.exports = {
    assetsDir: 'assets',
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                'process.browser': 'true',
            }),
        ],
    },
    devServer: {
        https: {
            key: fs.readFileSync('cert.key'),
            cert: fs.readFileSync('cert.crt'),
            ca: fs.readFileSync('ca.crt'),
        },
        disableHostCheck: true,
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `
            @import "~@/styles/variables.scss";
            @import "~@/styles/mixins.scss";
        `,
            },
        },
    },
    transpileDependencies: ['@vueuse/head'],
};
