const common = require("../../utils/common.js");
const Api = require("../../utils/api.js");
const app = getApp();

Page({
  data: {
    currentTab: '0',
    tabs: [{
      name: "运单详情"
    },
    {
      name: "物流详情"
    }
    ],
    tabs2: [{
      name: "全部"
    },
    {
      name: "待接单"
    },
    {
      name: "已签收"
    }
    ],
    companyimg: '../../image/logisticno.png',
    copyimg: '../../image/copy.png',
    share: false,
    navbar: false
  },
  onLoad(query) {
    console.log(JSON.stringify(query))
    let that = this;
    that.setData({
      share: false,
      currentTab: 0
    })
    if (query.uuid) {
      console.log(query.uuid)
      that.setData({
        share: true,   //点击别人分享的详情页面，详情不包括tab
        currentTab: 1
      })
      let jsondata = {
        "object": query.uuid
      }

      wx.request({
        url: Api.api.url + '/route/sharePage',
        header: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        data: JSON.stringify(jsondata),
        dataType: 'json',
        success: function (res) {
          if (res.data.errCode == '000000') {
            let logisticslist = res.data.object.routes;
            let lastindex = res.data.object.routes.length - 1;
            let logisticsCompanyUuid = res.data.object.logisticsCompanyUuid;
            that.logisticsCompanyIcon(logisticsCompanyUuid, that)
            let orderStateText = that.orderState(res.data.object);
            res.data.object.orderstate = orderStateText;
            that.setData({
              logisticslist: logisticslist,
              lastindex: lastindex,
              detaildata: res.data.object
            })
            that.logisticsCompanyIcon(logisticsCompanyUuid, that)
            console.log("detaildata+++++" + JSON.stringify(that.data.detaildata))
          } else {
            wx.showToast({
              title: '网络错误',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            icon: 'none',
            title: res.errorMessage,
            duration: 2000,
          });
        }
      });

    } else {
      let orderUuid = query.orderUuid;//从微信推送点击进来获取订单号
      if (orderUuid) {
        this.setData({
          navbar: true,
        })
        let selectByUuidJsonData = { "object": orderUuid }
        common.ajax(Api.port.selectByUuid, selectByUuidJsonData,
          function (res) {
            if (res.data.errCode == '000000') {
              let datas = res.data.object;
              const sendercityName = datas.senderProvinceCityCountyName.split('-')[1].split('市')[0];
              const receivecityName = datas.receiverProvinceCityCountyName.split('-')[1].split('市')[0];
              datas.sendercityName = sendercityName;
              datas.receivecityName = receivecityName
              console.log("datas")
              console.log(datas)
              that.findCourierByUuid(datas);
              console.log('share'+that.data.share)
              //分享按钮
              that.showShareBtn(datas.orderStatus, that)
            }
          },
          function (res) {
          })
      } else {
        wx.getStorage({
          key: 'myExpressData',
          success: function (res) {
            console.log('myExpressData')
            console.log(res.data)
            const datas = res.data.myExpressData;
            that.findCourierByUuid(datas);
            //分享按钮
            that.showShareBtn(res.data.myExpressData.orderStatus, that)
          }
        });
      }
    }

    // 物流详情
  },

  findCourierByUuid(datas) {
    let that=this;
    let status = datas.orderStatus;
    if (status == '0') {
      that.setData({
        cancelflag: true
      })
    } else {
      that.setData({
        cancelflag: false
      })
    }
    console.log(that.data.cancelflag)
    const senderProvinceCityCountyName = datas.senderProvinceCityCountyName.split('-').join('');
    const sendAddress = senderProvinceCityCountyName + datas.senderAddressDetail;
    const receiverProvinceCityCountyName = datas.receiverProvinceCityCountyName.split('-').join('');
    const receiveAddress = receiverProvinceCityCountyName + datas.receiverAddressDetail;
    datas.senderProvinceCityCountyNameall = sendAddress;
    datas.receiverProvinceCityCountyNameall = receiveAddress;
    let logisticsCompanyUuid = datas.logisticsCompanyUuid
    that.setData({
      logisticsNo: datas.logisticsNo,
      uuid: datas.uuid
    })
    that.logisticsCompanyIcon(logisticsCompanyUuid, that)

    for (let key in datas) {
      // console.log(1)
      if (datas[key] == null) {
        datas[key] = '无'
      }
    }
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
    let orderStateText = that.orderState(datas);
    datas.orderstate = orderStateText;
    if (datas.payType == '0') {
      datas.payType = '支付宝支付';
    } else if (datas.payType == '1') {
      datas.payType = '快递员代付';
    } else if (datas.payType == '2') {
      datas.payType = '支付宝我的快递支付';
    }
    console.log(datas)
    that.setData({
      detaildata: datas
    })
    console.log(that.data.logisticsNo)
    console.log("ceshi")
    console.log(that.data.detaildata);

    // that.setData({
    //     logisticsNo:'1093775419'
    //   })
    if (that.data.logisticsNo == null) {
      that.setData({
        show: true
      })
    } else {
      that.setData({
        show: false
      })
      let jsonData = {
        "object": that.data.logisticsNo
      };
    console.log('111111111111')
      common.ajax(Api.port.getByLogisticsNo, jsonData,
        function (res) {
          console.log("test")
          console.log(res);
          console.log(res.header)
          let headers = res.header;
          let setcookie = headers["Set-Cookie"];
          common.sessionvalid(setcookie, function () {
            if (res.data.errCode == '000000') {
              let logisticslist = res.data.object.routes;
              let lastindex = res.data.object.routes.length - 1;
              that.setData({
                logisticslist: logisticslist,
                lastindex: lastindex
              })
              console.log(that.data.lastindex)
            } else {
              common.unLogin(res);
            }
          })
        },
        function (res) {
          console.log(res);
          wx.showToast({
            icon: 'none',
            title: res.errorMessage,
            duration: 2000,
          });
        })

    }
  },
  tab(e) {
    console.log(e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id;
    const left = 375 * id;
    this.setData({
      left: left,
      currentTab: id
    })
  },
  clickCopy(e) {
    let that = this;
    wx.setClipboardData({
      data: that.data.detaildata.logisticsNo,
      success(res) {
        wx.showToast({
          title: '物流单号复制成功',
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快递详情',
      path: 'pages/orderDetail/orderDetail?uuid=' + this.data.uuid
    }
  },
  logisticsCompanyIcon(logisticsCompanyUuid, that) {
    if (logisticsCompanyUuid == 'deppon') {
      that.setData({
        companyimg: '../../image/deppon.png',
      })
    } else if (logisticsCompanyUuid == 'zto') {
      that.setData({
        companyimg: '../../image/zto.png',
      })
    } else if (logisticsCompanyUuid == 'zjs') {
      that.setData({
        companyimg: '../../image/zhaijisong.png',
      })
    }
  },
  // 订单状态
  orderState(datas) {
    if (datas.orderStatus == '0') {
      return '待接单';
    } else if (datas.orderStatus == '1') {
      return '待取件';
    } else if (datas.orderStatus == '2') {
      return '未付款';
    } else if (datas.orderStatus == '3') {
      return '待发件';
    } else if (datas.orderStatus == '4') {
      return '待签收';
    } else if (datas.orderStatus == '5') {
      return '已签收';
    } else if (datas.orderStatus == '6') {
      return '已取消';
    }
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
  // 判断分享按钮显示
  showShareBtn(state, that) {
    console.log(state)

    if (state != 0 && state != 1 && state != 2) {
      that.setData({
        showShare: true
      })
    } else {
      that.setData({
        showShare: false
      })
    }
    console.log(this.data.showShare)
  }
});