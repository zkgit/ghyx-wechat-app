// pages/search/search.js
const app = getApp();
let allpage = 1, preClick = false, onlyOne, hasPlace=false,
  flag = false;
const {
  Dialog,
  extend
} = require('../../style/dist/index');
Page(extend({}, Dialog, {

  /**
   * 页面的初始数据
   */
  data: {
    type: 'vod',
    inputval: '',
    textList: [],
    isresult: false, //是否在搜索
    vodtype: 0,
    videoType: '',
    pageNo: 1,
    pageSize: 10,
    searchList: [],
    allloadtext: '正在加载...',
    loadtext: '正在加载...',
    flag: false,
    hasLoadAll:false,
    typelist: [{
      name: '全部',
      type: '0'
    }, {
      name: '电视频道',
      type: '2'
    }, {
      name: '电视节目',
      type: '3'
    }, {
      name: '片库',
      type: '1'
    }],
    textList: ['奔跑吧兄弟', '热血街舞团', '小猪佩奇', '泡沫之夏', '向往的生活', '妈妈是超人', '温暖的弦'],
    alllist: [],
    preSearchVal:'',
    preType:'',
    preInputval:'',
    backlist:[],
    zblist:[],
    dblist:[],
    loadall:false,
    valForPlacehoder:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var str = wx.getStorageSync('hissearch');
    this.setData({
      keyhistory: str ? str.split(',').slice(0, 6) : []
    })
  },
  clearhis: function() {
    this.showZanDialog({
      title: '清空',
      content: '确定清空该账号的全部搜索历史\n吗',
      buttons: [{
        text: '取消',
        type: 'cancel'
      }, {
        text: '清空',
        color: '#ff510d',
        type: 'clear'
      }]
    }).then(({
      type
    }) => {
      if (type == 'clear') {
        this.setData({
          keyhistory: []
        })
        wx.setStorageSync('hissearch', '');
        wx.showToast({
          title: '已清空',
          icon: 'none'
        })
        const hotList = wx.getStorageSync('hotList')
        var sjnum = wx.getStorageSync('sjnum');
        if (!sjnum){
          var sjnum = Math.floor(Math.random() * hotList.length + 1) - 1;
          wx.setStorageSync('sjnum', sjnum);
        }       
        var keyhistory = hotList[sjnum].word;
        this.setData({
          valForPlacehoder: keyhistory
        })
      }
    })
  },
  gethot: function() {
    const hotList = wx.getStorageSync('hotList')
    this.setData({
      hotList: hotList,
    })
    var str = wx.getStorageSync('hissearch');
    // var sjnum = Math.floor(Math.random() * hotList.length + 1) - 1;
    var sjnum = wx.getStorageSync('sjnum');
    if (!sjnum){
      sjnum = Math.floor(Math.random() * hotList.length + 1) - 1;
      wx.setStorageSync('sjnum', sjnum);
    }
    if (str) {
      var keyhistory = str.split(',').slice(0, 6)[0];
      this.setData({
        valForPlacehoder: keyhistory
      })
    } else {
      this.setData({
        valForPlacehoder: hotList[sjnum].word
      })
    }
    hasPlace=false    
  },
  search_clear: function() {
    this.setData({
      isresult: false,
      inputval: '',
      searchList: [],
      alllist:[],
      preInputval:''
    })
    hasPlace=false
  },
  searchsub: function(e) { //点击点播或直播
    console.log(e)
    var that = this;
    var inputval = e.detail.value.replace(/\s/ig, '');
    that.setData({
      inputval: inputval,
      isresult: false
    })
    if (!inputval){
      hasPlace = false    
      that.setData({
        preInputval: '',
        valForPlacehoder: '',
        alllist: []
      })
    }
    setTimeout(function(){
      that.keylen()
    },500)
    
  },
  changevodType: function(e) {
    if (preClick == true) return;//preClick锁控制，防止多次连续请求
    var that = this;
    if (e.currentTarget.dataset.vodtype==0){
      allpage = 1
      that.setData({
        alllist: []
      })
    }
    if (e.currentTarget.dataset.vodtype==0){

    }else{
      if (onlyOne == e.currentTarget.dataset.vodtype) {
        return
      } else {
        that.setData({
          searchList: [],
          pageNo: 1,
          loadtext: '正在加载...',
          videoType: e ? e.currentTarget.dataset.vodtype : ''
        })
      }//tab 只能点击一次，减少垃圾请求
    }
    
    onlyOne = e.currentTarget.dataset.vodtype;   
    that.setData({
      vodtype: e.currentTarget.dataset.vodtype,
      isresult: true,
      loadall:false
    })
    // if (that.data.preType != e.currentTarget.dataset.vodtype) {
    //   that.setData({
    //     searchList: [],
    //     pageNo: 1,
    //     loadtext: '正在加载...'
    //   })
    // }
    that.getAjax();
    // that.sccol(e);
  },
  clicksearch: function() { //点击搜索按钮 
    this.setData({
      textList: []
    })
    if (!this.data.inputval && !this.data.valForPlacehoder) {
      return
    }
    if (this.data.valForPlacehoder && !hasPlace) {
      this.setData({
        inputval: this.data.valForPlacehoder
      })
    }

    if (this.data.preInputval == this.data.inputval){
      return;
    }
    this.setData({
      isresult: true,
      list: [],
      textList: [],
      searchList: [],
      preType:'',
      loadall:false
    })
    hasPlace = true;
    this.setLocal();
    this.getAjax();
  },
  setLocal: function() {
    if (!this.data.inputval){return};
    var str = wx.getStorageSync('hissearch'),
      isin = false,
      strarr = [];
    if (str) {
      strarr = str.split(',');
      for (var i = 0; i < 6; i++) {
        if (this.data.inputval == strarr[i]) {
          isin = true;
            strarr.splice(i,1);
            str = this.data.inputval + ',' + strarr.join(',').substr(0, 200);
        } 
      }
      if (!isin) {
        if (strarr.length) {
          str = this.data.inputval + ',' + strarr.join(',').substr(0, 200);
        }
      }
    } else {
      str = this.data.inputval;
    }
    wx.setStorageSync('hissearch', str);
    this.setData({
      keyhistory: str.split(',').slice(0, 6)
    })
  },
  getway: function() {

  },
  getall: function() {
    var that = this;
    console.log('flag', flag, that.data.allloadtext)
    if (flag) {
      return;
    }
    if (that.data.preSearchVal !== that.data.inputval) {
      that.setData({
        alllist: []
      });
      allpage = 1;
    }
    if (that.data.vodtype==1){
      allpage = 1;
    }
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'search/searchLiveAndDemand.json',
      data: {
        key: that.data.inputval,
        way: 0,
        pageNo: allpage,
        pageSize: 6
      }
    }).then(({
      data
    }) => {
      preClick = false; 
      if (data && data.response.responseHeader.code == 200 && data.response.responseBody) {      
        var _alist = data.response.responseBody;
        flag = true;
        if (_alist.live && allpage <= _alist.live.totalPage && _alist.live.list.length) {
          that.data.alllist = that.data.alllist.concat(_alist.live.list);
          flag = false;
          if (_alist.live.currentPage == _alist.live.totalPage){
            flag = true;
          }
        }
        if (_alist.liveback && allpage <= _alist.liveback.totalPage && _alist.liveback.list.length) {
          that.data.alllist = that.data.alllist.concat(_alist.liveback.list);
          flag = false;
          if (_alist.liveback.currentPage == _alist.liveback.totalPage) {
            flag = true;
          }
        }
        if (_alist.video && allpage <= _alist.video.totalPage && _alist.video.list.length) {
          for (var i = 0; i < _alist.video.list.length; i++) {
            _alist.video.list[i].tags = _alist.video.list[i].tags.split(';').slice(0, 3);
          }     
          that.data.alllist = that.data.alllist.concat(_alist.video.list);
          flag = false;
          if (_alist.video.currentPage == _alist.video.totalPage) {
            flag = true;
          }
        }
        if (!flag) {
          allpage++;
        }
        that.setData({
          alllist: that.data.alllist,
          allloadtext: that.data.alllist.length ? (flag ? '已加载全部数据' : '正在加载...') : '暂无数据',
          flag: flag,
          preSearchVal: that.data.inputval,
          preType:0,
          preInputval: that.data.inputval,
          // valForPlacehoder: that.data.inputval
          valForPlacehoder: ''
        })
        // if (!flag && that.data.alllist.length < 6) {//这个是干嘛的ya 
        //   that.getall();
        // }
      } else {
        that.setData({
          allloadtext: '暂无数据',
          valForPlacehoder: that.data.inputval
        })
      }
      flag = false;
      setTimeout(function(){
        that.setData({
          textList: []
        })
      },500)
      
    })
  },
  getAjax: function() {
    var that = this;
    let ctype = that.data.typelist[that.data.vodtype].type;
    if (ctype == 0) {
      that.getall();
      return;
    }     
    if (that.data.loadall) { return }
    // if (that.data.preType == ctype) { return }    
    if (that.data.loadall && that.data.preType !== ctype) {
      that.setData({
        searchList: [],
        pageNo: 1,
        loadtext: '正在加载...'
      })
    } 
    preClick = true;
    app.fetch.newData.result({
      API_URL: app.globalData.base + 'search/searchLiveAndDemand.json',
      data: {
        key: that.data.inputval,
        way: ctype,
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize
      }
    }).then(({
      data
    }) => {
      preClick = false;
      if (data && data.response.responseHeader.code == 200 && data.response.responseBody.totalrecords) {  
        var _shlist = data.response.responseBody.list;
        if (ctype == 1) {
          for (var i = 0; i < _shlist.length; i++) {
            _shlist[i].tags = _shlist[i].tags.split(';').slice(0, 3);
          }
        }

        that.setData({
          searchList: that.data.searchList.concat(_shlist),
          flag: false,
          valForPlacehoder:''
        })
        if (that.data.searchList.length == data.response.responseBody.totalrecords) {
          that.setData({
            loadtext: '已加载全部数据',
            preType: ctype,
            preInputval: that.data.inputval
          })
        }else{
          that.setData({
            loadtext: '正在加载...',
          })
        }
        if (data.response.responseBody.currentPage == data.response.responseBody.totalPage || !data.response.responseBody){
          that.setData({
            loadall:true,
            preType: ctype,
          })
        }
      } else {
        that.setData({
          loadtext: that.data.searchList.length ? '已加载全部数据' : '暂无数据',
          preType: ctype,
          preInputval: that.data.inputval,
          loadall: true,
          valForPlacehoder: that.data.inputval
        })
      }
      setTimeout(function () {
        that.setData({
          textList: []
        })
      }, 500)
    })
  },
  scrollLower: function() {
    var that = this;
    if (!that.data.flag) {
      that.setData({
        pageNo: that.data.pageNo+1
      })
      that.getAjax();
    }
    that.setData({
      flag: true
    })

  },
  sccol: function(e) { //搜索初始化 点击点播的分类
    var that = this;
    this.setData({
      loadtext: '正在加载...',
      searchList: [],
      pageNo: 1,
      videoType: e ? e.currentTarget.dataset.vodtype : ''
    })
    this.getAjax();
  },
  keysearch: function(e) { //点击关键字搜索
    this.setData({
      inputval: e.currentTarget.dataset.key,
      textList: [],
      alllist: [],
      allloadtext: '正在加载...',
      pageNo: 1,
      isresult: true,
      searchList: [],
      preType:'',
      loadall:false,
      preType:''
    })
    allpage = 1;
    this.getAjax();
    this.setLocal();

  },
  keylen: function() { //联想
    var that = this;
    if (that.data.inputval) {
      app.fetch.newData.result({
        API_URL: app.globalData.base + 'search/searchWordAssociate.json',
        data: {
          key: that.data.inputval,
          pageNo: 1,
          pageSize: 25
        }
      }).then(res => {
        var data = res.data;
        if (data && data.response.responseHeader.code == 200) {
          that.setData({
            textList: data.response.responseBody
          })
        }
      })
    } else {
      
    }
  },

  // changeType: function (e) {
  //   if (e.currentTarget.dataset.type!=this.data.type){
  //     this.setData({
  //       type: e.currentTarget.dataset.type,
  //       pageNo: 1,
  //       searchList: [],
  //       textList:[]       
  //     })
  //     if (this.data.inputval) {
  //       // this.keylen();
  //       this.setData({
  //         isresult: true,
  //         loadtext: '正在加载...'
  //       })
  //       this.getAjax();
  //     }
  //   }

  // },
  goback: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.gethot();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
}))