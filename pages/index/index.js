var app = getApp();
//首页
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // banners: [],
    newList: [],
    value: wx.getStorageSync('r_value'),
    pageNo: 1,
    tabType:2,//tab默认精选u
    curType: 'jx',//tab默认精选u
    pageNoForChange:2,
    pageNoForChange_db:2,
    nonet:false,
    dbListInfo:[],
    tabs: [{
        id: '1',
        title: '直播',
        type:'zb'
      }, {
        id: '2',
        title: '精选',
        type:'jx'
      }, {
        id: '3',
        title: '点播',
        type:'db'
      }],
},

  //tab切换
  changType: function (event) {
    var that = this;
    that.getNetStatus();
    var id = event.currentTarget.dataset.id;
    var curType = event.currentTarget.dataset.type;
    // this.getBanners(curType);

    // that.getBanners(curType);//获取当前tab的banner
    if (curType=='jx'){

    };
    if (curType == 'zb'){
      that.getZB_block();
    };
    if (curType == 'db'){
      that.getDB_list();//初始化点播
    };
    if (event) {
      that.setData({
        tabType: id,
        curType: curType
      })
    }
  },

  //获取banners
  getBanners: function (curType){
    var banInfoParams = {
      API_URL: app.globalData.base + 'home/banner.json',
      data: {
        'pageNo': 1,
        'pageSize': '6',
        'type': ''
      }
    };
    app.fetch.newData.result(banInfoParams).then(res => {    
      this.setData({
        curIndex: 0,
        banners: res.data.response.responseBody,
        itemTitle: res.data.response.responseBody[0].title
      })

      // if (curType == 'zb') {//统一处理会出现轮播与change事件不同步，分开赋值处理，changeTitle同理
      //   this.setData({
      //     banners_zb: res.data.response.responseBody,
      //     itemTitle_zb: res.data.response.responseBody[0].name
      //   })
      // }
      // if (curType == 'db') {
      //   this.setData({
      //     banners_db: res.data.response.responseBody,
      //     itemTitle_db: res.data.response.responseBody[0].name
      //   })
      // }
      // if (curType == 'jx') {
      //   this.setData({
      //     banners_jx: res.data.response.responseBody,
      //     itemTitle_jx: res.data.response.responseBody[0].name
      //   })
      // }
    })
  },

  //海报bindchange函数
  changeTitle: function (e) {
    var that = this;
    var a = e.detail.current;
    var t = e.currentTarget.dataset.type;
    that.setData({
      itemTitle: that.data.banners[a].title
    })
    // if(t == 'jx'){
    //   that.setData({
    //     itemTitle_jx: that.data.banners_jx[a].name
    //   })
    // }
    // if (t == 'zb') {
    //   that.setData({
    //     itemTitle_zb: that.data.banners_zb[a].name
    //   })
    // }
    // if (t == 'db') {
    //   that.setData({
    //     itemTitle_db: that.data.banners_db[a].name
    //   })
    // }
  },

  // 精选模块:`````````````````````````````````````````````````````````
  getJX_block:function(){
    var that = this;
    that.setData({
      'pageNo_zb': 1,
      'pageNo_hk': 1,
      'pageNo_db': 1,
      'pageNo_like': 1
    });
    that.getJX_zb();
    that.getJX_db();
    that.getJX_hK();
    setTimeout(function () { that.getJX_like();},1000);//为获取openid 异步等待一下
  },
  //精选模块里的换一换
  jx_changeInfo:function(event){   
    var that = this;
    var tag = event.currentTarget.dataset.tag;
    if (tag=='zb'){
      if (that.data.pageNo_zb>2){
        that.setData({
          'pageNo_zb':  1
        });
      }else{
        that.setData({
          'pageNo_zb': that.data.pageNo_zb + 1
        });
      }   
      that.getJX_zb();
    };
    if(tag=='hk'){
      if (that.data.pageNo_hk>2){
        that.setData({
          'pageNo_hk':  1,
        });
      }else{
        that.setData({
          'pageNo_hk': that.data.pageNo_hk + 1,
        });
      }
      that.getJX_hK();
    };
    if(tag=='db'){
      if (that.data.pageNo_db>2){
        that.setData({
          'pageNo_db':  1
        });
      }else{
        that.setData({
          'pageNo_db': that.data.pageNo_db + 1
        });
      }    
      that.getJX_db();
    };
    if(tag=='like'){
      if (that.data.pageNo_like>2){
        that.setData({
          'pageNo_like':  1
        });
      }else{
        that.setData({
          'pageNo_like': that.data.pageNo_like + 1
        });
      }
      
      that.getJX_like();
    };
  },
  //精选:直播
  getJX_zb: function() {
    var that = this;
    var params = {
      API_URL: app.globalData.base + 'home/hotLive.json',
      data: {
        'pageNo': that.data.pageNo_zb,
        'pageSize': '6'
      }
    }
    app.fetch.newData.result(params).then(res => {
      if (res.data.response.responseBody.list.length<6){
        that.setData({
          'pageNo_zb': 1
        });
      }
      if (res.data.response.responseBody.list.length==0) return;
      that.setData({
        jx_zbList: res.data.response.responseBody.list
      })
    })
  },
  //精选:回看
  getJX_hK: function() {
    var that = this;
    var params = {
      API_URL: app.globalData.base + 'home/hotLiveBack.json',
      data: {
        'pageNo': this.data.pageNo_hk,
        'pageSize': '6'
      }
    }
    app.fetch.newData.result(params).then(res => {
      var infos = res.data.response.responseBody.list;
      if (infos.length < 6) {
        that.setData({
          'pageNo_hk': 1
        });
      }
      if (infos.length==0)return;
      for (var i in infos) {//接口返回的date格式：2018-09-19
        if (infos[i].date) {
          var a = infos[i].date.substring(5, 6);
          if (infos[i].date.substring(5, 6) == 1) {
            infos[i].dateStr = infos[i].date ? (infos[i].date.substring(5, 10)).replace('-', '.') : '';
          } else {
            infos[i].dateStr = infos[i].date ? (infos[i].date.substring(6, 10)).replace('-', '.') : '';
          }
        }
      }
      this.setData({
        jx_backList: infos
      })
    })
  },
  //精选:点播
  getJX_db: function() {
    var params = {
      API_URL: app.globalData.base + 'home/allHot.json',
      data: {
        'pageNo': this.data.pageNo_db,
        'pageSize': '6'
      }
    }
    app.fetch.newData.result(params).then(res => {
      if (res.data.response.responseBody.list.length < 6) {
        that.setData({
          'pageNo_db': 1
        });
      }  
      if (res.data.response.responseBody.list.length==0)return;
      this.setData({
        jx_dbList: res.data.response.responseBody.list
      })
    })
  },
