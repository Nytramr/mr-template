const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');

const PROD_ENV = 'prod';

module.exports = (args) => {
  let { config_build_env: env = PROD_ENV, config_terser: miniFile } = args;
  miniFile = miniFile || env === PROD_ENV;

  let plugins = [commonjs(), nodeResolve()];

  if (miniFile) {
    plugins.push(terser());
  }

  return [
    {
      input: 'src/index.js',
      output: [
        {
          file: 'dist/bundle.cjs',
          format: 'cjs',
          sourcemap: miniFile,
        },
        {
          file: 'dist/bundle.mjs',
          format: 'es',
          sourcemap: miniFile,
        },
        {
          file: 'dist/mr-template.js',
          format: 'iife',
          name: 'mrTemplate',
          sourcemap: miniFile,
        },
      ],
      plugins,
    },
    {
      input: 'src/index.js',
      output: {
        file: 'gh-pages/playground/js/bundle/mr-template.js',
        format: 'iife',
        name: 'mrTemplate',
        sourcemap: miniFile,
      },
      plugins,
    },
  ];
};
