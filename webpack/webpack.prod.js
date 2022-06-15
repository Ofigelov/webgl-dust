const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
    return {
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        sourceMap: true,
                        compress: {
                            toplevel: true,
                            passes: 3,
                        },
                    },
                }),
            ],
        },
    };
};
