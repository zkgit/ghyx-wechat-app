const app = getApp()
const { Dialog, Toast, extend } = require('../../../style/dist/index');
Page(extend({}, Dialog, Toast, {

  data: {
    hasBind:false,//是否绑定
    showBottomPopup:false,//是否显示弹窗
    showdevice: false,//是否显示弹窗
    inputVal:'',//绑定码输入框的值
    deviceNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryBind();
  },
  queryBind:function(){
    var that = this;
    var usercode = wx.getStorageSync('userCode');
    if (usercode){
      app.fetch.newData.result({
        API_URL: app.globalData.server + 'b2b-bgctv/smp/queryBind.do',
        // userCode=登录时返回的userCode，deviceNo=设备码，type=0：绑定、1：解绑
        data: {
          'userCode': usercode
        }
      }).then(res => {
        if (res.data.response.responseHeader.code == 200) {
          wx.setStorageSync('boxId', res.data.response.responseBody.deviceNo);
          that.setData({
            hasBind: true,
            deviceNo: res.data.response.responseBody.deviceNo
          });
        }
      }).catch(() => {
        that.setData({
          hasBind: false
        });
      });
    }
  },

  deviceconfrim: function (e) {
    var that = this;
    var usercode = wx.getStorageSync('userCode');
    var val = e.detail.value.code;
    if (!val) {
      wx.showToast({
        title: '请输入绑定码',
        icon: 'none'
      })
      return;
    }else{
      app.fetch.newData.result({
        API_URL: app.globalData.server + 'b2b-bgctv/smp/bind.do',
        // userCode=登录时返回的userCode，deviceNo=设备码，type=0：绑定、1：解绑
        data: {
          'userCode': usercode,
          'deviceNo': val,
          'type': 0
        }
      }).then(res => {
        if (res.data.code==200){
          that.setData({
            showdevice: false,
            hasBind: true   
          });
          // that.showZanToast({
          //   title: '绑定成功',
          //   icon: 'none'
          // }, 1500);
          wx.showToast({
            title: '绑定成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          that.queryBind();
        }else{
          // that.showZanToast({
          //   title: res.data.msg ,
          //   icon: 'none'
          // }, 1500);
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }  
        }).catch(() => {
          wx.showToast({
            title: '绑定失败，可重新输入绑定码',
            icon: 'none'
          })
        });
    } 
  },
  //解除绑定
  unBind:function(){
    var that = this;
    var usercode = wx.getStorageSync('userCode');
    app.fetch.newData.result({
      API_URL: app.globalData.server + 'b2b-bgctv/smp/bind.do',
      // userCode=登录时返回的userCode，deviceNo=设备码，type=0：绑定、1：解绑
      data: {
        'userCode': usercode,
        'deviceNo': that.data.deviceNo,
        'type': 1
      }
    }).then(res => {
      if(res.data.code==200){
        that.showZanToast({
          title: '解绑成功',
          icon: 'fail'
        }, 1500);
        that.setData({
          showdevice: false,
          hasBind: false
        })
        wx.setStorageSync('boxId', "");
      }else{
        wx.showToast({
          title: '解绑失败，请稍后重试',
          icon: 'none'
        })
      }
      
    }).catch(() => {
      wx.showToast({
        title: '解绑失败，请稍后重试',
        icon: 'none'
      })
    });
  },

  hidedevice:function(){
    this.setData({
      showdevice: false
    })
  },
  toggleBottomPopup: function () {
    var that = this;
    if (that.data.hasBind){//已经绑定
      this.showZanDialog({
        title: '解除绑定',
        content: '是否解除歌华机顶盒与您账号的绑定？',
        confirmColor: '#ff510d',
        showCancel: true
      }).then(() => {
        that.unBind();
      }).catch(() => {

      });
    }else{
      var usercode = wx.getStorageSync('userCode');
      if (!usercode) {
        this.showZanDialog({
          title: '提示',
          content: '尚未登陆账号，是否前往登陆',
          confirmColor: '#ff510d',
          showCancel: true
        }).then(() => {
          wx.navigateTo({
            url: "/pages/login/login"
          })
          return;
        }).catch(() => { });
        return false
      }else{
        this.setData({
        showdevice: true,
      })
      }
    }
  },

  //input失去焦点事件：获取value值
  deviceblur:function(e){
    this.setData({
      inputVal: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
}))