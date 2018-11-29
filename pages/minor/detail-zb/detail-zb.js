// pages/minor/detail-zb/detail-zb.js
const app = getApp();
const { Toast, Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    jmlist: [],
    jmtime: [],
    activeDate: '',
    gt: null,
    is_shortdes: true,
    scrolltop: 0,
    icon: '',
    title: '',
    backhome: false,
    showBottomPopup: false,
    deciceH: wx.getStorageSync('deciceH')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      avatarUrl: app.globalData.avatarUrl
    });
    this.week();
    // 收藏频道状态
    this.mystate();
    if (options.share) {
      this.setData({
        backhome: true
      })
    }
  },
  imgerror: function () {

  },
  //处理图片404
  errImg: function (ev) {
    var _that = this;
    app.util.errImgFun(ev, _that);
  },
  keyinput: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
    console.log(e.detail.value)
  },
  // sendcomment: function () {
  //   var that = this;
  //   if (!that.data.inputVal) {
  //     wx.showToast({
  //       title: '评论内容不可为空',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   } else {
  //     var url;
  //     if (that.data.replyId) {
  //       url = {
  //         API_URL: app.globalData.base + 'users/comment/save.json',
  //         data: {
  //           'openId': app.globalData.openId,
  //           'id': that.data.options.channelId,
  //           'context': that.data.inputVal,
  //           'kankeId': that.data.kankeId,
  //           'replyId': that.data.replyId,
  //           'type': 1,
  //           'name': app.globalData.nickName
  //         }
  //       }
  //     } else {
  //       url = {
  //         API_URL: app.globalData.base + 'users/comment/save.json',
  //         data: {
  //           'openId': app.globalData.openId,
  //           'id': that.data.options.channelId,
  //           'context': that.data.inputVal,
  //           'kankeId': that.data.kankeId,
  //           'replayId': '',
  //           'type': 1,
  //           'name': '',
  //           'title': that.data.detail.title
  //         }
  //       }
  //     }

  //     app.fetch.newData.result(url).then(res => {
  //       that.sendPopupMessage();
  //       wx.showToast({
  //         title: res.data.response.responseHeader.msg,
  //         icon: 'none',
  //         duration: 2000
  //       })
  //       that.setData({
  //         inputVal: '',
  //         replyId: '',
  //         replyname: ''
  //       })
  //       that.getcomment()
  //     })
  //   }
  // },
  // changeInput: function (e) {
  //   this.setData({
  //     placeholder: '回复@' + e.currentTarget.dataset.nickname,
  //     focus: true,
  //     replyId: e.currentTarget.dataset.id,
  //     replyname: e.currentTarget.dataset.nickname
  //   })
  // },
  // getreply: function (e) {
  //   var that = this;
  //   var eq = e.currentTarget.dataset.eq;
  //   var total = e.currentTarget.dataset.total;
  //   if (total > 5 && (that.data.comment[eq].page.list.length < total)) {
  //     var url = {
  //       API_URL: app.globalData.base + 'users/reply/list.json',
  //       data: {
  //         'id': e.currentTarget.dataset.id,
  //         'pageNo': 1,
  //         'pageSize': total
  //       }
  //     }
  //     app.fetch.newData.result(url).then(res => {
  //       if (res.data.response.responseHeader.code) {
  //         that.data.comment[eq].page.list = res.data.response.responseBody.list;
  //         that.data.comment[eq].showreply = !that.data.comment[eq].showreply;
  //         that.setData({
  //           comment: that.data.comment
  //         })
  //       }

  //     })
  //   } else {
  //     that.data.comment[eq].showreply = !that.data.comment[eq].showreply;
  //     that.setData({
  //       comment: that.data.comment
  //     })
  //   }
  // },
  // blurfocus: function () {
  //   this.setData({
  //     focus: false,
  //     placeholder: ''
  //   })
  // },
  // getcomment: function () {
  //   var that = this;
  //   var url = {
  //     API_URL: app.globalData.base + 'users/comment/list.json',
  //     data: {
  //       'openId': app.globalData.openId,
  //       'id': that.data.options.channelId,
  //       'kankeId': that.data.kankeId,
  //       'type': 1,
  //       'pageNo': 1,
  //       'pageSize': 6
  //     }
  //   }
  //   app.fetch.newData.result(url).then(res => {
  //     that.setData({
  //       dmtotalrecords: res.data.response.responseBody.totalrecords,
  //       comment: res.data.response.responseBody.list
  //     });
  //   })
  // },

  // like: function (e) {
  //   var that = this;
  //   if (e.currentTarget.dataset.status) {

  //     return false;
  //   }
  //   var url = {
  //     API_URL: app.globalData.base + 'users/like.json',
  //     data: {
  //       'openId': app.globalData.openId,
  //       'id': e.currentTarget.dataset.id,
  //       'tag': 'C',
  //       'type': 1,
  //       'operation': 1
  //     }
  //   }
  //   app.fetch.newData.result(url).then(res => {
  //     if (res.data.response.responseHeader.code == 200) {
  //       wx.showToast({
  //         title: '点赞成功',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //       that.getcomment();
  //     } else {
  //       wx.showToast({
  //         title: '点赞失败',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },
  // changedes: function () {
  //   var that = this;
  //   this.setData({
  //     is_shortdes: !that.data.is_shortdes
  //   })
  // },
  // collect: function () {

  // },
  week: function () {
    var that = this;
    var jmtime = [];
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
      jmtime.push(obj);
    }
    that.setData({
      jmtime: jmtime,
      activeDate: jmtime[6].data
    })
    that.getEpg(that.data.activeDate);
  },
  changeday: function (e) {
    this.setData({
      jmlist: [],
      activeDate: e.currentTarget.dataset.time
    })
    this.tabFun(e.currentTarget.dataset.index)
    this.getEpg(this.data.activeDate);
  },
  tabFun: function (e) {
    this.setData({
      tmView: e - 4,
    })
  },
  getEpg: function (date) {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'epg/liveEpg.json',
      data: {
        date: date,
        channelId: that.data.options.channelId,
        type: '',
        pageNo: 1,
        pageSize: 100,
        scope: 1,
        openId: app.globalData.openId
      }
    }).then(res => {
      if ((res.data.response.responseHeader.code == 200) && res.data.response.responseBody && res.data.response.responseBody.list.length) {
        that.setData({
          jmlist: res.data.response.responseBody.list,
        })
        if (!that.data.icon) {
          that.setData({
            icon: res.data.response.responseBody.list[0].icon2,
            title: res.data.response.responseBody.list[0].channelName
          })
        }
        var data = that.data.jmlist;
        if (data.length==0){
          that.setData({
            isshow_default: true
          })
        }else{
          that.setData({
            isshow_default: false
          })
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].flag == 1) {
            that.setData({
              gt: i,
              toView: i - 2,
              activejson: data[i],
              kankeId: data[i].kankeId
            })
            that.getDetail(data[i].kankeId)
            that.getcomment()
            break;
          }
        }

      }else{
        that.setData({
          isshow_default: true
        })
      }
      // 标题
      wx.setNavigationBarTitle({ title: that.data.title + '-正在直播' });
    })
  },
  getDetail: function (kankeId) {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'home/detail.json',
      data: {
        id: '',
        kankeId: kankeId
      }
    }).then(res => {
      if (res.data.response.responseHeader.code == "200") {
        var detail = res.data.response.responseBody;
        detail.tags = detail.tags.split(';').slice(0, 3);
        detail.shortdes = detail.shortdes.length > 75 ? detail.shortdes.substr(0, 75) + '...' : detail.shortdes;
        detail.description = detail.description.length > 150 ? detail.description.substr(0, 150) + '...' : detail.description;
        that.setData({
          detail: res.data.response.responseBody
        })
        that.actor();
        that.recommend();
      }
    })
  },
  actor: function () {
    var that = this;
    var directorId = that.data.detail.directorId ? that.data.detail.directorId : '';
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'recommend/star/profiles.json',
      data: {
        directorId: directorId,
        name: '',
        starId: that.data.detail.actorIds.replace(/\;/g, ',')
      }
    }).then(res => {
      if (res.data.responseHeader.code == '200') {
        that.setData({
          actorlist: res.data.responseBody
        })
      }
    })
  },
  recommend: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'recommend/iti_vod.json',
      data: {
        pageNo: 1,
        pageSize: 6,
        kankeId: that.data.detail.kankeId,
        id: '',
        // kankeId: '',
        // id: that.data.options.id,
        type: that.data.detail.videoType
      }
    }).then(res => {
      if (res.data.response && res.data.response.responseBody && res.data.response.responseBody.list.length > 0) {
        that.setData({
          tjlist: res.data.response.responseBody.list
        })
      }
    })
  },
  mystate: function () {
    var url = {
      API_URL: app.globalData.base + 'users/state/check.json',
      data: {
        'openId': app.globalData.openId,
        'type': '1',
        'id': this.data.options.channelId,
        'tag': ''
      }
    }
    app.fetch.newData.result(url).then(res => {
      const states = res.data.response.responseBody;
      const data = ({
        is_zbcollect: states.isCollectioned == '1' ? true : false,//是否收藏频道
        // likenum: states.beLikeCount, //点赞数量
        // is_like: states.beLike == '1' ? true : false, //是否点赞
        // dislikenum: states.isBeLikedCount, //点踩数量
        // is_dislike: states.isBeLiked == '1' ? true : false //是否点踩
      })
      this.setData({
        mystate: data
      })
    })
  },
  collect: function () {
    var that = this;

    var url = {
      API_URL: app.globalData.base + 'users/collect/save.json',
      data: {
        'openId': app.globalData.openId,
        'type': '1',
        'id': this.data.options.channelId,
        'operation': this.data.mystate.is_zbcollect ? -1 : 1,
        'title': this.data.jmlist[0].channelName,
        'image': this.data.jmlist[0].icon2,
        'englishName': this.data.jmlist[0].kankeChannel
      }
    }
    app.fetch.newData.result(url).then(res => {
      if (res && res.data.response.responseHeader.code == "200") {
        that.setData({
          'mystate.is_zbcollect': !that.data.mystate.is_zbcollect
        })
        that.showZanToast({
          title: res.data.response.responseHeader.msg,
          icon: 'wechat'
        }, 1500);

      } else {
        that.showZanToast({
          title: '收藏失败',
          icon: 'fail'
        }, 1500);
      }

    })
  },
  // 电视推送
  playtv: function () {
    var that = this;
    if (!wx.getStorageSync('userCode')) {
      wx.navigateTo({
        url: "/pages/login/login"
      })
      return false
    }
    if (!wx.getStorageSync('boxId')) {
      that.noidtip()
      return false
    }
    //推送鉴权
    app.activateBoxAccess();
    if (wx.getStorageSync('activateStatus') == 'SUCCESS') {

    } else {
      this.showZanDialog({
        title: '无法观看',
        content: '此片为会员内容，请购买观看;如已购买，请激活会员',
        buttons: [
          {
            text: '取消',type: 'cancel'
          }, {
            text: '激活',color: '#ff5e00',type:'active'
          },{
            text: '购买',color: '#ff5e00',type:'buy'
          },]
      }).then(({ type }) => {
        var btnType = `${type}`;
        if (btnType =='buy'){
          wx.navigateTo({
            url: "/pages/vip/pay/pay"
          })
        }else if(btnType == 'active') {
          wx.navigateTo({
            url: "/pages/minor/mine_orderlist/mine_orderlist"
          })
        };
      });
      return
    }; 
    
    var url = {
      API_URL: app.globalData.b2b + 'psm/playLive.do',
      data: {
        'channelId': that.data.activejson.playCode,
        'userCode': wx.getStorageSync('userCode')
      }
    }
    app.fetch.newData.result(url).then(res => {
      that.addhistory()
      if (res && res.data.result == "success") {
        that.showZanToast({
          title: '推送电视成功',
          icon: 'wechat'
        }, 1500);
      } else {
        that.showZanToast({
          title: '推送电视失败',
          icon: 'fail'
        }, 1500);
      }

    })
  },
  ordertv: function (e) {
    var that = this;
    var isorder = that.data.jmlist[e.currentTarget.dataset.eq].isReserve;
    var msg = isorder ? '取消预约' : '预约';
    wx.request({
      url: app.globalData.base + 'users/myLiveReserve.json',
      method: "POST",
      data: {
        'isReserve': isorder ? '0' : '1',
        'openId': app.globalData.openId,
        'methodType': 'POST',
        'reserve': '[' + JSON.stringify(e.currentTarget.dataset.item) + ']'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var jmisorder = "jmlist[" + e.currentTarget.dataset.eq + "].isReserve";
        if (res && res.data.response.responseHeader.code == "200") {
          that.setData({
            [jmisorder]: !that.data.jmlist[e.currentTarget.dataset.eq].isReserve
          })
          that.showZanToast({
            title: msg + '成功',
            icon: 'wechat'
          }, 1500);
        } else {
          that.showZanToast({
            title: msg + '失败',
            icon: 'fail'
          }, 1500);
        }
      }
    })
  },
  // 添加历史
  addhistory: function () {
    var that = this;
    var url = {
      API_URL: app.globalData.base + 'users/history/save.json',
      data: {
        'openId': app.globalData.openId,
        'id': that.data.options.channelId,
        'endTime': that.data.activejson.endTime,
        'recommend': that.data.options.recommend ? '1' : '0',
        'type': '1',
      }
    }
    app.fetch.newData.result(url).then(res => {

    })
  },
  // 未绑定设备提示
  noidtip: function () {
    this.showZanDialog({
      title: '您还没有绑定设备',
      content: '点击下方的扫一扫，绑定设备',
      buttons: [{
        text: '取消',
        type: 'cancel'
      }, {
        text: '扫一扫',
        color: '#ff510d',
        type: 'scan'
      }]
    }).then(({ type }) => {
      if (`${type}` == 'scan') {
        wx.scanCode({
          success: (res) => {
            console.log(app.util.getUrlParam('scene', res.path))
            //设备用户关系绑定
            app.api.newData.result(app.util.getUrlParam('scene', res.path), app.globalData).then(res => {
              console.info(res)
            })
            // 缓存设备号
            app.wechat.setStorage('boxId', app.util.getUrlParam('scene', res.path))
          }
        })
      }

    });
  },


  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function onReady() {

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
  onShareAppMessage: function (res) {
    var that = this

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.activejson.channelName + '【当前正在播放：' + this.data.activejson.title + '】',
      path: '/pages/minor/detail-zb/detail-zb?channelId=' + this.data.options.channelId + '&share=true',
      success: function (res) {
        // 转发成功
        that.showZanToast({
          title: '分享成功',
          icon: 'wechat'
        }, 1500);
      },
      fail: function (res) {
        // 转发失败
        that.showZanToast({
          title: '分享失败',
          icon: 'fail'
        }, 1500);
      }
    }
  }
}));