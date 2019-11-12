export const developRouter = {
  name: '开发者工具',
  routes: [
    {
      path: '/base64',
      name: 'base64',
      meta: {
        label: 'BASE64',
        title: 'base64转换',
        icon: '#route-base64',
        name: 'base64编码解码',
        desc: '字符与base64互转，图片与base64互转',
        createTime: '545440088000',
        hot: false
      },
      component: require('@/components/tools/developer/Base64').default
    },
    {
      path: '/json',
      name: 'json',
      meta: {
        label: 'JSON',
        title: 'JSON格式化',
        icon: '#route-json',
        name: 'JSON格式化',
        desc: '可以对JSON代码进行格式化和美化',
        createTime: '545440088000',
        hot: false
      },
      component: require('@/components/tools/developer/Json').default
    },
    // {
    //   path: '/qrcode',
    //   name: 'qrcode',
    //   meta: {
    //     label: '二维码',
    //     title: '二维码生成',
    //     icon: '#route-qrcode',
    //     name: '二维码生成',
    //     desc: '将字符生成二维码，可下载生成的二维码',
    //     createTime: '545440088000',
    //     hot: false
    //   },
    //   component: require('@/components/tools/developer/Qrcode').default
    // },
    // {
    //   path: '/base64',
    //   name: 'base64',
    //   meta: {
    //     label: 'BASE64',
    //     title: 'base64转换',
    //     icon: '#route-base64',
    //     name: 'base64编码解码',
    //     desc: '字符与base64互转，图片与base64互转',
    //     createTime: '545440088000',
    //     hot: false
    //   },
    //   component: require('@/components/tools/developer/Base64').default
    // },
    // {
    //   path: '/json',
    //   name: 'json',
    //   meta: {
    //     label: 'JSON',
    //     title: 'JSON格式化',
    //     icon: '#route-json',
    //     name: 'JSON格式化',
    //     desc: '可以对JSON代码进行格式化和美化',
    //     createTime: '545440088000',
    //     hot: false
    //   },
    //   component: require('@/components/tools/developer/Base64').default
    // },
    // {
    //   path: '/qrcode',
    //   name: 'qrcode',
    //   meta: {
    //     label: '二维码',
    //     title: '二维码生成',
    //     icon: '#route-qrcode',
    //     name: '二维码生成',
    //     desc: '将字符生成二维码，可下载生成的二维码',
    //     createTime: '545440088000',
    //     hot: false
    //   },
    //   component: require('@/components/tools/developer/Base64').default
    // }
  ]
}

export const convenienceRouter = {
  name: '便民工具',
  routes: [
    {
      path: '/base64',
      name: 'base64',
      meta: {
        label: 'BASE64',
        title: 'base64转换',
        icon: '#route-base64',
        name: 'base64编码解码',
        desc: '字符与base64互转，图片与base64互转',
        createTime: '545440088000',
        hot: false
      },
      component: require('@/components/tools/developer/Base64').default
    },
    {
      path: '/base64',
      name: 'base64',
      meta: {
        label: 'BASE64',
        title: 'base64转换',
        icon: '#route-base64',
        name: 'base64编码解码',
        desc: '字符与base64互转，图片与base64互转',
        createTime: '545440088000',
        hot: false
      },
      component: require('@/components/tools/developer/Base64').default
    },
    {
      path: '/json',
      name: 'json',
      meta: {
        label: 'JSON',
        title: 'JSON格式化',
        icon: '#route-json',
        name: 'JSON格式化',
        desc: '可以对JSON代码进行格式化和美化',
        createTime: '545440088000',
        hot: false
      },
      component: require('@/components/tools/developer/Base64').default
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      meta: {
        label: '二维码',
        title: '二维码生成',
        icon: '#route-qrcode',
        name: '二维码生成',
        desc: '将字符生成二维码，可下载生成的二维码',
        createTime: '545440088000',
        hot: false
      },
      component: require('@/components/tools/developer/Base64').default
    },
    {
      path: '/base64',
      name: 'base64',
      meta: {
        label: 'BASE64',
        title: 'base64转换',
        icon: '#route-base64',
        name: 'base64编码解码',
        desc: '字符与base64互转，图片与base64互转',
        createTime: '545440088000',
        hot: false
      },
      component: require('@/components/tools/developer/Base64').default
    },
    {
      path: '/json',
      name: 'json',
      meta: {
        label: 'JSON',
        title: 'JSON格式化',
        icon: '#route-json',
        name: 'JSON格式化',
        desc: '可以对JSON代码进行格式化和美化',
        createTime: '545440088000',
        hot: false
      },
      component: require('@/components/tools/developer/Base64').default
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      meta: {
        label: '二维码',
        title: '二维码生成',
        icon: '#route-qrcode',
        name: '二维码生成',
        desc: '将字符生成二维码，可下载生成的二维码',
        createTime: '545440088000',
        hot: false
      },
      component: require('@/components/tools/developer/Base64').default
    }
  ]
}

export const routes = [
  developRouter,
  convenienceRouter
]