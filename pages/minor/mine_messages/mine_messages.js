// var app = getApp()
// const { extend, Tab, Dialog, TopTips } = require('../../../style/dist/index');
// Page(extend({}, Tab, Dialog, TopTips, {

const app = getApp();
const { Toast, Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    tabType:'book',//tab默认为预约
    checkbable: false,//默认隐藏底部删除
    hasList:true,
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   * 获取消息分类http://wxtv.ghtech.net.cn/ghyx-api/api/v1/users/message/type.json?
   */
  onLoad: function (options) {
    this.getList(3);//预约3、活动5
  },
  // 列表
  getList: function (e) {
    var url = {
      API_URL: app.globalData.base + 'users/messages.json?read=1',
      data: {
        'openId': app.globalData.openId,
        'type': e,
        'pageNo': 1,
        'pageSize': 150
      }
    }
    app.fetch.newData.result(url).then(res => {
      var infos = res.data.response.responseBody.list;
      this.setData({
        lists: infos,
        loading: false,
        hasList: true
      })
      if (infos.length < 1) {
        this.setData({
          nodata: true,
          hasList:false
        })
      }
      // this.showZanTopTips(res.data.response.responseBody.count+'个更新未看');
    }).catch(res => {
      this.setData({
        nodata: false
      })
    });
  },
  
  changeType: function (e) {
    var that = this;
    this.setData({
      deleteNum: 0,
      isallcheck: false
    })
    if (e.currentTarget.dataset.type != this.data.tabType) {
      if (e.currentTarget.dataset.type == "book") {
        that.setData({
          tabType: e.currentTarget.dataset.type,
        })
        that.getList(3);
      } else {
        that.setData({
          tabType: e.currentTarget.dataset.type,
        })
        that.getList(5);
      }
    }
    this.setData({
      // iszhan: false,
    })
  },
  // 显示底部删除
  deletefcn: function () {
    var that = this
    this.setData({
      checkbable: true,
      deleteNum: 0
    })
  },
  // 底部全选、取消全选
  allcheck: function () {
    var that = this
    this.setData({
      isallcheck: !that.data.isallcheck
    })
    if (that.data.isallcheck) {
      this.setData({
        deleteNum: that.data.lists.length
      })
    } else {
      this.setData({
        deleteNum: 0
      })
    }
    for (var i in this.data.lists) {
      var list_item = "lists[" + i + "].ischeck";
      this.setData({
        [list_item]: that.data.isallcheck,
      })
    }
  },
  // 删除操作
  deletMessage: function (e) {
    var that = this;
    if (that.data.tabType == 'book') {
      var curType = 3;
    }
    if (that.data.tabType == 'activity') {
      var curType = 5;
    }
    wx.request({
      url: app.globalData.base + 'users/message/del.json',
      method: "POST",
      data: {
        'openId': app.globalData.openId,
        'id': e,
        'type': curType,
        'messageIds':e
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.cancel()
        if (that.data.tabType == 'book') {
          that.getList(3)
        }
        if (that.data.tabType == 'activity') {
          that.getList(5)
        }
        if (res && res.data.response.responseHeader.code == "200") {
          that.showZanToast({
            title: '删除成功',
            icon: 'wechat'
          }, 1500);
        } else {
          that.showZanToast({
            title: '删除失败',
            icon: 'fail'
          }, 1500);
        }
      }
    })
  },
  // 底部取消
  cancel: function () {
    var that = this
    this.setData({
      checkbable: false,
      isallcheck: false
    })
    for (var i in this.data.lists) {
      var list_item = "lists[" + i + "].ischeck"
      this.setData({
        [list_item]: false
      })
    }
  },
  // 选中按钮
  checkboxChange: function (e) {
    var that = this
    var eq = parseInt(e.currentTarget.dataset.index)
    var list_item = "lists[" + eq + "].ischeck"
    console.log(e, eq)
    this.setData({
      [list_item]: !that.data.lists[eq].ischeck
    })
    //计算删除选中个数 
    var data = that.data.lists;
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
  // 底部删除
  deleteButton: function () {
    var that = this
    that.showZanDialog({
      title: '删除消息',
      content: '确定删除消息吗？',
      confirmColor: '#ff510d',
      showCancel: true
    }).then(() => {
      var item_arr = []
      for (var i in that.data.lists) {
        if (that.data.lists[i].ischeck == true) {
          item_arr.push(that.data.lists[i].id)
        }
      }
      console.log(item_arr);
      if (item_arr.length) {
        // var arr = item_arr.join(',');
        // if (item_arr.length>1){ 
        //   that.deletMessage(arr.slice(0,arr.length-1));
        // }else{
        //   that.deletMessage(item_arr.join(','));
        // }
        that.deletMessage(item_arr.join(','));
      }
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
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