// 精选:猜你喜欢
  getJX_like: function() {
    var that = this;
    var allMyVideo = {
      API_URL: app.globalData.base + 'home/allItU.json',
      data: {
        'pageNo': this.data.pageNo_like,
        // 'pageNo':'123',
        'pageSize': '6',
        'openId':app.globalData.openId
      }
    }
    app.fetch.newData.result(allMyVideo).then(res => {
      if (res.data.response.responseBody.list.length < 6) {
        that.setData({
          'pageNo_like': 1
        });
      }
      if (res.data.response.responseBody.list.length == 0) return;
      this.setData({
        jx_likeList: res.data.response.responseBody.list
      })
    })
  },
// 精选直播跳转
  toLive: function () {
    this.setData({
      tabType: 1
    });
    this.goTop();
    // this.getBanners('zb');
    this.getZB_block();
  },
//精选点播跳转
  toDB: function () {
    this.setData({
      tabType: 3
    });
    this.goTop();
    // this.getBanners('db');
    this.getDB_list();
  },

// 直播模块:`````````````````````````````````````````````````````````
  changeTab:function(e){//跳转到电视tab
    app.data.acessTvName = e.currentTarget.dataset.acesstvname;
    console.log(e.currentTarget.dataset.acesstvname)
    wx.switchTab({
      url: '../tvlive/tvlive',
    })
  },
  getZB_block:function(){
    var that = this;
    that.setData({
      'pageNo': 1,
      'livecate':'ALL'
    });
    that.getZBList();
    that.getTabList();
  },
  //获取tab列表
  getTabList:function(){
    var that = this;
    var params = {
      API_URL: app.globalData.base + 'epg/liveCate.json',
      data: {
        'pageNo': 1,
        'pageSize': '6',
        'livecate': 'ALL'
      }
    }
    app.fetch.newData.result(params).then(res => {
      var tabs = res.data.response.responseBody;
      if (tabs.length > 8) { tabs = tabs.slice(0,8)}
      that.setData({
        tabListInfo: tabs
      })
    })
  },
  getZBList:function(){
    var that = this;
    var params = {
      API_URL: app.globalData.base + 'home/live/epgbylivecate.json',
      data: {
        'pageNo': 1,
        'pageSize': '6',
        'livecate': that.data.livecate
      }
    }
    app.fetch.newData.result(params).then(res => {
      that.setData({
        zbListInfo: res.data.response.responseBody
      })
    })
  },
