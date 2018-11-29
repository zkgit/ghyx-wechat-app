// pages/mine/mine.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin:false,
    havaNewMessage:false,
    hasBind:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var usercode = wx.getStorageSync('userCode');
    if (usercode){
      this.setData({
        hasLogin: true
      })
    }else{
      this.setData({
        hasLogin: false
      })
    };
    // this.setData({
    //   nickName: app.globalData.nickName,
    //   avatarUrl: app.globalData.avatarUrl
    // })
  },
  queryBind: function () {
    var that = this;
    var usercode = wx.getStorageSync('userCode');
    if (usercode) {
      app.fetch.newData.result({
        API_URL: app.globalData.server + 'b2b-bgctv/smp/queryBind.do',
        data: {
          'userCode': usercode
        }
      }).then(res => {
        if (res.data.response.responseHeader.code == 200) {
          if (res.data.response.responseBody.deviceNo){
            that.setData({
              hasBind: true
            });
          }
        }else{
          that.setData({
            hasBind: false
          });
        }
      }).catch(() => {
        that.setData({
          hasBind: false
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getTotalNum: function () {
    var allMyVideo = {
      API_URL: app.globalData.base + 'users/message/total.json',
      data: {
        'openId': app.globalData.openId
      }
    }
    app.fetch.newData.result(allMyVideo).then(res => {
      if (res.data.response.responseBody>0) {
        this.setData({
          havaNewMessage: true
        })
      }else{
        this.setData({
          havaNewMessage: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取网络状态
    var that = this;
    app.wechat.getNetStatus().then(res => {
      if (res.networkType == 'none') {//无网络状态
        that.setData({
          nonet: true
        });
        return
      } else {
        that.setData({
          nonet: false
        })
      }
    });
    var usercode = wx.getStorageSync('userCode');
    if (usercode) {
      that.setData({
        hasLogin: true
      })
    } else {
      that.setData({
        hasLogin: false
      })
    };
    that.queryBind();
    that.getTotalNum();
  },
  unloading:function(){
    wx.removeStorageSync('userCode')
    wx.removeStorageSync('boxId')
    this.onLoad()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})