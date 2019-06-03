const regular = require('../../utils/regular.js')
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    disabled: true,
    status: '发送验证码',
    countdown: '10',
    clickTag: 0,
    active: "",
  },
  checkoutPhone: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
    if (e.detail.value.length == '11' && regular.isValid("Phone", this.data.inputValue)) {
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
  sendCode() {
    this.setData({
      disabled: true
    });
    let is_Valid = regular.isValid("Phone", this.data.inputValue),
      vertiurl = "../verification/verification?phonenum=" + this.data.inputValue;
    if (is_Valid) {
      wx.showLoading({
        title: '发送中',
      });
      wx.request({
        url: api.port.createVerificationCode,
        data: JSON.stringify({
          "object": this.data.inputValue
        }),
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          // wx.hideLoading();
          this.setData({
            disabled: false
          });
          console.log(res)
          if (res.data.errCode == api.ERROR || res.data.errCode == '50026') {
            wx.showToast({
              title: '发送成功',
              icon: 'none',
              duration: 2000,
              success: () => {
                wx.navigateTo({
                  url: vertiurl
                });
              }
            })
          } else {
            wx.showToast({
              title: res.data.errDesc,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: (res) => {
          // wx.hideLoading();
          this.setData({
            disabled: false
          });
          wx.showToast({
            title: '服务器错误，验证码发送失败',
            icon: 'none',
            duration: 2000
          })
        },
        complete() {
          setTimeout(function() {
            wx.hideLoading();
          }, 2000)

        }
      })
    }
  }
})