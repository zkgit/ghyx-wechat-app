const app = getApp();
const { Toast, Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin:false,
    showBottomPopup: false,
    loginPhone:'',
    boxId:'',
    payParams:'',
    selecteId:0,
    dataInfo:'',
    goodsList:[],
    itemArr:'',
    usercode:'',
    deviceNo:'',
    showLoadMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsList();
  },

  getGoodsList: function () {
    var params = {
      API_URL: app.globalData.server + 'b2b-bgctv/product/payPackage.json',
      data: {
        'pageNo': 1,
        'pageSize': '6'
      }
    }
    app.fetch.newData.result(params).then(res => {
      this.setData({
        goodsList: res.data.response.responseBody[0].list,
        selecteId: 0
      })
    })
  },

  //选中事件
  selectedItem: function (e) {
    this.setData({
      selecteId: e.currentTarget.dataset.id,
      dataInfo: e.currentTarget.dataset.info,
      itemArr: e.currentTarget.dataset.param
    })
  },
  // 弹幕弹窗显示设置
  toggleBottomPopup(e) {
    var that = this
    this.setData({
      showPopup: true,
      showBottomPopup: !this.data.showBottomPopup
    });
  },

  queryBind: function () {
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
          that.setData({
            deviceNo: res.data.response.responseBody.deviceNo
          });
          wx.setStorageSync('boxId', res.data.response.responseBody.deviceNo);
        }
      }).catch(() => {});
    }
  },
  
  //立即订购事件
  toBuy:function(){
    var that = this;
    // var userCode = wx.getStorageSync('userCode');
    // if (!userCode){
    //   wx.showToast({
    //     title: '请先登陆账号',
    //     icon: 'none'
    //   })
    //   return
    // };
    // if (!that.data.deviceNo) {
    //   wx.showToast({
    //     title: '请先绑定设备',
    //     icon: 'none'
    //   })
    //   return
    // };
    const userCode = wx.getStorageSync('userCode')
    const boxId = wx.getStorageSync('boxId')
    if (!userCode) {
      wx.navigateTo({
        url: "/pages/login/login"
      })
      return false
    }
    if (!that.data.deviceNo) {
      wx.navigateTo({
        url: "/pages/minor/mine_device/mine_device"
      })
      return false
    }
    if (!that.data.selecteId){that.showZanToast({title: '请选择订购产品',icon: ''}, 1500);return};
    this.showZanDialog({
      title: '立即订购',
      content: '请确认是否订购“电视院线'+that.data.dataInfo+'产品”',
      confirmColor: '#ff510d',
      showCancel: true
    }).then(() => {    
      that.setData({
        showLoadMore: true
      })
      var openId = app.globalData.openId;
      var itemInfo = that.data.itemArr;
      var params = {
        // API_URL:'https://miniapps.kanketv.com/b2b-bgctv/order/createOrderECCH.do',
        API_URL: app.globalData.b2b + 'order/createOrderECCH.do',
        data: {
          'userCode': userCode,
          'deviceNo': that.data.deviceNo,
          'openId': openId,
          'price': itemInfo.currentPrice,
          'packageCode': itemInfo.packageCode,
          'productCode': itemInfo.productCode,
          'productName': itemInfo.productName
        }
      }
      app.fetch.newData.result(params).then(res => {
        var responseBody = res.data.response.responseBody;
        if (responseBody.code == 200) {
          var payJson = responseBody.payJson; 
          var orderId = responseBody.orderId;
          that.setData({
            showLoadMore:false
          })
          that.wxpay(payJson, orderId);
        } else {
          that.showZanToast({
            title: res.data.response.responseHeader.msg,
            icon: 'fail',
          })
          that.setData({
            showLoadMore: false
          })
        }
      })
    }).catch(() => {
      that.setData({
        showLoadMore: false
      })
      console.log('取消');
    });
  },
  //微信支付
  wxpay: function (res, orderId) {
    var that = this
    wx.requestPayment({
      'timeStamp': res.timeStamp.toString(),
      'nonceStr': res.nonceStr,
      'package': res.package,
      'signType': 'MD5',
      'paySign': res.paySign,
      'success': function (res) {
        that.paySuccess(orderId);   
      },
      'fail': function (res) {
        console.info('失败:', res)
        that.showZanToast({
          title: '支付失败',
          icon: 'fail',
        })
      }
    })
  },

  paySuccess: function (orderNo){
    var that = this;
    var params = {
      // API_URL: 'https://miniapps.kanketv.com/b2b-bgctv/order/orderResultWeb.do',
      API_URL: app.globalData.b2b +'order/orderResultWeb.do',
      data: {
        'orderNo': orderNo,
        'payResult': 'success'
      }
    }
    app.fetch.newData.result(params).then(res => {
      if(res.data.code==200){
        that.showZanToast({
          title: res.data.msg,
          icon: 'success',
        })
      }
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
    var that = this;
    var usercode = wx.getStorageSync('userCode');
    if (usercode) {
      wx.getStorage({
        key: 'phone',
        success: function (res) {
          that.setData({
            loginPhone: wx.getStorageSync('loginPhone'),
            deviceNo:wx.getStorageSync('boxId')
          })
          console.log('chche', res.data)
        }
      })
      that.setData({
        hasLogin: true
      })
    } else {
      that.setData({
        hasLogin: false
      })
    }
    that.queryBind();
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