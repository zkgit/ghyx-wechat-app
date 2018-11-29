var app = getApp();
const {
  Dialog,
  extend
} = require('../../style/dist/index');
Page(extend({}, Dialog, {
  data: {
    tabs: '',
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    value: '热播搜索',
    jmtime: '',
    leftbarIndex: 0,
    activeDate: '',
    arr: ['回看', '直播', '预约'],
    nonet: false,
    curLeftChanel:''
  },
  onLoad: function(options) {
    // console.log('onload:',app.data.acessTvName);
    this.livecate();
  },
  onShow: function () {
    console.log('onshow:', app.data.acessTvName, this.data.isonload);
    // if (this.data.isonload && app.data.acessTvName){return false}
    //获取网络状态
    var that = this;
    app.wechat.getNetStatus().then(res => {
      if (res.networkType == 'none') {//无网络状态
        that.setData({
          nonet: true
        });
        return
      } else {
        if(that.data.nonet==true){
          
        }
        that.setData({
          nonet: false
        })
      }
    });
    that.livecate();
    that.setData({
      leftbarIndex: 0
    })
  },
  livecate:function(){
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'epg/liveCate.json'
    }).then(res => {
      that.setData({
        tabs: res.data.response.responseBody,
        type: app.data.acessTvName ? app.data.acessTvName : res.data.response.responseBody[0].channel_en
      })
      that.week();
      that.tab_type();
      that.tabFun(6)
    })
  },
  week: function() {
    var jmtime = [];
    var that = this;
    var data = new Date(),
      str = '',
      wkarr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      day = data.getDay();
    data.setDate(data.getDate() - 7);
    for (var i = 0; i < 10; i++) {
      data.setDate(data.getDate() + 1);
      var obj = {};
      var ts = (data.getMonth() + 1 < 10 ? ('0' + (data.getMonth() + 1)) : (data.getMonth() + 1)) + '-' + (data.getDate() >= 10 ? data.getDate() : ('0' + data.getDate()));
      obj.timestr = ts;
      obj.day = wkarr[data.getDay()];
      obj.data = data.getFullYear()+'-' + ts;
      jmtime.push(obj)
    }
    // jmtime.reverse()
    that.setData({
      jmtime: jmtime,
      activeDate: jmtime[6].data
    })
  },
  tab_type: function(event) {
    //点击最上边导航
    var that = this;
    if (event) {
      that.setData({
        type: event.currentTarget.dataset.channel_en,
        activeDate: that.data.jmtime[6].data,
        leftbar: [],
        leftbarIndex: 0,
        isshow_default: false
      })
    }
    this.getEpg(that.data.jmtime[6].data, 0, '')
  },
  changeTime: function(event) {
    this.tabFun(event.currentTarget.dataset.index)
    //点击周一到周日
    this.setData({
      activeDate: event.currentTarget.dataset.date,
      leftbar: [],
      leftbarIndex: this.data.leftbarIndex ? this.data.leftbarIndex:0,
      isshow_default: false
    })
    this.getEpg(event.currentTarget.dataset.date, 0, '')
  },
  changeleft: function(event) {
    var that = this;
    that.setData({
      list: [],
      leftbarIndex: event.currentTarget.dataset.index,
      isshow_default: false,
      curLeftChanel: event.currentTarget.dataset.channelId
    })
    that.getEpg(that.data.activeDate, 1, event.currentTarget.dataset.channelId)
  },
  getEpg: function(date, scope, channelId) {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'epg/liveEpg.json',
      data: {
        date: date,
        // channelId: channelId,
        channelId: that.data.curLeftChanel,
        type: that.data.type,
        pageNo: 1,
        pageSize: 100,
        scope: scope,
        openId: app.globalData.openId
      }
    }).then(res => {
      if (scope == 0) {
        that.setData({
          list: [],
        })
        if ((res.data.response.responseHeader.code == 200) && res.data.response.responseBody) {
          that.setData({
            leftbar: res.data.response.responseBody.list,
          })
          if (res.data.response.responseBody.channels) {
            that.setData({
              list: res.data.response.responseBody.channels,
              isshow_default: false
            })
          } else {
            that.setData({
              isshow_default: true
            })
          }
        } else {
          that.setData({
            isshow_default: true
          })
        }

        // that.getEpg(date, 1, res.data.response.responseBody.list[0].channelId);
        // that.getEpg(date, 1,'chancp000011a2242213000002930093');
      } else if (scope == 1) {
        if ((res.data.response.responseHeader.code == 200) && res.data.response.responseBody && res.data.response.responseBody.list) {
          that.setData({
            list: res.data.response.responseBody.list,
            isshow_default: false
          })
        } else {
          that.setData({
            isshow_default: true
          })
        }
      }
      if (that.data.jmtime[6].data == date) {
        that.scrollFun();
      } else {
        that.setData({
          toView: 0,
        })
      }
    })
  },
  //设置scroll-into-view值定位正在直播模块
  scrollFun: function() {
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].flag == 1) {
        this.setData({
          toView: i - 4,
        })
        break;
      }
    }
  },
  tabFun: function(e) {
    this.setData({
      tmView: e - 4,
    })
  },
  ordertv: function(e) {
    // alert(e.detail.formId);
    var that = this;
    var reserveInfos = e.currentTarget.dataset.item;
    reserveInfos.formId = e.detail.formId;
    var isorder = that.data.list[e.currentTarget.dataset.eq].isReserve;
    var msg = isorder ? '预约取消' : '预约';
    wx.request({
      url: app.globalData.base + 'users/myLiveReserve.json',
      method: "POST",
      data: {
        'isReserve': isorder ? '0' : '1',
        'openId': app.globalData.openId,
        'methodType': 'POST',
        'reserve': '[' + JSON.stringify(reserveInfos) + ']'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var jmisorder = "list[" + e.currentTarget.dataset.eq + "].isReserve";
        if (res && res.data.response.responseHeader.code == "200") {
          that.setData({
            [jmisorder]: !that.data.list[e.currentTarget.dataset.eq].isReserve
          })
          if (wx.getStorageSync('re_no_tip') || isorder) {
            wx.showToast({
              title: msg + '成功',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.showZanDialog({
              title: '预约成功',
              content: '节目开始前5分钟，我们将会以消息的形式通知您',
              buttons: [{
                text: '不在提示',
                type: 'cancel'
              }, {
                text: '确定',
                color: '#ff510d',
                type: 'ok'
              }]
            }).then(({
              type
            }) => {
              `${type}` != 'cancel' || app.wechat.setStorage('re_no_tip', true)
            })
          }
        } else {
          wx.showToast({
            title: msg + '失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }

}));