const app = getApp();
const { Toast, Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, Dialog, {
  /**
   * 页面的初始数据
   */
  data: {
    checkAction:'',
    // isActivation:false,
    // zanActivateShow:false,
    // zanAddShow:false,
    // showAddDialog:false,
    listInfo:'',
    // deviceList:'',//设备列表
    currentKeyId:'',
    // showAddBtn:false,
    haveList:true,//没有数据时提示
    isallcheck:false,
  },

/**
   * 生命周期函数--监听页面加载
   */
onLoad: function (options) {
  this.getOrderList();
  // this.getDeviceList();
},

getOrderList: function(){
  var that = this;
  app.fetch.newData.result({
    API_URL: app.globalData.server + 'b2b-bgctv/product/orderList.json',
    data: {
      'openId': app.globalData.openId,
      'pageNo':'1',
      'pageSize':'10'
    }
  }).then(res => {
    var infos = res.data.response.responseBody[0].list;
    if (infos.length < 1 || !infos){
        that.setData({
          haveList: false
        })
      }else{
        that.setData({
          listInfo: infos,
          haveList: true
        })
      }
  })
},

  // 显示底部删除
  deletefcn: function () {
    var that = this
    this.setData({
      checkbable: true,
      deleteNum:0
    })
  },
  // 底部取消
  cancel: function () {
    var that = this
    this.setData({
      checkbable: false,
      isallcheck: false
    })
    for (var i in this.data.listInfo) {
      var list_item = "listInfo[" + i + "].ischeck"
      this.setData({
        [list_item]: false
      })
    }
  },
  // 选中按钮
  checkboxChange: function (e) {
    var that = this
    var eq = parseInt(e.currentTarget.dataset.index)
    var list_item = "listInfo[" + eq + "].ischeck"
    console.log(e, eq)
    this.setData({
      [list_item]: !that.data.listInfo[eq].ischeck
    });
    that.getCheckNum();
  },
  // 底部全选、取消全选
  allcheck: function () {
    var that = this
    this.setData({
      isallcheck: !that.data.isallcheck
    })
    for (var i in this.data.listInfo) {
      var list_item = "listInfo[" + i + "].ischeck"
      this.setData({
        [list_item]: that.data.isallcheck
      })
    };   
    that.getCheckNum();
  },
//计算删除选中个数
  getCheckNum:function(){
    var that = this;
    var data = that.data.listInfo;
    var checkNum = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].ischeck == true) {
        checkNum++
      }
    };
    this.setData({
      deleteNum: checkNum
    });
  },
  deleteButton:function(){
    var that = this
    this.showZanDialog({
      title: '删除收藏',
      content: '确定删除选中的收藏吗？',
      confirmColor: '#ff510d',
      showCancel: true
    }).then(() => {
      var item_arr = []
      for (var i in that.data.listInfo) {
        if (that.data.listInfo[i].ischeck == true) {
          item_arr.push(that.data.listInfo[i].id)
        }
      }
      console.log(item_arr);
      that.deletcollect(item_arr)
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
  },
  // 删除操作
  deletcollect: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.b2b + 'product/deleteOrder.json',
      method: "POST",
      data: {
        'openId': app.globalData.openId,
        'id': e.join(',')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.cancel()
        that.getOrderList()
        // if (res && res.data.response.responseHeader.code == "200") {
        //   that.showZanToast({
        //     title: msg + '成功',
        //     icon: 'wechat'
        //   }, 1500);
        // } else {
        //   that.showZanToast({
        //     title: msg + '失败',
        //     icon: 'fail'
        //   }, 1500);
        // }
      }
    })
  },

//设备选中状态控制
checkItemFun: function (e) {
  var that = this;
  // var index = e.currentTarget.dataset.index;
  // dataInfo[index].checked = !dataInfo[index].checked;
  var currentId = e.currentTarget.dataset.id;
  var dataInfo = that.data.deviceList;
  for (var i in dataInfo) {
    if (dataInfo[i].id == currentId){
      dataInfo[i].checked = !dataInfo[i].checked;
    }else{
      dataInfo[i].checked = false
    }
  }
  that.setData({
    deviceList: dataInfo,
  })
},

  getDeviceList: function () {
    // var that = this;
    // var url = {
    //   API_URL: app.globalData.user + 'wxapp/system/findBoxByUser',
    //   data: {
    //     'openId': app.globalData.openId
    //   }
    // };
    // app.fetch.newData.result(url).then(res => {
    //   if (res.data.responseBody.list.length > 0) {
    //     for (var i in res.data.responseBody.list) {
    //       res.data.responseBody.list[i].checked = false
    //     }
    //     that.setData({
    //       deviceList: res.data.responseBody.list,
    //       showAddBtn: false,
    //     })
    //   }
    // }).catch(res => {

    // });
  },
//激活使用
activationUse:function(){
  // var that = this;
  // var deviceList = that.data.deviceList;
  // if (deviceList){
  //   for (var i in deviceList) {
  //     if (deviceList[i].checked == true) {
  //       var url = {
  //         API_URL: app.globalData.user + 'wxapp/activate/boxActivate',
  //         data: {
  //           boxId: deviceList[i].boxId,
  //           CDKey: that.data.currentKeyId,
  //           acType: 'phone'
  //         }
  //       };
  //       app.fetch.newData.result(url).then(res => {
  //         if (!!res && res.data.return_code == 'SUCCESS'){
  //           this.setData({
  //             zanActivateShow: false
  //           });
  //           wx.showToast({
  //             title: '激活成功',
  //             icon: 'none',
  //             duration: 1500
  //           });
  //           this.getOrderList();
  //         }else{ 
  //           this.setData({
  //             zanActivateShow: false
  //           });
  //           wx.showToast({
  //             title: '激活失败',
  //             icon: 'none',
  //             duration: 1500
  //           })
  //         }      
  //       }).catch(res => {});
  //     }else{
  //       wx.showToast({
  //         title: '请选择需要激活的设备',
  //         icon: 'none',
  //         duration: 1500
  //       });
  //     }
  //   }
  // }else{
  //   wx.showToast({
  //     title: '没有可激活设备',
  //     icon: 'none',
  //     duration: 1500
  //   })
  //   return
  // }
},

//调出激活弹窗
showActivationModal: function (e) {
  // var that = this;
  // if (!that.data.deviceList || that.data.deviceList.length==0){
  //   that.setData({
  //       showAddBtn: true,
  //   });
  // }
  // var status = e.currentTarget.dataset.status;
  // var keyId = e.currentTarget.dataset.id;
  // if (status==2){//已激活
  //   wx.showToast({
  //     title: '设备已激活',
  //     icon: 'none',
  //     duration: 1500
  //   })
  // }else{
  //   that.setData({
  //     zanActivateShow: true,
  //     currentKeyId: keyId
  //   });
  // }
},
  hideActivationModal: function () {
    // this.setData({
    //   zanActivateShow: false
    // })

  },
//添加设备弹窗
  showAddModal: function(){
    // this.hideActivationModal();
    // this.setData({
    //   showAddDialog: true
    // })
  },
  hideAddModal:function(){
    // this.setData({
    //   showAddDialog: false
    // })
  },
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我的订购',
      path: '/pages/minor/mine_orderlist/mine_orderlist',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'none',
          duration: 1500
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

}))