module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        `
      }
    }
  },

  publicPath: '',

  pluginOptions: {
    cordovaPath: 'src-cordova'
  }
};
