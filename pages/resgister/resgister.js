// pages/resgister/resgister.js
const app = getApp(),
  regfun = app.reg.regfun;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'register',
    phone: '',
    cachephone: [],
    phoneblur: false,
    time: 0,
    code: '',
    codefail: 0,
    pwd: {
      pwd1: '',
      pwd2: '',
    },

    showpwd: true,
    codestate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;

  },
  input: regfun.input,
  blur: regfun.blur,
  focus: regfun.focus,
  changephone: regfun.changephone,
  clearphone: regfun.clearphone,
  // hasphone: regfun.hasphone,
  delphocache: regfun.delphocache,
  togglepwd: regfun.togglepwd,
  codeg: regfun.codeg,
  getcode: regfun.getcode,
  phoneRegs: regfun.phoneRegs,
  usereg: function() {
    // if (!regfun.hasphone.call(this) || !regfun.regphone.call(this) || !regfun.hascode.call(this) || !regfun.regcode.call(this)) {
    //   return;
    // }
    if (!regfun.phoneRegs.call(this)  || !regfun.hascode.call(this) || !regfun.regcode.call(this)) {
      return;
    }
    if (!this.data.pwd.pwd1 || !this.data.pwd.pwd2) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // const pwdreg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    const pwdreg = /([0-9a-zA-Z]){6,16}/;
    if (!pwdreg.test(this.data.pwd.pwd1) || !pwdreg.test(this.data.pwd.pwd2)) {
      wx.showToast({
        title: '密码格式为6-16位的字母或数字',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // if (!regfun.regpwd.call(this, 'pwd1')) {
    //   return;
    // }
    if (this.data.pwd.pwd1 != this.data.pwd.pwd2) {
      wx.showToast({
        title: '密码不一致，请确认后注册',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    app.fetch.newData.result({
      API_URL: app.globalData.b2b + 'smp/register.do?openId=' + app.globalData.openId + '&userName=' + this.data.phone + '&password=' + this.data.pwd.pwd1 + '&smsCode=' + this.data.code,
    }).then(({
      data
    }) => {
      if (data.code == 200) {
        app.globalData.phone = this.data.phone
        wx.showToast({
          title: '注册成功',
          icon: 'none',
          duration: 2000,
          success: function() {
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }, 0)

          }
        })
      } else if (data.code == '100') {
        console.info(data.msg)
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000
        })
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