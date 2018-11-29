// pages/minor/mine_order/mine_order.js
const app = getApp()
const { Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Dialog, {
  /**
   * 页面的初始数据
   */
  data: {
    nodata: false,
    loading: false,
    checkbable: false,
    addtime: {
      today: -1,
      yesterday: -1,
      earlier: -1
    },
    tabType:"live",//直播tab默认值
    deleteNum:'',
    haveList:true
  },
  // 列表
  orderlist: function (t) {
    var that = this
    that.setData({
      lists: [],
      addtime: {
        today: -1,
        yesterday: -1,
        earlier: -1
      }
    })
    var url = {
      API_URL: app.globalData.base + 'users/history/list.json',
      data: {
        'openId': app.globalData.openId,
        'pageNo': 1,
        'pageSize': 30,
        'type':t
      }
    }
    app.fetch.newData.result(url).then(res => {
      that.setData({
        lists: res.data.response.responseBody.list,
        loading: false,
        nodata: false
      })
      if (res.data.response.responseBody.list.length < 1) {
        that.setData({
          // nodata: true,
          haveList:false
        })
      }else{
        that.setData({
          // nodata: true,
          haveList: true
        })
      }

      if (t == 0) {
        var infos = res.data.response.responseBody.list;
        for (var i = 0; i < infos.length; i++) {
          infos[i].actorsStr = '主演：' + (((infos[i].actors).split(';').slice(0, 3)).join(';')).replace(/;/g, ' ');
          var tagInfo = (((infos[i].tags).split(';').slice(0, 3)).join(';')).replace(/;/g, '·');
          if (infos[i].videoType == 'tv') {
            infos[i].tagsStr = '电视剧' + tagInfo + '·' + infos[i].year
          }
          if (infos[i].videoType == 'film') {
            infos[i].tagsStr = '电影' + tagInfo + '·' + infos[i].year
          }
          this.setData({
            lists: infos
          })
        }
      }

      for (var i in that.data.lists) {
        var tem = that.data.lists[i].addTime.slice(0, 10);
        if (that.data.addtime.today >= 0) {
        } else {
          if (app.util.GetDateStr(0) == tem) {
            that.setData({
              'addtime.today': i
            })
          }
        }
        if (that.data.addtime.yesterday >= 0) {
        } else {
          if (app.util.GetDateStr(-6) == tem) {//6天内
            that.setData({
              'addtime.yesterday': i
            })
            continue;
          }
        }

        if (that.data.addtime.earlier >= 0) {
          // continue;
        } else {
          if (app.util.GetDateStr(-1) > tem) {
            that.setData({
              'addtime.earlier': i
            })
            continue;
          }
        }
      }
      if (that.data.addtime.yesterday >= 0) {

        var daylists = 'lists[' + that.data.addtime.yesterday + '].yesterday';
        console.info(daylists)
        that.setData({
          [daylists]: true
        })
      }
      if (that.data.addtime.today >= 0) {
        var daylists = 'lists[' + that.data.addtime.today + '].today'
        console.info(daylists)
        that.setData({
          [daylists]: true
        })
      }
      if (that.data.addtime.earlier >= 0) {
        var daylists = 'lists[' + that.data.addtime.earlier + '].earlier';
        console.info(daylists)
        that.setData({
          [daylists]: true
        })
      }
    }).catch(res => {
      this.setData({
        nodata: true
      })
    });
  },
  // 删除操作
  deletorder: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.base + 'users/history/delete.json',
      method: "POST",
      data: {
        'openId': app.globalData.openId,
        'id': e
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.cancel()
        if (that.data.tabType=='live'){
          that.orderlist(1)
        }
        if (that.data.tabType == 'vod') {
          that.orderlist(0)
        }   
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
    for(var i = 0;i<data.length;i++){
      if (data[i].ischeck == true){
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
    if (that.data.isallcheck){
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
  // 底部删除
  deleteButton: function () {
    var that = this
    this.showZanDialog({
      title: '删除',
      content: '确定要删除' + that.data.deleteNum+'条记录吗',
      confirmColor: '#ff510d',
      showCancel: true
    }).then(() => {
      var item_arr = new Array()
      for (var i in that.data.lists) {
        if (that.data.lists[i].ischeck == true) {
          item_arr.push(that.data.lists[i].entityId)
        }
      }
      console.log(item_arr);
      that.deletorder(item_arr)
    }).catch(() => {
      console.log('取消');
    });
  },
  changeType: function (e) {
    this.setData({
      deleteNum: 0,
      isallcheck:false
    })
    if (e.currentTarget.dataset.type != this.data.tabType) {
      if (e.currentTarget.dataset.type=="live"){
        this.setData({
          tabType: e.currentTarget.dataset.type,
        })
        this.orderlist(1);
      }else{
        this.setData({
          tabType: e.currentTarget.dataset.type,
        })
        this.orderlist(0);
      }
      
      if (this.data.inputval) {
        // this.keylen();
        // this.setData({
        //   isresult: true,
        //   loadtext: '正在加载...'
        // })
        // this.getAjax();
      }
    }
    this.setData({
      // iszhan: false,
    })
  },

  onLoad: function (options) {
    this.orderlist(1)
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {


  }

}));