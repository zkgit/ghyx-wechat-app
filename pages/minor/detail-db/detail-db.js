// pages/minor/detail-db/detail-db.js

const app = getApp();
const { Toast, Dialog, extend } = require('../../../style/dist/index');
Page(extend({}, Toast, Dialog, {
  /**
   * 页面的初始数据
   */
  data: {
    is_shortdes: true,
    showPopup: false,
    backhome:false,
    detail:'',
    currentTab:'0',
    showOrderPop:false,
    showLoadMore:false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      avatarUrl: app.globalData.avatarUrl
    })
    this.getDetail();
    if (options.share) {
      this.setData({
        backhome: true
      })
    };
    // this.getGList();
  },
  changedes: function () {
    var that = this;
    that.setData({
      is_shortdes: !that.data.is_shortdes
    })
  },
  getDetail: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'home/detail.json',
      data: {
        kankeId: '',
        id: that.data.options.id
      }
    }).then(res => {
      if (res.data.response.responseHeader.code == "200") {
        var detail = res.data.response.responseBody;
        detail.tags = detail.tags.split(';').slice(0, 3);
        that.setData({
          detail: res.data.response.responseBody,
        })
        
        wx.setNavigationBarTitle({ title: that.data.detail.title });
      }
    }).then(res=>{
      that.recommend()   
      that.actor();
      that.tvDrama();
      setTimeout(function(){
        that.add_price();
      },500)
      
      //  if (that.data.options.columnType != 'film') {
      //   that.tvDrama()
      // } 
    })
  },
  switchTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.current });
    this.add_price(e.currentTarget.dataset.current);
  },
  actor: function () {
    var that = this;
    var directorIds = that.data.detail.directorIds ? that.data.detail.directorIds : '';
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'recommend/star/profiles.json',
      data: {
        directorId: directorIds,
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
        kankeId: '',
        id: that.data.options.id,
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
  collect: function () {
    var that = this;
    var url = {
      API_URL: app.globalData.base + 'users/collect/save.json',
      data: {
        'openId': app.globalData.openId,
        'type': '0',
        'id': this.data.detail.id,
        'operation': this.data.mystate.is_collect ? -1 : 1,
        'title': this.data.detail.title,
        'image': this.data.detail.image,
        'videoType': this.data.detail.videoType,
      }
    }
    app.fetch.newData.result(url).then(res => {
      if (res && res.data.response.responseHeader.code == "200") {
        that.setData({
          'mystate.is_collect': !that.data.mystate.is_collect
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
  // goplay: function (e) {
  //   var that = this;
  //   // if (!wx.getStorageSync('userCode')) {
  //   //   wx.navigateTo({
  //   //     url: "/pages/login/login"
  //   //   })
  //   //   return false
  //   // }
  //   if (!wx.getStorageSync('boxId')) {
  //     that.setData({
  //       showPopup: false
  //     });
  //     // that.noidtip()
  //     return false
  //   }
  //   //推送鉴权
  //   app.activateBoxAccess();
  //   if (wx.getStorageSync('activateStatus') == 'SUCCESS') {
      
  //   } else {
  //     that.setData({
  //       showPopup: false
  //     });
  //     this.showZanDialog({
  //       title: '无法观看',
  //       content: '此片为会员内容，请购买观看;如已购买，请激活会员',
  //       buttons: [
  //         {
  //           text: '取消', type: 'cancel'
  //         }, {
  //           text: '激活', color: '#ff5e00', type: 'active'
  //         }, {
  //           text: '购买', color: '#ff5e00', type: 'buy'
  //         },]
  //     }).then(({ type }) => {
  //       var btnType = `${type}`;
  //       if (btnType == 'buy') {
  //         wx.navigateTo({
  //           url: "/pages/vip/pay/pay"
  //         })
  //       };
  //       if (btnType == 'active') {
  //         wx.navigateTo({
  //           url: "/pages/minor/mine_orderlist/mine_orderlist"
  //         })
  //       };
  //     });
  //     return
  //   }; 

  //   var index = this.data.options.columnType == 'film' ? '0' : e.currentTarget.dataset.index
  //   var url = {
  //     API_URL: app.globalData.b2b + 'psm/playBack.do',
  //     data: {
  //       'userCode': wx.getStorageSync('userCode'),
  //       'assetId': that.data.fadedmt[index].playUrl,
  //       'providerId': that.data.fadedmt[index].name
  //     }
  //   }
  //   app.fetch.newData.result(url).then(res => {
  //     if (res && res.data.result == "success") { 
  //       that.showZanToast({
  //         title: '推送电视成功',
  //         icon: 'wechat'
  //       }, 1500);
  //     } else {
  //       that.showZanToast({
  //         title: '推送电视失败',
  //         icon: 'fail'
  //       }, 1500);
  //     }
  //   })
  //   // 添加历史
  //   this.addhistory(index)
  //   this.setData({
  //     showPopup: false
  //   });
  // },
  // playtv: function () {
  //   var that = this;
  //   that.tvDrama()
  // },
  openPopup(){
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  //关闭遮罩层
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  // 剧集
  tvDrama: function () {
    var that = this;
    var url = {
      API_URL: app.globalData.base + 'vodHome/drama.json',
      data: {
        'seriesCode': that.data.detail.playCode,
        'pageSize': '100',
        'pageNo': '1'
      }
    }
    app.fetch.newData.result(url).then(res => {
      that.setData({
        dmtotalrecords: res.data.response.responseBody.totalrecords,
        fadedmt: res.data.response.responseBody.list,
        updateVod: res.data.response.responseBody.updateVod
      });
    }).then(res => {
      // 解决电影取剧集异步问题
      if (that.data.options.columnType == 'film') {
        that.goplay()
      }
    })
  },
  // 获取价格:一开始价格从单独接口拿 现在从剧集接口拿
  add_price:function(e){
    var that = this;
    var index = e ? e : 0;
    if (that.data.fadedmt&&that.data.fadedmt[index].price){
      that.setData({
        db_price: that.data.fadedmt[index].price
      });
    }
    that.getGList(index);
    // var url = {
    //   API_URL: app.globalData.base + 'vod/price.json',
    //   data: {
    //     'seriesCode': that.data.detail.playCode,
    //     'volumnCount':e?e:1
    //   }
    // }
    // app.fetch.newData.result(url).then(res => {
    //   that.setData({
    //     db_price: res.data.response.responseBody,
    //   });
    // })
  },
  //选中事件
  selectItem:function(e){
    var that = this;
    that.setData({
      selectIndex: e.currentTarget.dataset.index
    });
  },
  cancelPop:function(){
    this.setData({
      showOrderPop: false
    });
  },
  //点击购买
  comfirmAction:function(){
    var that = this;
    var index = that.data.selectIndex ? that.data.selectIndex:0;
    if (that.data.fadedmt && index == 0) {//第一条数据是插入的单片购买数据
      that.toBuy1()
    } else {
      that.toBuy2(index);
    }
  },



//单片购买
  toBuy1: function () {
    var that = this;
    var openId = app.globalData.openId;
    var userCode = wx.getStorageSync('userCode');
    const boxId = wx.getStorageSync('boxId');
    that.showZanDialog({
      title: '立即订购',
      content: '请确认是否订购',
      confirmColor: '#ff510d',
      showCancel: true
    }).then(() => {
      that.setData({
        showLoadMore: true,
        showOrderPop: false
      })
      var params = {
        API_URL: app.globalData.b2b + 'order/createOrderSMP.do',
        data: {
          'userCode': userCode,
          'deviceNo': boxId,
          'openId': openId,
          'providerId': that.data.fadedmt[0].cpCode,
          'assetId': that.data.fadedmt[0].code,
          'productOfferingId': that.data.detail.productOfferingId,
          'productName': that.data.detail.title,
          'imgUrl': that.data.detail.image,
          // 'price': that.data.goodsList[0].currentPrice
          // 'price': 0.1
          'price': that.data.db_price
        }
      }
      app.fetch.newData.result(params).then(res => {
        that.setData({
          showLoadMore: false,
          showOrderPop: false
        })
        var responseBody = res.data.response.responseBody;
        if (responseBody.code == 200) {
          var payJson = responseBody.payJson;
          var orderId = responseBody.orderId;
          that.wxpay(payJson, orderId);
        } else {
          that.showZanToast({
            title: res.data.response.responseHeader.msg,
            icon: 'fail',
          })
        }
      })

    }).catch(() => { 
      that.setData({
        showLoadMore: false,
        // showOrderPop:false
      })
    });
  },
  //立即订购事件: 产品包订购逻辑
  toBuy2: function (index) {
    var that = this;
    var userCode = wx.getStorageSync('userCode');
    const boxId = wx.getStorageSync('boxId');
    // if (!that.data.selectIndex) { that.showZanToast({ title: '请选择订购产品', icon: '' }, 1500); return };
    this.showZanDialog({
      title: '立即订购',
      content: '请确认是否订购',
      confirmColor: '#ff510d',
      showCancel: true
    }).then(() => {
      that.setData({
        showLoadMore: true,
        showOrderPop: false
      })
      var openId = app.globalData.openId;
      var itemInfo = that.data.goodsList[index];//选中的item参数
      var params = {
        API_URL: app.globalData.b2b + 'order/createOrderECCH.do',
        data: {
          'userCode': userCode,
          'deviceNo': boxId,
          'openId': openId,
          'price': itemInfo.currentPrice,
          'packageCode': itemInfo.packageCode,
          'productCode': itemInfo.productCode,
          'productName': itemInfo.productName
        }
      };
      app.fetch.newData.result(params).then(res => {
        that.setData({
          showLoadMore: false,
          showOrderPop: false
        })
        var responseBody = res.data.response.responseBody;
        if (responseBody.code == 200) {
          var payJson = responseBody.payJson;
          var orderId = responseBody.orderId;
          that.wxpay(payJson, orderId);
        } else {
          that.showZanToast({
            title: res.data.response.responseHeader.msg,
            icon: 'fail',
          })
        }
      })
    }).catch(() => {
      that.setData({
        showLoadMore: false,
        // showOrderPop:false
      })
      console.log('取消');
    });
  },

  toggleToast:function(e){
    var that = this;
    console.log(e.detail);
    // that.setData({
    //   showOrderPop: e.detail.showOrderPop
    // });
    that.showZanDialog({
      title: '提示',
      content: '当前影片为付费影片，是否前去订购？',
      confirmColor: '#ff510d',
      showCancel: true
    }).then(() => {
      that.setData({
        showOrderPop: e.detail.showOrderPop
      });
    }).catch(() => { });
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

  paySuccess: function (orderNo) {
    var that = this;
    var params = {
      API_URL: app.globalData.b2b + 'order/orderResultWeb.do',
      data: {
        'orderNo': orderNo,
        'payResult': 'success'
      }
    }
    app.fetch.newData.result(params).then(res => {
      if (res.data.code == 200) {
        that.showZanToast({
          title: res.data.msg,
          icon: 'success',
        })
      }
    })
  },


  //获取弹窗订购列表
  getGList:function(index){
    var that = this;
    var params = {
      API_URL: app.globalData.server + 'b2b-bgctv/product/payPackage.json',
      data: {
        'pageNo': 1,
        'pageSize': '6'
      }
    }
    app.fetch.newData.result(params).then(res => {
      var list = res.data.response.responseBody[0].list;
      if (that.data.fadedmt&&that.data.fadedmt[index].price){
        var curPriceInfo = { currentPrice: that.data.fadedmt[index].price, subTitle: '可免费观看72小时', productName:'订购此片' }; 
        list.unshift(curPriceInfo);//把单片购买的数据插入list头部
      }
      that.setData({
        goodsList:list,
        selectIndex: 0
      })
    })
  },
  // 添加历史
  // addhistory: function (e) {
  //   var that = this;
  //   var playNumber = that.data.options.columnType == 'film' ? '' : that.data.fadedmt[e].volumnCount
  //   var url = {
  //     API_URL: app.globalData.base + 'users/history/save.json',
  //     data: {
  //       'openId': app.globalData.openId,
  //       'id': that.data.detail.id,
  //       'code': that.data.detail.playCode,
  //       'recommend': that.data.options.recommend ? '1' : '0',
  //       'type': '0',
  //       'playNumber': playNumber
  //     }
  //   }
  //   app.fetch.newData.result(url).then(res => {

  //   })
  // },
  // 未绑定设备提示
  // noidtip: function () {
  //   this.showZanDialog({
  //     title: '您还没有绑定设备',
  //     content: '点击下方的扫一扫，绑定设备',
  //     buttons: [{
  //       text: '取消',
  //       type: 'cancel'
  //     }, {
  //       text: '扫一扫',
  //       color: '#ff510d',
  //       type: 'scan'
  //     }]
  //   }).then(({ type }) => {
  //     if (`${type}` == 'scan') {
  //       wx.scanCode({
  //         success: (res) => {
  //           console.log(app.util.getUrlParam('scene', res.path))
  //           //设备用户关系绑定
  //           app.api.newData.result(app.util.getUrlParam('scene', res.path), app.globalData).then(res => {
  //             console.info(res)
  //           })
  //           // 缓存设备号
  //           app.wechat.setStorage('boxId', app.util.getUrlParam('scene', res.path))
  //         }
  //       })
  //     }

  //   });
  // },
//   },
//   keyinput: function (e) {
//     this.setData({
//       inputVal: e.detail.value
//     })
//     console.log(e.detail.value)
//   },
//   sendcomment: function () {
//     var that = this;
//     if (!that.data.inputVal) {
//       wx.showToast({
//         title: '评论内容不可为空',
//         icon: 'none',
//         duration: 2000
//       })
//     } else {
//       var url;
//       if (that.data.replyId) {
//         url = {
//           API_URL: app.globalData.base + 'users/comment/save.json',
//           data: {
//             'openId': app.globalData.openId,
//             'id': that.data.detail.id,
//             'context': that.data.inputVal,
//             'kankeId': '',
//             'replyId': that.data.replyId,
//             'type': 0,
//             'name': app.globalData.nickName
//           }
//         }
//       } else {
//         url = {
//           API_URL: app.globalData.base + 'users/comment/save.json',
//           data: {
//             'openId': app.globalData.openId,
//             'id': that.data.detail.id,
//             'context': that.data.inputVal,
//             'kankeId': '',
//             'replayId': '',
//             'type': 0,
//             'name': '',
//             'title': that.data.detail.title
//           }
//         }
//       }

//       app.fetch.newData.result(url).then(res => {
//         that.sendPopupMessage();
//         wx.showToast({
//           title: res.data.response.responseHeader.msg,
//           icon: 'none',
//           duration: 2000
//         })
//         that.setData({
//           inputVal: '',
//           replyId: '',
//           replyname: ''
//         })
//         that.getcomment();
//       })

//     }
//   },
//   changeInput: function (e) {
//     this.setData({
//       placeholder: '回复@' + e.currentTarget.dataset.nickname,
//       focus: true,
//       replyId: e.currentTarget.dataset.id,
//       replyname: e.currentTarget.dataset.nickname
//     })
//   },
//   getreply: function (e) {
//     var that = this;
//     var eq = e.currentTarget.dataset.eq;
//     var total = e.currentTarget.dataset.total;
//     if (total > 5 && (that.data.comment[eq].page.list.length < total)) {
//       var url = {
//         API_URL: app.globalData.base + 'users/reply/list.json',
//         data: {
//           'id': e.currentTarget.dataset.id,
//           'pageNo': 1,
//           'pageSize': total
//         }
//       }
//       app.fetch.newData.result(url).then(res => {
//         if (res.data.response.responseHeader.code) {
//           that.data.comment[eq].page.list = res.data.response.responseBody.list;
//           that.data.comment[eq].showreply = !that.data.comment[eq].showreply;
//           that.setData({
//             comment: that.data.comment
//           })
//         }

//       })
//     } else {
//       that.data.comment[eq].showreply = !that.data.comment[eq].showreply;
//       that.setData({
//         comment: that.data.comment
//       })
//     }
//   },
//   blurfocus: function () {
//     this.setData({
//       focus: false,
//       placeholder: ''
//     })
//   },
//   getcomment: function () {
//     var that = this;
//     var url = {
//       API_URL: app.globalData.base + 'users/comment/list.json',
//       data: {
//         'openId': app.globalData.openId,
//         'id': that.data.options.id,
//         'kankeId': '',
//         'type': 0,
//         'pageNo': 1,
//         'pageSize': 6
//       }
//     }
//     app.fetch.newData.result(url).then(res => {
//       that.setData({
//         comment: res.data.response.responseBody.list
//       });
//     })
//   },

//   like: function (e) {
//     var that = this;
//     if (e.currentTarget.dataset.status) {
//       return false;
//     }
//     var url = {
//       API_URL: app.globalData.base + 'users/like.json',
//       data: {
//         'openId': app.globalData.openId,
//         'id': e.currentTarget.dataset.id,
//         'tag': 'C',
//         'type': 0,
//         'operation': 1
//       }
//     }
//     app.fetch.newData.result(url).then(res => {
//       if (res.data.response.responseHeader.code == 200) {
//         wx.showToast({
//           title: '点赞成功',
//           icon: 'none',
//           duration: 2000
//         })
//         that.getcomment();
//       } else {
//         wx.showToast({
//           title: '点赞失败',
//           icon: 'none',
//           duration: 2000
//         })
//       }
//     })
//   },
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
      title: this.data.detail.title,
      path: '/pages/minor/detail-db/detail-db?id=' + this.data.detail.id + '&columnType=' + this.data.detail.videoType + '&share=true',
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
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function onReady() {

  }
}));
