const common = require("../../utils/common.js");
const api = require('../../utils/api.js')
const app = getApp();

Page({
  data: {
    hintshow: false
  },
  onLoad(res){
    console.log("realnameuuid"+res.uuid)
    if (res.uuid) {
      let sendurl = "../sendExpress/sendExpress?uuid=" + res.uuid;
      this.setData({
        sendurl: sendurl
      })
    }
    let realName = res.realName;
    let idCardNo = res.idCardNo;
    if (realName && idCardNo){
      this.setData({
        Name: res.realName,
        idno: res.idCardNo,
        checkactive1: true,
        checkactive: true,
        inputdisadle:true
      })
    }

  },
  onnameInput(e) {
    if (e.detail.value) {
      this.setData({
        name: true,
        Name: e.detail.value
      });
      console.log(this.data.id)
      if (this.data.id) {
        this.setData({
          checkactive: true
        });
      }
    } else {
      this.setData({
        name: false,
        checkactive: false
      });
    }
    console.log(this.data.name)
  },
  onidInput(e) {
    let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
    if (e.detail.value.length == '0') {
      this.setData({
        hintshow: false,
      });
    } else if (reg.test(e.detail.value)) {
      console.log(1)
      this.setData({
        id: true,
        hintshow: false,
        idno: e.detail.value,
      });
      if (this.data.name) {
        this.setData({
          checkactive: true
        });
      }
      console.log(this.data.idno)
    } else {
      if (e.detail.value.length == '15' || e.detail.value.length == '18') {
        this.setData({
          hintshow: true,
          id: false,
          checkactive: false
        });
      } else {
        this.setData({
          hintshow: false,
          id: false,
          checkactive: false
        });
      }

      console.log(this.data.checkactive)
    }
  },
  checkIdcard() {
    let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
    if (reg.test(this.data.idno)) {
      this.setData({
        hintshow: false
      });
    } else {
      this.setData({
        hintshow: true
      });
    }
    //验证
    let clickTag = 0;
    if (clickTag === 0) {
      clickTag = 1;
      setTimeout(function() {
        clickTag = 0
      }, 5000);
      // 验证
      let that = this;
      let jsondata = {
        "object": {
          "idCardNo": that.data.idno,
          "realName": that.data.Name
        }
      }
      console.log(that.data.idno);
      this.setData({
        loadingflag: true
      })

      common.ajax(api.port.validateUserIdCard, jsondata,
        function(res) {
          that.setData({
            loadingflag: false
          })
          let header = res.header;
          let setcookie = header["Set-Cookie"];
          common.sessionvalid(setcookie, function() {
            if (res.data.errCode == '000000') {
              if (res.data.object) {
                that.setData({
                  alertshow: true,
                  alert: {
                    image: true,
                    text: '验证成功'
                  }
                })
                wx.setStorage({
                  key: 'idCard',
                  data: {
                    idCard: true,
                  }
                });
                wx.getStorage({
                  key: 'currentnav',
                  success: function(res) {
                    setTimeout(function() {
                      wx.navigateBack({
                        delta: 2
                      })
                      if (res.data.currentnav == '../sendExpress/sendExpress') {
                        wx.navigateTo({
                          url: '../sendExpress/sendExpress'
                        });
                      } else if (res.data.currentnav.indexOf('=')) {
                        wx.setStorage({
                          key: 'currentnav',
                          data: {
                            currentnav: '../sendExpress/sendExpress',
                          }
                        });
                        wx.navigateTo({ url: that.data.sendurl });
                      }
                    }, 1000)
                  }
                });
              }
               else {
                that.setData({
                  alertshow: true,
                  alert: {
                    image: false,
                    text: '姓名和身份证号码不一致'
                  }
                })
              }
            } 
            else {
              that.setData({
                alertshow: true,
                alert: {
                  image: false,
                  text: res.data.errDesc
                }
              })
            }
          }
          )
          if (that.data.alertshow) {
            setTimeout(function() {
              that.setData({
                alertshow: false,
              })
            }, 2000)
          }

        },
        function(res) {
          console.log(res.errorMessage);
        })
    } else {
      alert('请勿频繁点击！');
    }
  }

});