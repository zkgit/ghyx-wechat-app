// 设备的可视区域
const app = getApp();
const Zan = require('../../style/dist/index');
Component({
  properties: {
    _channelId: {
      type: String,
      value: {}
    }, 
    _channelName: {
      type: String,
      value: {}
    },
    _assetId: {
      type: String,
      value: {}
    },
    _providerId: {
      type: String,
      value: {}
    },
    _title: {
      type: String,
      value: {}
    },
    _startTime: {
      type: String,
      value: {}
    },
    _endTime: {
      type: String,
      value: {}
    },
    _id: {
      type: String,
      value: {}
    },
    play_type: {
      type: Number,
      value: 0
    },
    _playNumber:{
      type: Number,
      value: 0
    },
    _idForSave:{
      type: Number,
      value: 0
    },
    _productId:{
      type:String,
      value:''
    },
    _price:{
      type: String,
      value: ''
    }
    
  },
  data: {

  },
  attached: function () {

  },
  methods: {
    _goplay: function (e) {
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
      switch (that.properties.play_type) {
        case 0:
          that._goback()
          break;
        case 1:
          that._golive()
          break;
        case 2:
          that._govod()
          break;
      }
    },
    // 点播
    _govod: function (res) {
      var that =this;
      const boxId = wx.getStorageSync('boxId')
      var url = {
        API_URL: app.globalData.b2b + 'psm/playVod.do',
        data: {
          'userCode': wx.getStorageSync('userCode'),
          'assetId': that.properties._assetId,
          'providerId': that.properties._providerId,
          'productId': that.properties._productId,
          'deviceNo': boxId,
          'price': that.properties._price ? that.properties._price:0
        }
      }
      app.fetch.newData.result(url).then(res => {
        that.addhistory_2(); 
        // that.transParams();
        if (res && res.data.code == "0") {
          wx.showToast({
            title: '推送电视成功',
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.code == "600"){
          that.transParams();
        }else{
          wx.showToast({
            title: '推送电视失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    // 直播
    _golive: function (res) {
      var that = this;
      var url = {
        API_URL: app.globalData.b2b + 'psm/playLive.do',
        data: {
          'userCode': wx.getStorageSync('userCode'),
          'channelId': that.properties._channelId
        }
      }
      app.fetch.newData.result(url).then(res => {
        that.addhistory_1();
        if (res && res.data.code == "0") {
          wx.showToast({
            title: '推送电视成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '推送电视失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    // 回看
    _goback: function (res) {
      var that = this;
      var url = {
        API_URL: app.globalData.b2b + 'psm/playBack.do',
        data: {
          'userCode': wx.getStorageSync('userCode'),
          'channelId': that.properties._channelId,
          'assetId': that.properties._assetId,
          'title': that.properties._title,
          'channelName': that.properties._channelName,
          'startTime': that.properties._startTime,
          'endTime': that.properties._endTime,
        }
      }
      app.fetch.newData.result(url).then(res => {
        that.addhistory_0();
        if (res && res.data.code == "0") {
          wx.showToast({
            title: '推送电视成功',
            icon: 'none',
            duration: 2000
          })
          
        } else {
          wx.showToast({
            title: '推送电视失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    // 直播回看添加历史
    addhistory_0: function () {
      var that = this;
      var url = {
        API_URL: app.globalData.base + 'users/history/save.json',
        data: {
          'openId': app.globalData.openId,
          'id': that.properties._channelId,
          'type': '1',
          'code': that.properties._assetId,
          'endTime': that.properties._endTime
        }
      }
      app.fetch.newData.result(url).then(res => {

      })
    },
    // 直播添加历史
    addhistory_1: function () {
      var that = this;
      var url = {
        API_URL: app.globalData.base + 'users/history/save.json',
        data: {
          'openId': app.globalData.openId,
          'id': that.properties._channelId,
          'type': '1',
          'endTime': that.properties._endTime
        }
      }
      app.fetch.newData.result(url).then(res => {

      })
    },
    // 点播添加历史
    addhistory_2: function () {
      var that = this;
      var url = {
        API_URL: app.globalData.base + 'users/history/save.json',
        data: {
          // 'openId': app.globalData.openId,
          // 'id': that.properties._id,
          // 'type': '0'
          'openId': app.globalData.openId,
          'id': that.properties._idForSave,
          'type': '0',
          'playNumber': that.properties._playNumber,
          'code': that.properties._assetId
        }
      }
      app.fetch.newData.result(url).then(res => {

      })
    },
    // 传递给父组件
    transParams: function (e) {
      var that = this;
      var myEventDetail = { showOrderPop:true  } // 参数对象，提供给事件监听函数
      this.triggerEvent('myevent', myEventDetail) //myevent自定义名称事件，父组件中使用
    },


  }

});
