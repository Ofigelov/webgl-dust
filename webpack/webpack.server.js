const webpack = require('webpack');

module.exports = () => {
    console.log('\nDEV SERVER BUILD\n');

    return {
        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            hot: true,
            disableHostCheck: true,
            writeToDisk: true,
            clientLogLevel: 'silent',
        },
        output: {
            filename: '[name].[hash].mjs',
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 2,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [new webpack.HotModuleReplacementPlugin()],
    };
};
