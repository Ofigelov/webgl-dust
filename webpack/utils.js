const _ = require('lodash');

const _seed = {};
const configureManifest = (_entrypoints) => ({
    seed: _seed,
    filter: ({ name }) => !name.endsWith('.map') || !name.endsWith('.txt'),

    generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, { name, path }) => {
            manifest[name] = path;
            return manifest;
        }, seed);

        const entrypointFiles = {};

        for (const [key, value] of Object.entries(entrypoints)) {
            let _value = value;

            if (key !== 'app') {
                _value = value.filter((fileName) => !fileName.includes('runtime'));
            }

            const js = _value
                .filter((fileName) => fileName.endsWith('.js'))
                .map((file) => `/dist/${file}`);
            const mjs = _value
                .filter((fileName) => fileName.endsWith('.mjs'))
                .map((file) => `/dist/${file}`);
            const css = _value
                .filter((fileName) => fileName.endsWith('.css'))
                .map((file) => `/dist/${file}`);

            _.set(entrypointFiles, `${key}.js`, js);
            _.set(entrypointFiles, `${key}.mjs`, mjs);
            _.set(entrypointFiles, `${key}.css`, css);

            // eslint-disable-next-line no-restricted-syntax
            for (const [fileName, filePath] of Object.entries(manifestFiles)) {
                const fileRegexp = /(?<name>[\w][\w-]*).(?<hash>[a-zA-Z0-9]*).(?<ext>[\w]{2,4}$)/;

                if (fileName.match(fileRegexp)) {
                    const groups = fileName.match(fileRegexp).groups;

                    if (groups && groups.name === key && fileName.endsWith('.svg')) {
                        _.set(entrypointFiles, `${key}.svg`, [filePath.replace('./', '')]);
                    }
                }
            }
        }

        return {
            files: manifestFiles,
            entrypoints: _.merge(_entrypoints, entrypointFiles),
        };
    },
});

module.exports = {
    configureManifest,
};
