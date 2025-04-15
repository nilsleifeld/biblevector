import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: {
      'lit-html': './node_modules/lit-html/lit-html.js',
      'lit-html-directives-repeat': './node_modules/lit-html/directives/repeat.js',
      clsx: './node_modules/clsx/dist/clsx.mjs',
      'tailwind-merge': './node_modules/tailwind-merge/dist/bundle-mjs.mjs',
    },
    output: { dir: './static/libs', format: 'esm' },
    plugins: [
      nodeResolve({
        browser: true,
      }),
    ],
  },
];
