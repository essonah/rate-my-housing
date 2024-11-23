const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ... other webpack configuration ...
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};