//直播里面的换一换:DT.....无
  zb_changeInfo: function (event) {
    var that = this;
    var tag = event.currentTarget.dataset.tag;
    if (that.data.preTag == tag){//当前tag和上一个tag比较一下
      that.setData({
        pageNoForChange: that.data.pageNoForChange +1
      })
    }else{
      that.setData({
        pageNoForChange: 2
      })
    }
    if (that.data.pageNoForChange > 3) {//点击“换一换”可更换推荐内容，更换两次后，第三次点击，内容回到原位
      that.setData({
        pageNoForChange: 1
      })
    }
    if (that.data.backFirstPage) {//小于6条时，返回加载第一页 
      that.setData({
        pageNoForChange: 1
      })
    }
    that.getChildList(tag);
  },
  getChildList:function(tag){
    var that = this;
    var params = {
      API_URL: app.globalData.base + 'home/live/epgbylivecate.json',
      data: {
        'pageNo': that.data.pageNoForChange,
        'pageSize': '6',
        'livecate': tag
      }
    }
    app.fetch.newData.result(params).then(res => {
      var listInfos = that.data.zbListInfo;
      var childList = res.data.response.responseBody;
      if (!childList)return;
      if (childList.length < 6){//小于6条时，返回加载第一页 
        that.setData({
          backFirstPage: true
        })
      }else{
        that.setData({
          backFirstPage: false
        })
      };
      for (var i = 0; i < listInfos.length;i++){     
        if (listInfos[i].channel_en == tag){
          listInfos[i].result = [];
          listInfos[i].result = childList;
          that.setData({zbListInfo: listInfos,preTag:tag})
          return
        }
      }
    })
  },
// 点播模块:`````````````````````````````````````````````````````````
  getDB_list: function () { 
    var params = {
      API_URL: app.globalData.base + 'home/video/videobycategory.json',
      data: {
        'pageNo': 1,
        'pageSize': '6',
        'category':'ALL'
      }
    }
    app.fetch.newData.result(params).then(res => {
      this.setData({
        dbListInfo: res.data.response.responseBody
      })
    })
  },
