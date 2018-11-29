// 设备的可视区域
const app = getApp();
Component({
  properties: {},
  data: {
    _r_value: ''
  },
  attached: function() {
    this.gethot()
  },
  methods: {
    gethot: function() {
      var that = this;
      app.fetch.newData.result({
        API_URL: app.globalData.base + 'search/getHotVideo.json?size=10',
      }).then(res => {
        var data = res.data;
        if (data && data.response.responseHeader.code == 200) {
          wx.setStorageSync('hotList', data.response.responseBody);
        }
        const hotList = wx.getStorageSync('hotList')
        var sjnum = wx.getStorageSync('sjnum')
        if (!sjnum){
           var sjnum = Math.floor(Math.random() * hotList.length + 1) - 1
           wx.setStorageSync('sjnum', sjnum);
        }

        var str = wx.getStorageSync('hissearch');
        if (str){
          var keyhistory = str.split(',').slice(0, 6)[0];
          that.setData({
            _r_value: keyhistory
          })
        }else{
          that.setData({
            _r_value: hotList[sjnum].word
          })
        }
      })
    }
  }

})