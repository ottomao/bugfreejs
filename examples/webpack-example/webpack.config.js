const path = require('path');
const BugfreePlugin = require('bugfreejs/webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new BugfreePlugin({
      faith: 'default', // 'default' | 'alpaca' | 'god'
    }),
  ],
};
