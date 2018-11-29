const app = getApp();
Component({
  properties: {
    _nonet: {
      type: Boolean,
      value: false
    }
  },
  data: {
    _nonet: false
  },
  attached: function () {
    this.getNetType()
  },
  methods: {
    getNetType: function () {
      var that = this;
      console.info("000")
      wx.getNetworkType({ 
        success: function(res){
          if (res.networkType == 'none'){
            that.setData({
              _nonet: true
            })
          }else{
            if (that.data._nonet==true){
              if (getCurrentPages().length != 0) {
                getCurrentPages()[getCurrentPages().length - 1].onLoad();//重新加载当前页面
              }
            }
            that.setData({
              _nonet: false
            })
          }
        }, 
       })
    }
  }
})