//点播换一换
  db_changeList: function (event) {
    var that = this;
    var tag = event.currentTarget.dataset.tag;
    if (that.data.preTags == tag) {//当前tag和上一个tag比较一下
      that.setData({
        pageNoForChange_db: that.data.pageNoForChange_db + 1
      })
    } else {
      that.setData({
        pageNoForChange_db: 2
      })
    }
    if (that.data.pageNoForChange_db > 3) {//点击“换一换”可更换内容，更换两次后，第三次点击，内容回到原位
      that.setData({
        pageNoForChange_db: 1
      })
    }
    if (that.data.backFirstPages) {//小于6条时，返回加载第一页 
      that.setData({
        pageNoForChange_db: 1
      })
    }

    var params = {
      API_URL: app.globalData.base + 'home/video/videobycategory.json',
      data: {
        'pageNo': that.data.pageNoForChange_db,
        'pageSize': '6',
        'category': tag
      }
    }
    app.fetch.newData.result(params).then(res => {
      var childList = res.data.response.responseBody;
      var listInfos = that.data.dbListInfo;
      if (childList){
        if (childList.length < 6) {//小于6条时，返回加载第一页 
          that.setData({
            backFirstPages: true
          })
        } else {
          that.setData({
            backFirstPages: false
          })
        };
        for (var i = 0; i < listInfos.length; i++) {
          if (listInfos[i].channel_en == tag) {
            listInfos[i].result = [];
            listInfos[i].result = childList;
            that.setData({ dbListInfo: listInfos, preTags: tag})
            return
          }
        }
      } 
    })
  },

  onLoad: function (params) {
    // let that = this;
    // that.getBanners('jx');
    // that.getJX_block();//初始化精选
    // that.getDB_list();//初始化点播
    this.getBanners();
  },
  getJX_db: function() {
    var params = {
      API_URL: app.globalData.base + 'home/allHot.json',
      data: {
        'pageNo': this.data.pageNo_db,
        'pageSize': '6'
      }
    }
    app.fetch.newData.result(params).then(res => {
      if (res.data.response.responseBody.list.length < 6) {
        that.setData({
          'pageNo_db': 1
        });
      }  
      if (res.data.response.responseBody.list.length==0)return;
      this.setData({
        jx_dbList: res.data.response.responseBody.list
      })
    })
  },
  
  //回到顶部
  goTop: function () {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (params) {
    // this.allList()
    var that = this;
    that.getNetStatus();
    // that.getBanners('jx');
    that.getJX_block();//初始化精选
    that.gethot();
  },

  getNetStatus:function(){
    var that = this;
    app.wechat.getNetStatus().then(res => {
      if (res.networkType == 'none') {//无网络状态
        that.setData({
          nonet: true
        })
      } else {
        if (that.data.nonet == true) {
          var curType = that.data.curType;
          that.getBanners(curType);
          if (curType == 'jx') {
            that.getJX_block()
          };
          if (curType == 'zb') {
            that.getZB_block();
          };
          if (curType == 'db') {
            that.getDB_list();//初始化点播
          };
          // if (getCurrentPages().length != 0) {
          //   getCurrentPages()[getCurrentPages().length - 1].onLoad();//重新加载当前页面
          // }
        }
        that.setData({
          nonet: false
        })
      }
    });
  },

  gethot: function () {
    var that = this;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'search/getHotVideo.json?size=10',
    }).then(res => {
      var data = res.data;
      var hotList;
      if (data && data.response.responseHeader.code == 200) {
        wx.setStorageSync('hotList', data.response.responseBody);
        hotList = data.response.responseBody;
      }

    var str = wx.getStorageSync('hissearch');
    // var sjnum = Math.floor(Math.random() * hotList.length + 1) - 1;
    var sjnum = wx.getStorageSync('sjnum');
    if (sjnum) { } else {
      sjnum = Math.floor(Math.random() * hotList.length + 1) - 1;
      wx.setStorageSync('sjnum', sjnum);
    }  
    if (str) {
      var keyhistory = str.split(',').slice(0, 6)[0];
      that.setData({
        _r_values: keyhistory
      })
    } else {
      that.setData({
        _r_values: hotList[sjnum].word
      })
    }


  })},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})