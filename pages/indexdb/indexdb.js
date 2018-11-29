var app = getApp();

Page({
  data: {
    tabs: [{
      name: '电影', type: 'film'
    }, {
      name: '电视剧', type: 'tv'
    }, {
      name: '综艺', type: 'arts'
    }, {
      name: '动漫', type: 'anime'
    }, {
      name: '纪录片', type: 'documentary'
    }],
    activeTab: 0,
    categories: '',
    siftings: '',
    region: 0,
    tag: 0,
    year: 0,
    loading: true,
    loadtxt: '正在加载...',
    pageNo: 1,
    isFromType: true,
    nonet:false
  },
  onLoad: function (options) {
    // if(this.data.nonet)return;
    this.getdb(this.data.tabs[this.data.activeTab].type)
  },
  getdb: function getdb(e) {
    this.setData({
      region: '0',
      tag: '0',
      year: '0',
      pageNo: 1,
      siftings: '',
      loading: true,
      isFromType: true,
      loadtxt: '正在加载...'
    })
    var category = {
      API_URL: app.globalData.base + 'vodHome/column/category.json',
      data: {
        'type': e,
      }
    }
    app.fetch.newData.result(category).then(res => {
      var categories = res.data.response.responseBody;
      var regionlist = (categories.region).slice(1, (categories.region).length);
      var taglist = (categories.tag).slice(1, (categories.tag).length);
      var yearlist = (categories.year).slice(1, (categories.year).length);
      this.setData({
        categories: res.data.response.responseBody,
        regionList: regionlist,
        tagList: taglist,
        yearList: yearlist
      })
    }).then(res => {
      this.tabClick()
    })

  },
  tabClick: function tabClick(e) {
    if (e) {
      switch (e.currentTarget.dataset.type) {
        case "region":
          this.data.region = e.currentTarget.id
          this.setData({
            region: e.currentTarget.id
          })
          break;
        case "tag":
          this.data.tag = e.currentTarget.id
          this.setData({
            tag: e.currentTarget.id
          })
          break;
        case "year":
          this.data.year = e.currentTarget.id
          this.setData({
            year: e.currentTarget.id
          })
          break;
      }
      if (this.data.isFromType) {
        this.setData({
          siftings: '',
          pageNo: 1,
          loading: true,
          loadtxt: '正在加载...'
        })
      }
    }

    var siftings = {
      API_URL: app.globalData.base + 'search/siftings.json',
      data: {
        'tag': this.data.categories.tag[this.data.tag],
        'year': this.data.categories.year[this.data.year],
        'region': this.data.categories.region[this.data.region],
        'pageNo': this.data.pageNo,
        'pageSize': 9,
        'type': ''
        // 'type': this.data.tabs[this.data.activeTab].type
      }
    }

    app.fetch.newData.result(siftings).then(res => {
      this.setData({
        siftings: this.data.isFromType ? res.data.response.responseBody.list : this.data.siftings.concat(res.data.response.responseBody.list),
        isFromType: true
      })
      if (res.data.response.responseBody.list.length > 0) {
        this.setData({
          loading: false
        })
      } else {
        this.setData({
          loading: true,
          loadtxt: '无更多内容'
        })
      }
    }).catch(e => {
      this.setData({
        loading: false,
        loadtxt: '数据加载异常'
      })
      console.error(e);
    });
  },

  onShow: function () {
    //获取网络状态
    var that = this;
    app.wechat.getNetStatus().then(res => {
      if (res.networkType == 'none') {//无网络状态
        that.setData({
          nonet: true
        });
        return
      } else {
        if (that.data.nonet == true) {
          that.getdb(that.data.tabs[that.data.activeTab].type)
        }
        that.setData({
          nonet: false
        }) 
      }
    });    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.loading) {
      console.info('触底')
      this.setData({
        loading: true,
        isFromType: false,
        pageNo: this.data.pageNo + 1
      })
      this.tabClick()
    }

  }


})