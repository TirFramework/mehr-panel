const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.sass(
  "resources/admin/src/assets/custom.scss",
  "/public/../../admin-assets/css"
);

mix
  .js("resources/admin/src/index.js", "/public/../../admin-assets/js")
  .react()
  .postCss(
    "resources/admin/src/assets/tailwindcss.css",
    "public/admin-assets/css",
    [require("tailwindcss")]
  )
  //   .less("resources/less/app.less", "/public/../../admin-assets/css", {
  //     lessOptions: {
  //       modifyVars: {
  //         // 'primary-color': '#00ff00',
  //       },
  //       javascriptEnabled: true,
  //     },
  //   })
  .version();

mix.browserSync("localhost:8000");
