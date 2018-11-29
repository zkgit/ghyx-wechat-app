// 设备的可视区域
const app = getApp();
Component({
  properties: {
    _desc_data: {
      type: Object,
      value: {},
      observer: function(newData, oldData, mystate) {}
    },
    _zb_bs: {
      type: Boolean,
      value: false
    },
    _db_price:{
      type: String,
      value: ''
    }
  },
  data: {
    is_shortdes: true,
    mystate:{}
  },
  attached: function() {
    var that = this
    that._mystate()
  },
  methods: {
    _changedes: function() {
      var that = this;
      that.setData({
        is_shortdes: !that.data.is_shortdes
      })
    },
    _mystate: function() {
      var that = this;
      var url = {
        API_URL: app.globalData.base + 'users/state/check.json',
        data: {
          'openId': app.globalData.openId,
          'type': '0',
          'id': this.properties._desc_data.id,
          'tag': ''
        }
      }
      app.fetch.newData.result(url).then(res => {
        const states = res.data.response.responseBody;
        if (states) {
          const data = ({
            is_collect: states.isCollectioned == '1' ? true : false, //是否收藏
          })
          this.setData({
            mystate: data
          })
          console.info(this.mystate)
        }
      })
    },
    _collect: function() {
      var that = this;
      var url = {
        API_URL: app.globalData.base + 'users/collect/save.json',
        data: {
          'openId': app.globalData.openId,
          'type': '0',
          'id': this.properties._desc_data.id,
          'operation': this.data.mystate.is_collect ? -1 : 1,
          'title': this.properties._desc_data.title,
          'image': this.properties._desc_data.image,
          'videoType': this.properties._desc_data.videoType,
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
    }
  }

})