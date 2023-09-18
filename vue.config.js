/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
  },
  productionSourceMap: false,
  devServer: {
    open: true,
    port: 23456,
    proxy: {
      'sys': {
         target: 'http://localhost:8080'
         //target: 'http://localhost:8080/v1' 开发环境不走网关
      }
    },
    overlay: {
      errors: true,
      warnings: true
    }
  }
}
