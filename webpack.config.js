const merge = require('webpack-merge');
const baseConfig = require('./webpack/webpack.base.js');
const serverConfig = require('./webpack/webpack.server.js');
const staticConfig = require('./webpack/webpack.static.js');
const prodConfig = require('./webpack/webpack.prod.js');

const IS_MODERN = true;

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';
    const isWatch = argv.watch === true;
    const isAnalyze = env && env.anlz;
    const isDevServer = env && env.server;

    // eslint-disable-next-line no-console
    console.log(isDev ? '\nDEVELOPMENT BUILD\n' : '\nPRODUCTION BUILD\n');

    if (isDevServer) {
        return merge.smart(baseConfig(!IS_MODERN, isDev, false), serverConfig());
    }

    if (isDev) {
        return merge.smart(
            baseConfig(!IS_MODERN, isDev, isWatch),
            staticConfig(isAnalyze, !IS_MODERN)
        );
    }

    return [
        merge.smart(
            baseConfig(!IS_MODERN, isDev, isWatch),
            staticConfig(isAnalyze, !IS_MODERN),
            prodConfig()
        ),
        merge.smart(
            baseConfig(IS_MODERN, isDev, isWatch),
            staticConfig(isAnalyze, IS_MODERN),
            prodConfig()
        ),
    ];
};
