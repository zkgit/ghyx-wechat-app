// pages/remote/remote.js
const app = getApp();
let usercode = '';
const {
  Dialog,
  extend
} = require('../../style/dist/index');
Page(extend({}, Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    is_staticvol: false,
    keynum: 'default',
    svgbg: '/image/remote/remote_default.png',
    keyvolbg: '/image/remote/remote_vol_default.png',
    touchmove: false,
    deviceval: '',
    showdevice: false,
    boxId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryDevice();
    //this.noidtip();
  },
  queryDevice: function() {
    usercode = wx.getStorageSync('userCode');
    if (usercode) {
      var control = {
        API_URL: app.globalData.server + 'b2b-bgctv/smp/queryBind.do?userCode=' + usercode
      }
      app.fetch.newData.result(control).then(res => {
        if (res.data.response.responseHeader.code == '200' && res.data.response.responseBody.deviceNo) {
          this.setData({
            boxId: res.data.response.responseBody.deviceNo
          })
          wx.setStorageSync('boxId', res.data.response.responseBody.deviceNo)
        }
      })
    }
  },

  hidedevice: function() {
    this.setData({
      showdevice: false
    })
  },
  deviceblur: function(e) {
    this.setData({
      deviceval: e.detail.value
    })
  },
  deviceconfrim: function() {
    usercode = wx.getStorageSync('userCode');
    if (!this.data.deviceval) {
      wx.showToast({
        title: '请输入绑定码',
        icon: 'none'
      })
      return;
    }
    app.fetch.newData.result({
      API_URL: app.globalData.b2b + 'smp/bind.do?type=1&userCode=' + usercode + '&deviceNo=' + this.data.deviceval,
    }).then(({
      data
    }) => {
      if (data.code == 200) {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '绑定成功',
          icon: 'none'
        })
        wx.setStorageSync('boxId', this.data.deviceval)
        this.setData({
          showdevice: false,
          boxId: this.data.deviceval
        })
      }
    })

  },
  // noidtip: function() {
  //   this.showZanDialog({
  //     title: '绑定提示',
  //     content: '您需要绑定才能使用该功能',
  //     buttons: [{
  //       text: '取消',
  //       type: 'cancel'
  //     }, {
  //       text: '去绑定',
  //       color: '#ff510d',
  //       type: 'bind'
  //     }]
  //   }).then(({
  //     type
  //   }) => {
  //     if (type == 'bind') {
  //       this.setData({
  //         showdevice: true
  //       })
  //       wx.scanCode({
  //         success: (res) => {
  //           // console.log(app.util.getUrlParam('scene', res.path))
  //           // console.log(wx.getStorageSync('boxId'))
  //           // //设备用户关系绑定
  //           // app.api.newData.result(app.util.getUrlParam('scene', res.path), app.globalData).then(res => {
  //           //   console.info(res)
  //           // })
  //           // // 缓存设备号
  //           // app.wechat.setStorage('boxId', app.util.getUrlParam('scene', res.path))
  //         }
  //       })
  //     }

  //   });
  // },
  changeVol: function() {
    var that = this;
    that.setData({
      is_staticvol: !that.data.is_staticvol
    })
  },
  shownum: function(e) {
    this.setData({
      keynum: e.currentTarget.dataset.key
    })
  },
  svgpress: function(e) {
    var that = this;
    const userCode = wx.getStorageSync('userCode')
    const boxId = wx.getStorageSync('boxId')
    if (!userCode) {
      wx.navigateTo({
        url: "/pages/login/login"
      })
      return false
    }
    if (!boxId) {
      wx.navigateTo({
        url: "/pages/minor/mine_device/mine_device"
      })
      return false
    }
    wx.vibrateShort()
    that.setData({
      touchmove: true
    })
    var keyCode = e.target.dataset.keycode;
    if (keyCode == '38') { //up
      that.setData({
        svgbg: '/image/remote/svg_top.png'
      })
    } else if (keyCode == '39') { //right
      that.setData({
        svgbg: '/image/remote/svg_right.png'
      })
    } else if (keyCode == '40') { //bottom
      that.setData({
        svgbg: '/image/remote/svg_bottom.png'
      })
    } else if (keyCode == '37') { //left
      that.setData({
        svgbg: '/image/remote/svg_left.png'
      })
    } else if (keyCode == '448') { //vol -
      that.setData({
        keyvolbg: '/image/remote/remote_jian.png'
      })
    } else if (keyCode == '447') { //vol +
      that.setData({
        keyvolbg: '/image/remote/remote_jia.png'
      })
    }
    that.sent(e.target.dataset.keycode)
  },
  svgmove: function(e) {
    var that = this;
    if (that.data.touchmove) {
      that.setData({
        touchmove: false
      })
    }
  },
  sent: function(e) {
    var that = this;
    var control = {
      API_URL: app.globalData.remote + 'psm/remote.do',
      data: {
        'key': e,
        'userCode': usercode
      }
    }
    app.fetch.newData.result(control).then(res => {

    })

  },
  svgend: function() {
    var that = this;
    setTimeout(function() {
      that.setData({
        svgbg: '/image/remote/remote_default.png',
        keyvolbg: '/image/remote/remote_vol_default.png'
      })
    }, 200);
  },
  // 判断是否登陆绑定
  checkFun:function(){
    const userCode = wx.getStorageSync('userCode');
    const boxId = wx.getStorageSync('boxId');
    if (!userCode) {
      wx.navigateTo({
        url: "/pages/login/login"
      })
      return false
    }
    if (!boxId) {
      wx.navigateTo({
        url: "/pages/minor/mine_device/mine_device"
      })
      return false
    }
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
    this.queryDevice();
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
}));