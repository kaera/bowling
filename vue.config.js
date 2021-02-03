// Enable shadow css in dev mode
module.exports = {
  chainWebpack: (config) => {
    [
      config.module.rule("vue").use("vue-loader"),
      config.module
        .rule("css")
        .oneOf("vue")
        .use("vue-style-loader"),
    ].forEach((c) =>
      c.tap((options) => {
        options.shadowMode = true;
        return options;
      }),
    );
  },
};
