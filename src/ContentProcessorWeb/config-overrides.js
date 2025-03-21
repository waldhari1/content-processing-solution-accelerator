const { override, addWebpackModuleRule, addWebpackResolve } = require('customize-cra');

console.log('Applying config-overrides.js...');

module.exports = override(
  addWebpackModuleRule({
    test: /\.md$/,
    use: 'raw-loader',
  }),
  addWebpackResolve({
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  }),
);
