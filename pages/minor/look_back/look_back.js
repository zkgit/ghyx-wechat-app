// pages/minor/mine_order/mine_order.js
const app = getApp()
const { Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Dialog, {
  /**
   * 页面的初始数据
   */
  data: {
    nodata: false,
    loading: true,
    checkbable: false,
    noneList: false,
    pageNo:1,
    loading: true,
    loadtxt: '正在加载...',
    listInfo:[],
  },
  // 回看列表
  getListInfo: function () {
    var that = this;
    var params = {
      API_URL: app.globalData.base + 'home/hotLiveBack.json',
      data: {
        'pageNo': that.data.pageNo,
        'pageSize': '6'
      }
    }
    app.fetch.newData.result(params).then(res => {
      var infos = res.data.response.responseBody.list;
      for (var i in infos){
        if (infos[i].date){
          var a = infos[i].date.substring(5,6);
          if (infos[i].date.substring(5,6) ==1) {
            infos[i].dateStr = infos[i].date ? (infos[i].date.substring(5, 10)).replace('-', '.') : '';
          } else {
            infos[i].dateStr = infos[i].date ? (infos[i].date.substring(6, 10)).replace('-', '.') : '';
          } 
        }
      }
      that.setData({
        listInfo: that.data.listInfo.concat(infos),
        loading: false,
        loadtxt: '',
      })
    })
  },
  // 删除操作
  deletorder: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.base + 'users/myLiveReserve.json',
      method: "POST",
      data: {
        'isReserve': '0',
        'openId': app.globalData.openId,
        'methodType': 'POST',
        'reserve': JSON.stringify(e)
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.cancel()
        that.getListInfo()
      }
    })
  },
  // 显示底部删除
  deletefcn: function () {
    var that = this
    this.setData({
      checkbable: true
    })
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
      var list_item = "lists[" + i + "].ischeck"
      this.setData({
        [list_item]: that.data.isallcheck
      })
    }
  },
  // 底部删除
  deleteButton: function () {
    var that = this
    this.showZanDialog({
      title: '确定删除吗',
      content: '',
      confirmColor: '#ff510d',
      showCancel: true
    }).then(() => {
      var item_arr = new Array()
      for (var i in that.data.lists) {
        if (that.data.lists[i].ischeck == true) {
          item_arr.push(that.data.lists[i])
        }
      }
      that.deletorder(item_arr)
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
  },

  onLoad: function (options) {
    this.getListInfo()
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var that = this;
    that.setData({
      loading: true,
      loadtxt: '正在加载...',
      pageNo: that.data.pageNo+1
    })
    that.getListInfo();
  }

}));