// pages/minor/mine_collect/mine_collect.js
// var app = getApp()
// const { extend, Tab, Dialog , TopTips} = require('../../../style/dist/index'); 
// Page(extend({}, Tab, Dialog , TopTips,{

const app = getApp();
const { Toast, Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, Dialog, {
  /**
     * 页面的初始数据
     */
  data: {
    selectedId:'0',
    nodata: false,
    loading: true,
    checkbable: false,
    havaList:true,
    tab1: {
      list: [{
        id: 'sp',
        title: '视频'
      }, {
        id: 'pd',
        title: '频道'
      }],
      selectedId: 'sp'
    },
    tabType:"live"
  },
  // 列表
  collect: function (e) {
    var url = {
      API_URL: app.globalData.base + 'users/collect/list.json',
      data: {
        'openId': app.globalData.openId,
        'type': e,
        'pageNo': 1,
        'pageSize': 150
      }
    }
    app.fetch.newData.result(url).then(res => {
      var infos = res.data.response.responseBody.list
      this.setData({
        lists: infos,
        loading: false
      })
      if(e==0){
        for (var i = 0; i < infos.length;i++){
          infos[i].actorsStr = '主演：' + (((infos[i].actors).split(';').slice(0, 3)).join(';')).replace(/;/g, ' ');
          var tagInfo = (((infos[i].tags).split(';').slice(0, 3)).join(';')).replace(/;/g, '·');
          if (infos[i].videoType=='tv'){
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
      if (res.data.response.responseBody.list.length < 1) {
        this.setData({
          // nodata: true
          havaList:false
        })
      }else{
        this.setData({
          // nodata: false
          havaList: true
        })
      }
      // this.showZanTopTips(res.data.response.responseBody.count+'个更新未看');
    }).catch(res => {
      this.setData({
        nodata: false
      })
    });
  },
  // 删除操作
  deletcollect: function (e) {
    var that = this;
    if (that.data.tabType == 'live') {
    var curType = 1;
    }
    if (that.data.tabType == 'vod') {
      var curType = 0;
    } 
    wx.request({
      url: app.globalData.base + 'users/collect/delete.json',
      method: "POST",
      data: {
        'openId': app.globalData.openId,
        'id': e,
        'type': curType
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.cancel()
        if (that.data.tabType == 'live') {
          that.collect(1)
        }
        if (that.data.tabType == 'vod') {
          that.collect(0)
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
    });
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
      title: '删除收藏',
      content: '确定删除收藏吗？',
      confirmColor: '#ff510d',
      showCancel: true
    }).then(() => {
      var item_arr =[]
      for (var i in that.data.lists) {
        if (that.data.lists[i].ischeck == true) {
          item_arr.push(that.data.lists[i].id)
        }
      }
      console.log(item_arr);
      that.deletcollect(item_arr)
    }).catch(() => {
      console.log('=== dialog ===', 'type: cancel');
    });
  },

  onLoad: function (options) {
    this.collect(1)
  },
  // handleZanTabChange(e) {
  //   var componentId = e.componentId;
  //   var selectedId = e.selectedId;
  //   console.info(componentId, selectedId)
  //   if (selectedId == 'sp') {
  //     this.setData({
  //       selectedId:'0',
  //       lists: '',
  //       loading: true,
  //       nodata: false
  //     })
  //     this.collect('0')
  //   } else if (selectedId == 'pd') {
  //     this.setData({
  //       selectedId: '1',
  //       lists: '',
  //       loading: true,
  //       nodata: false
  //     })

  //     this.collect('1')
  //   }
  //   this.setData({
  //     [`${componentId}.selectedId`]: selectedId
  //   });
  // },

  changeType: function (e) {
    this.setData({
      deleteNum: 0,
      isallcheck: false
    })
    if (e.currentTarget.dataset.type != this.data.tabType) {
      if (e.currentTarget.dataset.type == "live") {
        this.setData({
          tabType: e.currentTarget.dataset.type,
        })
        this.collect(1)
      } else {
        this.setData({
          tabType: e.currentTarget.dataset.type,
        })
        this.collect(0)
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
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {


  },

 
}));