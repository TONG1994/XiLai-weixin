const regular = require('../../utils/regular.js')
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    status: '注册／登录',
    countdown: '(60)',
    phonenum: '',
    active: '',
    clickTag: 0,
    disabled: true
  },
  checkoutVerificationCode: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
    if (e.detail.value.length == '4') {
      this.setData({
        active: 'active',
        inputValue: e.detail.value,
        disabled: false
      });
    } else {
      this.setData({
        active: '',
        disabled: true
      });
    }
  },
  login() {
    let that = this;
    if (this.data.clickTag === 0) {
      this.setData({
        clickTag: 1
      })
      setTimeout(function() {
        that.setData({
          clickTag: 0
        })
      }, 3000);
      // 验证
      wx.showLoading({
        title: '登录中',
      });
      wx.request({
        url: api.port.userLogin,
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify({
          "object": {
            "telephone": this.data.phonenum,
            "vercode": this.data.inputValue
          },
          "term": "0"
        }),
        dataType: 'json',
        success: function(res) {
          wx.hideLoading();
          if (res.data.errCode == api.ERROR) {
            console.log(res)
            let data = res.data.object;
            if (data.staffInfo) {
              if (data.staffInfo.idCard != '' || data.staffInfo.idCard != undefined || data.staffInfo.idCard != null) {
                var loginidcard = data.staffInfo.idCard;
              } else {
                var loginidcard = null;
              }
            }
            that.setData({
              loginidcard: loginidcard
            })
            //登录后设置cookie保持登录状态
            wx.setStorage({
              key: 'cookie',
              data: {
                cookie: `SESSION=${data.sessionId};SSOTOKEN=${data.ssoToken}`,
                userName: that.data.phonenum,
                // idCard:loginidcard
              },
              success: function() {
                wx.setStorage({
                  key: 'idCard',
                  data: {
                    idCard: loginidcard,
                    // idCard:loginidcard
                  },
                  success: function() {
                    //登录成功后判断要跳转到哪个页面
                    wx.setStorage({
                      key: 'userUuid',
                      data: data.staffInfo.userUuid,
                      success: function () {
                        wx.getStorage({
                          key: 'currentnav',
                          success: function(res) {
                            console.log(res.data);
                            //如果有存currentnav，说明从非登录位置进入login页面
                            wx.showToast({
                              type: 'none',
                              content: '登录成功',
                              duration: 2000,
                              success: () => {
                                wx.switchTab({
                                  url: '../home/home'
                                })
                                if (res.data.currentnav == '../login/login') {
                                  // 如果是从注册／登录进去的，跳转到my 
                                  wx.switchTab({
                                    url: '../my/my'
                                  })
                                } else if (res.data.currentnav == '../verified/verified') {
                                  // 如果是从认证页面进去后登录的，跳转到设置已认证页面
                                  console.log(that.data.loginidcard);
                                  if (that.data.loginidcard == null) {
                                    setTimeout(function() {
                                      wx.navigateTo({
                                        url: '../verified/verified'
                                      });
                                    }, 1000)
                                  } else {
                                    wx.navigateTo({
                                      url: '../home/home'
                                    })
                                  }
                                } else if (res.data.currentnav.indexOf('../sendExpress/sendExpress') != -1) {//是否扫码都可以走send
                                  // 首页登录，点击send,如果未认证跳转到认证页面,认证页面认证成功后调到send页面

                                  if (res.data.currentnav.indexOf('=') != -1) {//从扫码登录
                                    console.log('扫码登录')
                                    var uuid = res.data.currentnav.split('=')[1];
                                    var sendurl = "../sendExpress/sendExpress?uuid=" + uuid;
                                    var certiurl = "../verified/verified?uuid=" + uuid;
                                    if (that.data.loginidcard == null) {
                                      console.log('扫码后发现未认证')
                                      setTimeout(function () {
                                        wx.navigateTo({ url: certiurl });
                                      }, 1000)

                                    } else {
                                      console.log('扫码后发现已认证')
                                      setTimeout(function () {
                                        wx.navigateTo({ url: sendurl });
                                      }, 1000)

                                    }
                                  
                                  }else{
                                    if (that.data.loginidcard == null) {
                                      console.log('cardvalidfail')
                                      setTimeout(function () {
                                        wx.navigateTo({
                                          url: '../verified/verified'
                                        });
                                      }, 1000)

                                    } else {
                                      console.log('CardValidtrue')
                                      setTimeout(function () {
                                        wx.navigateTo({
                                          url: '../sendExpress/sendExpress'
                                        });
                                      }, 1000)

                                    }
                                  }
                                

                                } else {
                                  setTimeout(function() {
                                    wx.navigateTo({
                                      url: res.data.currentnav
                                    });
                                  }, 1000)

                                }
                              },
                            });
                          },
                          fail: function(res) {
                            wx.switchTab({
                              url: '../home/home',
                            })
                          }

                        });
                      }
                    });
                  }
                });
              }
            });

          } else {
            // wx.alert({ content: res.data.errDesc });
            wx.showToast({
              // type: 'none',
              icon: 'none',
              title: res.data.errDesc,
              duration: 2000,
            })

          }
        },

        fail: function(res) {
          console.log("fail "+res.data)
          wx.showToast({
            title: '网络异常，登录失败',
            icon: 'none',
            duration: 2000
          })
        }
      });
    } else {
      wx.showToast({
        title: '请勿频繁点击！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      phonenum: options.phonenum,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var totalSecond = 59;
    var interval = setInterval(function() {
      // 秒数  
      var second = totalSecond;
      this.setData({
        countdown: `(${totalSecond})`,
        countclick: false
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.setData({
          countdown: '重新发送',
          countclick: true
        });
      }
    }.bind(this), 1000);
  },
  counts() {
    console.log('click重新发送')
    this.setData({
      countdown: '(60)',
      countclick: false
    });
    var totalSecond = 59;
    var interval = setInterval(function() {
      // 秒数  
      var second = totalSecond;
      this.setData({
        countdown: `(${totalSecond})`,
        countclick: false
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.setData({
          countdown: '重新发送',
          countclick: true
        });
      }
    }.bind(this), 1000);

    // 请求验证码接口
    let that = this;
    if (this.data.clickTag === 0) {
      this.setData({
        clickTag: 1
      })
      setTimeout(function() {
        that.setData({
          clickTag: 0
        })
      }, 3000);
      // 验证
      wx.request({
        url: api.port.createVerificationCode,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        data: JSON.stringify({
          "object": that.data.phonenum
        }),
        dataType: 'json',
        success: function(res) {
          console.log(res.data)
          console.log(res.data.errCode)
          if (res.data.errCode == '000000') {
            console.log('重新发送成功')
          } else {
            wx.showToast({
              title: res.data.errDesc,
              icon: "none",
              duration: 2000
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '服务器错误，验证码发送失败',
            icon: "none",
            duration: 2000
          })
          console.log(res);
        }
      });

    } else {
      wx.showToast({
        title: '请勿频繁点击！',
        icon: "none",
        duration: 2000
      })
    }
  },
  rule() {
    wx.navigateTo({
      url: '../rule/rule'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
})