const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/backend'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets', './src/data', './src/client', { glob: '.env*', input: './src/', output: '.' }],
      // TODO: add production values
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
