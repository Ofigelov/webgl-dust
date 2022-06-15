const webpack = require('webpack');
const path = require('path');
const entry = require('./webpack.entry.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const babelConfig = require('../babel.config.js');
const _ = require('lodash');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');

module.exports = (isModern, isDev, isWatch = false) => ({
    devtool: 'source-map',
    entry,
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            'node_modules',
            path.resolve(__dirname, '../'),
            path.resolve(__dirname, '../src'),
        ],
        alias: {
            'style-settings': path.resolve(__dirname, '../src/general/scss/settings/index.scss'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(jsx?)$/,
                exclude: [/node_modules(?!(\/|\\)@deleteagency)/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: _.merge(babelConfig, {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            esmodules: isModern,
                                        },
                                        bugfixes: isModern,
                                    },
                                ],
                            ],
                        }),
                    },
                ],
            },
            {
                test: /\.(tsx?)$/,
                exclude: [/node_modules(?!(\/|\\)@deleteagency)/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: _.merge(babelConfig, {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            esmodules: isModern,
                                        },
                                        bugfixes: isModern,
                                    },
                                ],
                            ],
                        }),
                    },
                    {
                        loader: 'thread-loader',
                        options: {
                            // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                            workers: require('os').cpus().length - 1,
                            poolTimeout: isWatch ? Infinity : 500, // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true, // for thread-loader
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                exclude: /svg[\/\\]/,
                loader: 'file-loader',
                options: {
                    name: 'images/[path][name].[ext]',
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
            {
                test: /\.svg$/,
                include: /svg[\/\\]/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: 'icon-[name]',
                            extract: true,
                            spriteFilename: '[chunkname].[hash:6].svg',
                        },
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                { name: 'removeNonInheritableGroupAttrs' },
                                { name: 'collapseGroups' },
                            ],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        isWatch ? new CleanObsoleteChunks() : false,
        new ForkTsCheckerWebpackPlugin(),
        new DuplicatePackageCheckerPlugin(),
        new webpack.DefinePlugin({
            'env.MODE': JSON.stringify(isDev ? 'development' : 'production'),
        }),
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {
                            source: path.resolve(__dirname, '../src/html'),
                            destination: path.resolve(__dirname, '../dist'),
                        },
                    ],
                },
            },
        }),
    ].filter(Boolean),
    stats: {
        children: false,
    },
});
