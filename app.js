'use strict';

/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
var wechat = require('./utils/wechat.js');
var util = require('./utils/util.js');
var fetch = require('./utils/fetch.js');
var api = require('./utils/api.js');
var regfun = require('./utils/resgister.js');
App({
  /**
   * Global shared
   * 可以定义任何成员，用于在整个应用中共享
   */
  data: {
    nickName: '',
    avatarUrl: '',
    activateStatus: '',
    acessTvName: '', //首页直播
  },

  /**
   * WeChat API
   */
  wechat: wechat,
  /**
   * fetch API
   */
  fetch: fetch,
  /**
   * util API
   */
  util: util,

  api: api,
  reg: regfun,
  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function onLaunch(options) {
    // 登陆获取code给接口返回openid放在全局中
    this.wechat.login().then(res => {
      return res.code
    }).then(code => {
      // this.wechat.getUserInfo().then(res => {
      //   console.log('info=', res)
      //   this.globalData.nickName = res.userInfo.nickName
      //   this.globalData.avatarUrl = res.userInfo.avatarUrl
      //   return res.rawData
      // }).then(userInfo => { 
      // })

      var _login = {
        API_URL: this.globalData.b2b + 'wxapp/init.do',
        data: {
          code: code,
        }
      }
      this.fetch.newData.result(_login).then(res => {
        this.globalData.openId = res.data.openId;
        console.info(this.globalData.openId)
        // if (options.scene == '1011' || options.scene == '1012' || options.scene == '1013' || options.scene == '1047' || options.scene == '1048' || options.scene == '1049') {
        //   !this.globalData.openId || this.api.newData.result(wx.getStorageSync('boxId'), this.globalData).then(res => {
        //     wx.showToast({
        //       title: '绑定成功',
        //       icon: 'none',
        //       duration: 2000
        //     })
        //   })
        // }
      })
    })
    // 获取设备的信息并存储
    // const _systemres = wx.getSystemInfo()
    // this.wechat.setStorage('deciceW', _systemres.windowWidth)
    // this.wechat.setStorage('deciceH', _systemres.windowHeight)

    // 获取设备的信息并存储
    wx.getSystemInfo({
      success: function (res) {
        wx.setStorageSync('deciceW', res.windowWidth)
        wx.setStorageSync('deciceH', res.windowHeight)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
      }
    })

    //获取网络状态
    // this.wechat.getNetStatus().then(res => {
    //   if (res.networkType == 'none') {//无网络状态
    //     wx.setStorageSync('nonetStatus', true);
    //   }else{
    //     wx.setStorageSync('nonetStatus', false);
    //   }
    // });

  },
  // globalData: {
  //   b2b: 'https://nginx-proxy.pre.gehua.net.cn/miniprogram/b2b-bgctv/',
  //   server: 'https://nginx-proxy.pre.gehua.net.cn/miniprogram/',
  //   base: 'https://nginx-proxy.pre.gehua.net.cn/miniprogram/ghyx-api/api/v1/',
  //   user: 'https://nginx-proxy.pre.gehua.net.cn/miniprogram/wechat_programs/',
  //   openId: '',
  //   remote: 'https://nginx-proxy.pre.gehua.net.cn/miniprogram/b2b-bgctv/'
  // },
  globalData: {
    b2b: 'https://yfsxcx.yun.gehua.net.cn/b2b-bgctv/',
    server: 'https://yfsxcx.yun.gehua.net.cn/',
    base: 'https://yfsxcx.yun.gehua.net.cn/ghyx-api/api/v1/',
    user: 'https://yfsxcx.yun.gehua.net.cn/wechat_programs/',
    openId: '',
    remote: 'https://yfsxcx.yun.gehua.net.cn/b2b-bgctv/'
  },
  //推送获取鉴权
  activateBoxAccess: function() {
    var that = this;
    var _activate = {
      API_URL: this.globalData.user + 'wxapp/activate/boxAccess',
      data: {
        'boxId': wx.getStorageSync('boxId'),
      }
    }
    that.fetch.newData.result(_activate).then(res => {
      wx.setStorageSync('activateStatus', res.data.return_code);
    })
  },
  onShow: function(options) {
  }
})