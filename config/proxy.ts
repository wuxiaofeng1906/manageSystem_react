/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

// 测试服务器地址
export default {
  dev: {
    '/api/verify/': {
      target: 'http://10.0.144.53:5000/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/': {
      target: 'http://10.0.144.53:8300/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },

  // 本地测试地址
  test: {
    '/api/verify/': {
      target: 'http://192.168.10.205:5001/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/': {
      target: 'http://10.0.144.53:8300/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },

  // 正式环境地址
  pre: {
    '/api/verify/': {
      target: 'http://10.0.144.51:5000/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/': {
      // target: 'http://dms.q7link.com:8300/',
      target: 'http://rd.q7link.com:8300/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
