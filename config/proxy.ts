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
      pathRewrite: {'^': ''},
    },
    '/api/': {
      target: 'http://10.0.144.53:8380/', // 原始端口：8300
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/identity/Attachment/': {
      target: 'http://identity.nx-temp1-k8s.e7link.com/',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/postImage/': {
      target: 'http://s3.cn-northwest-1.amazonaws.com.cn/',
      changeOrigin: true,
      pathRewrite: {'/postImage/': ''},
    },
  },

  // 本地测试地址
  test: {
    '/api/verify/': {
      target: 'http://10.0.144.53:5000/',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/api/': {
      target: 'http://10.0.144.53:8380/',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/identity/Attachment/': {
      target: 'http://identity.nx-temp1-k8s.e7link.com/',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/postImage/': {
      target: 'http://s3.cn-northwest-1.amazonaws.com.cn/',
      changeOrigin: true,
      pathRewrite: {'/postImage/': ''},
    },
  },

  // 正式环境地址
  pre: {
    '/api/verify/': {
      target: 'http://10.0.144.51:5000/',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/api/': {
      // target: 'http://dms.q7link.com:8300/',
      target: 'http://rd.q7link.com:8300/',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/identity/Attachment/': {
      target: 'http://identity.nx-temp1-k8s.e7link.com/',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/postImage/': {
      target: 'http://s3.cn-northwest-1.amazonaws.com.cn/',
      changeOrigin: true,
      pathRewrite: {'/postImage/': ''},
    },
  },
};
