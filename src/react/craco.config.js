const CracoLessPlugin = require("craco-less");
const vars = require("./antd.theme.js");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: vars,
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
