const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  // transpileDependencies: true,
  // 设置运行的基础地址
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  // 由于打包有warning提示，有些文件超过了限制，所以设置一下
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 524288 * 10,
      maxEntrypointSize: 524288 * 10
    }
  }
});
