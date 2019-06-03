const common = require("../../utils/common.js");
const Api = require("../../utils/api.js");
const app = getApp();
Page({
  data: {
    courierdata: [],
    condition: false,
    share:false,
    courierphoto: 'data:image/png;base64,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',
  },
  onLoad: function(options) {
    let that = this;
    console.log("optionsorderUuid")
    console.log(options.orderUuid)
    let orderUuid = options.orderUuid;//从微信推送点击进来获取订单号
    if (orderUuid) {
      this.setData({
        share:true,
      })
      let selectByUuidJsonData = { "object": orderUuid }
      common.ajax(Api.port.selectByUuid, selectByUuidJsonData,
      function (res) {
        if (res.data.errCode == '000000') {
          let datas = res.data.object;
          console.log("datas")
          console.log(datas)
          that.findCourierByUuid(datas);
        }
      },
      function (res) {
      })
    }else{
      wx.getStorage({
        key: 'myExpressData',
        success: function (res) {
          const datas = res.data.myExpressData;
          console.log(datas);
          //获取快递员信息
          that.findCourierByUuid(datas);
        }
      })
    }

    //获取openid
    let openidData = wx.getStorageSync('openid');
    if (openidData) {
      app.globalData.openid = openidData;//设置全局变量openid
    } else {
      wx.login({
        success(res) {
          if (res.code) {
            console.log(res.code)
            let jscode = res.code;
            // 通过js_code换取openid
            let jscodeJsonData = { "object": jscode }
            common.ajax(Api.port.createOpenid, jscodeJsonData,
              function (res) {
                let header = res.header;
                let setcookie = header["Set-Cookie"];
                common.sessionvalid(setcookie, function () {
                  if (res.data.errCode == '000000') {
                    let openid = res.data.object;
                    wx.setStorage({
                      key: 'openid',
                      data: openid,
                    });
                    app.globalData.openid = openid;//设置全局变量openid
                    console.log("app.globalData.openid" + app.globalData.openid)
                  }
                })
              },
              function (res) {
              })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  findCourierByUuid(datas){
    let that=this;
    if (datas){
      let courierid = datas.courierUuid;
      let jsonData = {
        "object": courierid
      };
      common.ajax(Api.port.findCourierByUuid, jsonData,
      function (res) {
        console.log(res)
        let test = res.data.object;

        const senderProvinceCityCountyName = datas.senderProvinceCityCountyName.split('-').join('');
        const sendAddress = senderProvinceCityCountyName + datas.senderAddressDetail;
        const receiverProvinceCityCountyName = datas.receiverProvinceCityCountyName.split('-').join('');
        const receiveAddress = receiverProvinceCityCountyName + datas.receiverAddressDetail;
        datas.senderProvinceCityCountyNameall = sendAddress;
        datas.receiverProvinceCityCountyNameall = receiveAddress;
        if (datas.goodsType == '0') {
          datas.goodsType = datas.goodsRemark;
        } else if (datas.goodsType == '1') {
          datas.goodsType = '日用品';
        } else if (datas.goodsType == '2') {
          datas.goodsType = '数码产品';
        } else if (datas.goodsType == '3') {
          datas.goodsType = '衣物';
        } else if (datas.goodsType == '4') {
          datas.goodsType = '食物';
        } else if (datas.goodsType == '5') {
          datas.goodsType = '文件';
        }
        if (datas.orderStatus == '0') {
          datas.orderstate = '待接单';
        } else if (datas.orderStatus == '1') {
          datas.orderstate = '待取件';
        } else if (datas.orderStatus == '2') {
          datas.orderstate = '未付款';
        } else if (datas.orderStatus == '3') {
          datas.orderstate = '待发件';
        } else if (datas.orderStatus == '4') {
          datas.orderstate = '已发件';
        } else if (datas.orderStatus == '5') {
          datas.orderstate = '已签收';
        } else if (datas.orderStatus == '6') {
          datas.orderstate = '已取消';
        }

        if (datas.bookedFrom != null) {
          datas.senddate = datas.bookedFrom.split(" ")[0];
          datas.starttime = datas.bookedFrom.split(" ")[1];
          let test = datas.starttime.split(":")[0] + ":" + datas.starttime.split(":")[1];
          datas.starttime = test;
          datas.endtime = datas.bookedTo.split(" ")[1];
          let test1 = datas.endtime.split(":")[0] + ":" + datas.endtime.split(":")[1];
          datas.endtime = test1;
        }
        for (let key in datas) {
          if (datas[key] == null) {
            datas[key] = '无'
          }
        }
        that.setData({
          courierdata: test,
          datas: datas
        })

      },
      function (res) {
        wx.showToast({
          icon: 'none',
          title: res.errMsg,
          duration: 2000,
        });
      })
    }
  },
  cancelDetail(e) {
    let formId = e.detail.formId
    this.saveformid(formId);
    this.setData({
      condition: !this.data.condition
    })
  },
  courierphone() {
    wx.makePhoneCall({
      phoneNumber: this.data.courierdata.phone
    })
  },
  cancel() {
    this.setData({
      condition: !this.data.condition
    })
  },
  check1() {
    //不想发了
    var cancelreason = '不想发了';
    let jsonData = {
      "object": {
        "uuid": this.data.datas.uuid,
        "orderCancelRemark": cancelreason
      }
    };
    console.log(JSON.stringify(jsonData));
    common.ajax(Api.port.userCancelOrder, jsonData,
      function(res) {
        let header = res.header;
        let setcookie = header["Set-Cookie"];
        common.sessionvalid(setcookie, function() {
          if (res.data.errCode == '000000') {
            wx.showToast({
              icon: 'none',
              title: '取消成功',
              duration: 2000,
              success: () => {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              },
            });
          } else {

            wx.showToast({
              icon: 'none',
              title: '取消成功',
              duration: 2000,
              success: () => {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              },
            });
          }
        })
      },
      function(res) {
        wx.showToast({
          icon: 'none',
          title: res.errMsg,
          duration: 2000,
        });
      })

  },
  check2() {
    //其他原因
    var cancelreason = '其他原因'
    let jsonData = {
      "object": {
        "uuid": this.data.datas.uuid,
        "orderCancelRemark": cancelreason
      }
    };
    console.log(JSON.stringify(jsonData));
    common.ajax(Api.port.userCancelOrder, jsonData,
      function(res) {
        let header = res.header;
        let setcookie = header["Set-Cookie"];
        common.sessionvalid(setcookie, function() {
          if (res.data.errCode == '000000') {
            wx.showToast({
              icon: 'none',
              title: '取消成功',
              duration: 2000,
              success: () => {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              },
            });
          } else {
            wx.showToast({
              icon: 'none',
              title: '取消成功',
              duration: 2000,
              success: () => {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              },
            });
          }
        })
      },
      function(res) {
        wx.showToast({
          icon: 'none',
          title: res.errMsg,
          duration: 2000,
        });
      })
  },
  imgerror(){
    let data = this.data.courierdata;
    data.photo = this.data.courierphoto
    this.setData({
      courierdata: data
    })
  },
  skipHome() {
    wx.reLaunch({
      url: '../home/home',
    })
  },
  skipMy() {
    wx.reLaunch({
      url: '../my/my',
    })
  },
  saveformid(formId) {
    //保存fromid
    let openid = app.globalData.openid;
    console.log("openid" + openid)
    let userUuid = wx.getStorageSync('userUuid');
    if (formId == "the formId is a mock one") {
      return
    }
    if (typeof (openid) == 'undefined' || openid == '') {
      return
    }
    let formidJsonData = { "object": { "formid": formId, "openid": openid, "userUuid": userUuid } }
    console.log('sendexpress-formidJsonData-' + JSON.stringify(formidJsonData))
    common.ajax(Api.port.createFromId, formidJsonData,
      function (res) {
        if (res.data.errCode == '000000') {
          console.log('formid存储成功')
          console.log(res.data)
        } else {
          console.log('formid失败')
          console.log(res.data.object)
        }
      },
      function (res) {
      })
  },
})