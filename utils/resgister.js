var fetch = require('./fetch.js');
const phonereg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
  codereg = /\d{4}/,
  // pwdreg = /^[A-Za-z0-9]+$/;
pwdreg = /([0-9a-zA-Z]){6,16}/;
  // pwdreg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
let time = 0,
  timer, rescode = '',phoneRegNum = '';
const regfun = {
  input: function(e) {
    let name = e.currentTarget.dataset.name;
    switch (name) {
      case 'phone':
        if (!phonereg.test(e.detail.value)) {
          return;
        }
        this.setData({
          phone: e.detail.value
        })
        if (this.data.phone.length == 11 && this.data.cachephone.indexOf(this.data.phone) < 0) {
          this.data.cachephone.unshift(this.data.phone)
          wx.setStorage({
            key: 'phone',
            data: this.data.cachephone.slice(0, 3)      
          })
        }
        if (!phonereg.test(e.detail.value)) {
          this.setData({
            codestate: false
          })
        }else{
          this.setData({
            codestate: true
          })
        }
        break;
      case 'code':
        this.setData({
          code: e.detail.value
        })
        break;
      case 'pwd':
        this.data.pwd[e.currentTarget.dataset.pwd] = e.detail.value;
        this.setData({
          pwd: this.data.pwd
        })
        break;
    }
  },
  blur: function(e) {
    var that = this;
    let name = e.currentTarget.dataset.name;
    switch (name) {
      case 'phone':
        time = 0;
        if (e.detail.value){
          phoneRegNum = e.detail.value;
          wx.setStorageSync('phoneRegNum', e.detail.value);
          setTimeout(function(){//异步
            that.setData({
              phoneRegNum: e.detail.value
            })
          },500);              
          // if (!phonereg.test(e.detail.value)) {
          //   wx.showToast({
          //     title: '请输入正确手机号',
          //     icon: 'none',
          //     duration: 2000
          //   })
          //   this.setData({
          //     phoneblur: true
          //   })
          //   return
          // }
        }        
        that.setData({
          phoneblur: false,
          // codestate: true
        })

        if (!phonereg.test(e.detail.value)) {
          that.setData({
            codestate: false
          })
        }else{
          that.setData({
            codestate: true
          })
        }


        break;
      case 'code':
        // if (!this.data.code || !regfun.hasphone.call(this) || !regfun.regphone.call(this)) {
        //   return
        // }
        if (!this.data.code || !regfun.phoneRegs.call(this)) {
          return
        }
        //|| !regfun.regcode.call(this)
        break;
      case 'pwd':
        // if (!this.data.pwd[e.currentTarget.dataset.pwd] || !regfun.regpwd.call(this, e.currentTarget.dataset.pwd)) {
        //   return;
        // }
        this.setData({
          pwdRegNum: e.detail.value
        })    
        break;
    }
  },

  phoneRegs:function(){//手机号验证单独抽离
    var isPhone = true; 
    var phoneRegNum = wx.getStorageSync('phoneRegNum');
    if (!phoneRegNum) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 2000
        })
      isPhone = false; 
      }
    // if (!phonereg.test(this.data.phoneRegNum)) {
    if (!phonereg.test(phoneRegNum)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        phoneblur: true
      })
      isPhone = false; 
    }
    return isPhone;
  },
  focus: function(e) {
    let _this = this;
    let name = e.currentTarget.dataset.name;
    switch (name) {
      case 'phone':
        wx.getStorage({
          key: 'phone',
          success: function(res) {
            _this.setData({
              cachephone: res.data
            })
            console.log('chche', res.data)
          }
        })
        this.setData({
          phoneblur: true
        })
        break;
    }
  },
  changephone: function(e) {
    var that = this;
    time = 0;
    let index = e.currentTarget.dataset.index;
    var phoneRegNum = this.data.cachephone[index];
    setTimeout(function(){
      wx.setStorageSync('phoneRegNum', phoneRegNum);//异步一下
      that.setData({
        codestate: true
      }) 
    },500);
    that.setData({
      phone: this.data.cachephone[index],
      phoneRegNum: phoneRegNum,
      codestate: true
    }) 
  },
  clearphone: function() {
    this.setData({
      phone: '',
      codestate: false
    })
  },
  delphocache: function(e) {
    let index = e.currentTarget.dataset.index;
    this.data.cachephone.splice(index, 1)
    wx.setStorage({
      key: 'phone',
      data: this.data.cachephone
    })
    this.setData({
      cachephone: this.data.cachephone
    })
  },
  regphone: function() {
    // if (!phonereg.test(this.data.phone)) {
    //   wx.showToast({
    //     title: '请输入正确手机号',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    //获取接口返回逻辑
    let res = '0';
    if (res == 1) {
      wx.showToast({
        title: '该手机号已被注册',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  hasphone: function() {
    // if (!this.data.phone) {
    //   wx.showToast({
    //     title: '请输入手机号',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    // return true;
  },
  hascode: function() {
    if (!this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  regcode: function() {
    let _this = this;
    if (!codereg.test(this.data.code)) {
      wx.showToast({
        title: '请输入正确验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //接口
    // if (this.data.code != '1111') {
    //   this.data.codefail++;
    //   this.setData({
    //     codefail: this.data.codefail
    //   })
    //   if (this.data.codefail >= 5) {
    //     wx.getStorage({
    //       key: 'codetime',
    //       complete: function (res) {
    //         if (!res.data) {
    //           let date = new Date(), timestamp = date.getTime() + 10 * 60 * 1000;
    //           wx.setStorage({
    //             key: 'codetime',
    //             data: timestamp
    //           })
    //           wx.showToast({
    //             title: '验证码错误5次，请9分59秒后重试',
    //             icon: 'none',
    //             duration: 2000
    //           })
    //         } else {
    //           let date = new Date(), timestamp = date.getTime(), codetime = res.data,
    //             timespace = (codetime - timestamp) / 1000,
    //             minute = timespace > 0 ? parseInt(timespace / 60) : '',
    //             second = timespace > 0 ? parseInt(timespace - 60 * minute) : '';
    //           if (timespace <= 0) {
    //             _this.setData({
    //               codefail: 0
    //             })
    //           } else {
    //             wx.showToast({
    //               title: '验证码错误5次，请' + minute + '分' + second + '秒后重试',
    //               icon: 'none',
    //               duration: 2000
    //             })
    //           }
    //         }
    //       }
    //     })
    //   } else {
    //     wx.showToast({
    //       title: '验证码错误' + _this.data.codefail + '次',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   }
    //   return false;
    // }
    return true;
  },
  getcode: function() {
    if (this.data.codestate == false){
      return
    }
    if (time > 0) {
      return;
    }
    var app = getApp();
    // if (!this.hasphone()) {
    //   return;
    // }
    if (!this.phoneRegs()) return;
    if (this.data.type == 'register') {
      app.fetch.newData.result({
        API_URL: app.globalData.b2b + 'smp/checkRegister.do?userName=' + this.data.phone,
      }).then(({
        data
      }) => {
        if (data.code == 100) {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          this.codeg()
        }
      })
    } else {
      this.codeg()
    }
  },
  codeg: function() {
    var app = getApp();
    app.fetch.newData.result({
      API_URL: app.globalData.b2b + 'sms/sendSmsCode.do?eventType=' + this.data.type + '&openId=' + app.globalData.openId + '&phoneNo=' + this.data.phone,
    }).then(({
      data
    }) => {
      if (data.msg && data.msg.indexOf('success code:') > -1) {
        rescode = data.msg.replace('success code:', '');
      }
    })

    if (time > 0) {
      return;
    }
    time = 60;
    clearInterval(timer);
    timer = setInterval(() => {
      if (time <= 0) {
        clearInterval(timer);
      } else {
        time--;
        this.setData({
          time: time
        })
        console.log(time, this)
      }
    }, 1000)
  },
  regpwd: function() {
    var isPwd = true;
    if (!pwdreg.test(this.data.pwdRegNum)) {
      wx.showToast({
        title: '密码格式为6-16位的字母+数字',
        icon: 'none',
        duration: 2000
      })
      isPwd = false;
    }
    return isPwd;
  },
  togglepwd: function() {
    this.setData({
      showpwd: !this.data.showpwd
    })
  },
}
module.exports = {
  regfun: regfun
};