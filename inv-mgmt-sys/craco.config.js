const CracoLessPlugin = require('craco-less');
const { loaderByName } = require('@craco/craco');
const path = require('path');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              hack: `true; @import "${path.resolve(__dirname, 'theme.less')}";`,
            },
            javascriptEnabled: true,
          },
        },
        modifyLessRule(lessRule, context) {
          // You have to exclude these file suffixes first,
          // if you want to modify the less module's suffix
          lessRule.exclude = /\.m\.less$/;
          return lessRule;
        },
        modifyLessModuleRule(lessModuleRule, context) {
          // Configure the file suffix
          lessModuleRule.test = /\.m\.less$/;

          // Configure the generated local ident name.
          const cssLoader = lessModuleRule.use.find(loaderByName('css-loader'));
          cssLoader.options.modules = {
            localIdentName: '[local]_[hash:base64:5]',
          };

          return lessModuleRule;
        },
      },
    },
  ],
  babel: {
    plugins: [
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
        },
      ],
    ],
  },
};
