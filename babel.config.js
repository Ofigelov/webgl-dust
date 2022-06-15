module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: { version: 3, proposals: true },
            },
        ],
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-object-assign',
        'syntax-trailing-function-commas',
    ],
    env: {
        production: {
            plugins: [
                [
                    'transform-react-remove-prop-types',
                    {
                        mode: 'remove',
                        removeImport: true,
                        ignoreFilenames: ['node_modules'],
                    },
                ],
            ],
        },
    },
};
