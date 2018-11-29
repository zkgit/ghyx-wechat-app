const app = getApp(),
  regfun = app.reg.regfun;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    cachephone: [],
    phoneblur: false,
    showpwd: true,
    phoneRegNum: '',
    pwdRegNum:'',
    pwd: {
      pwd1: ''
    },
    pwdfail: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    if (app.globalData.phone) {
      this.setData({
        phone: app.globalData.phone
      })
    }
  },
  input: regfun.input,
  blur: regfun.blur,
  focus: regfun.focus,
  changephone: regfun.changephone,
  clearphone: regfun.clearphone,
  delphocache: regfun.delphocache,
  togglepwd: regfun.togglepwd,
  regpwd: regfun.regpwd,
  uselogin: function(e) {
    var that = this
    // if(!regfun.phoneRegs.call(this))return;
    // if (!regfun.regpwd.call(this)) return;
    const phonereg = /^[1][3,4,5,7,8][0-9]{9}$/,pwdreg = /([0-9a-zA-Z]){6,16}/;
    var userPhone = e.detail.value.userPhone;
    var userPwd = e.detail.value.userPwd;
    if (!phonereg.test(userPhone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        phoneblur: true
      })
      return
    };
    if (!userPwd) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!pwdreg.test(userPwd)) {
      wx.showToast({
        title: '密码格式为6-16位的字母+数字',
        icon: 'none',
        duration: 2000
      })
      return
    };
    // if (!this.data.pwd.pwd1) {
    //   wx.showToast({
    //     title: '请输入密码',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }
    app.fetch.newData.result({
      // API_URL: app.globalData.b2b + 'smp/login.do?openId=' + app.globalData.openId + '&userName=' + this.data.phone + '&password=' + this.data.pwd.pwd1,
      API_URL: app.globalData.b2b + 'smp/login.do?openId=' + app.globalData.openId + '&userName=' + userPhone + '&password=' + userPwd,
    }).then(({
      data
    }) => {
      if (data.response && data.response.responseHeader && data.response.responseHeader.code == '104') {
        wx.showModal({
          title: '密码错误5次,请稍候登录'
        })
      } else if (data.response && data.response.responseHeader && data.response.responseHeader.code == '105') {
        this.data.pwdfail++;
        this.setData({
          pwdfail: this.data.pwdfail
        })
        if (data.response.responseBody.pwdErrorCount == 5) {
          wx.showModal({
            title: '密码错误5次，请5分钟后重试',
            content: '是否设置新密码',
            cancelColor: '#000',
            confirmColor: '#ff510d',
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/resetpwd/resetpwd'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showToast({
            title: '密码错误' + data.response.responseBody.pwdErrorCount + '次',
            icon: 'none',
            duration: 2000
          })
        }
        return;
      } else if (data.response && data.response.responseHeader && data.response.responseHeader.code == '200') {
        app.wechat.setStorage('userCode', data.response.responseBody.userCode).then(res => {
          that.queryBind()
        })       
        wx.setStorageSync('loginPhone', that.data.phoneRegNum);
        wx.showToast({
          title: '登录成功',
          icon: 'none',
          duration: 2000,
          success: function() {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        })
      }
    })
  },
  queryBind: function() {
    var that = this;
    var usercode = wx.getStorageSync('userCode');
    app.fetch.newData.result({
      API_URL: app.globalData.server + 'b2b-bgctv/smp/queryBind.do',
      data: {
        'userCode': usercode
      }
    }).then(res => {
      if (res.data.response.responseHeader.code == 200) {
        const deviceNo = res.data.response.responseBody.deviceNo
        wx.setStorageSync('boxId', deviceNo);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})