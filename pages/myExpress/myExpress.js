const common = require("../../utils/common.js");
const Api = require("../../utils/api.js");
const app = getApp();

Page({
  data: {
    currentTab: '0',
    tabs: [{
        name: "全部"
      },
      {
        name: "待接单"
      },
      {
        name: "待签收"
      }
    ]
  },
  onShow() {
    //初次加载
    this.setData({
      loadingflag: true
    })
    let that = this;
    let jsonData = {
      "object": {
        "pageRow": 0,
        "startPage": 0,
        "object": {
          "orderStatus": that.data.orderStatus
        }
      }
    };
    //  "addrType": '1' //1,2
    console.log(JSON.stringify(jsonData));
    common.ajax(Api.port.queryUserOrderList, jsonData,
      function(res) {
        console.log(res)
        that.setData({
          loadingflag: false
        })
        common.unLogin(res)
        let header = res.header;
        let setcookie = header["Set-Cookie"];
        common.sessionvalid(setcookie, function() {
          if (res.data.errCode == '000000') {
            let list = res.data.object.list;
            console.log(list)
            for (let i = 0; i < list.length; i++) {
              const sendercityName = list[i].senderProvinceCityCountyName.split('-')[1].split('市')[0];
              const receivecityName = list[i].receiverProvinceCityCountyName.split('-')[1].split('市')[0];
              let orderStatus = list[i].orderStatus;
              if (orderStatus == 0) {
                list[i].orderstate = "待接单";
                list[i].testid = "0";
              } else if (orderStatus == 1) {
                list[i].orderstate = "待取件";
                list[i].testid = "0";
              } else if (orderStatus == 2) {
                list[i].orderstate = "未付款";
                list[i].testid = "1";
              } else if (orderStatus == 3) {
                list[i].orderstate = "待发件";
                list[i].testid = "1";
              } else if (orderStatus == 4) {
                list[i].orderstate = "待签收";
                list[i].testid = "1";
              } else if (orderStatus == 5) {
                list[i].orderstate = "已签收";
                list[i].testid = "1";
              } else if (orderStatus == 6) {
                list[i].orderstate = "已取消";
                list[i].testid = "0";
              }
              list[i].sendercityName = sendercityName;
              list[i].receivecityName = receivecityName;
            }
            if (list.length == 0) {
              that.setData({
                noaddress: true,
              })
            } else {
              that.setData({
                noaddress: false,
                list: list,
              })
            }
            that.setData({
              list: list,
            })
            console.log(that.data.list)

          } else {
            wx.showToast({
              title: res.data.errDesc,
              icon: 'none',
              duration: 2000,
            })
          }
        })
      },
      function(res) {
        // my.alert({content: '请求超时'});     
      })
  },
  tab(e) {
    this.setData({
      loadingflag: true
    })
    const id = e.currentTarget.dataset.id;
    const left = 250 * id;
    this.setData({
      left: left,
      currentTab: id,
      list: [],
      noaddress: false
    })

    let that = this;
    if (id == '1') {
      this.setData({
        orderStatus: '0'
      })
    } else if (id == '2') {
      this.setData({
        orderStatus: "4"
      })
    } else if (id == '0') {
      this.setData({
        orderStatus: ''
      })
    }
    //tab查询地址
    let jsonData = {
      "object": {
        "pageRow": 0,
        "startPage": 0,
        "object": {
          "orderStatus": that.data.orderStatus
        }
      }
    };
    //  "addrType": '1' //1,2
    console.log(JSON.stringify(jsonData));
    common.ajax(Api.port.queryUserOrderList, jsonData,
      function(res) {
        that.setData({
          loadingflag: false
        })
        let header = res.header;
        let setcookie = header["Set-Cookie"];
        common.sessionvalid(setcookie, function() {
          if (res.data.errCode == '000000') {
            let list = res.data.object.list;
            console.log(list)
            for (let i = 0; i < list.length; i++) {
              const sendercityName = list[i].senderProvinceCityCountyName.split('-')[1].split('市')[0];
              const receivecityName = list[i].receiverProvinceCityCountyName.split('-')[1].split('市')[0];
              let orderStatus = list[i].orderStatus;
              if (orderStatus == 0) {
                list[i].orderstate = "待接单";
                list[i].testid = "0";
              } else if (orderStatus == 1) {
                list[i].orderstate = "待取件";
                list[i].testid = "0";
              } else if (orderStatus == 2) {
                list[i].orderstate = "未付款";
                list[i].testid = "1";
              } else if (orderStatus == 3) {
                list[i].orderstate = "待发件";
                list[i].testid = "1";
              } else if (orderStatus == 4) {
                list[i].orderstate = "待签收";
                list[i].testid = "1";
              } else if (orderStatus == 5) {
                list[i].orderstate = "已签收";
                list[i].testid = "1";
              } else if (orderStatus == 6) {
                list[i].orderstate = "已取消";
                list[i].testid = "0";
              }
              list[i].sendercityName = sendercityName;
              list[i].receivecityName = receivecityName;
            }
            if (list.length == 0) {
              that.setData({
                noaddress: true,
              })
            } else {
              that.setData({
                noaddress: false,
                list: list,
              })
            }
            that.setData({
              list: list,
            })
            console.log(that.data.list)

          } else {
            wx.showToast({
              title: res.data.errDesc,
              icon: 'none',
              duration: 2000,
            })
          }
        })
      },
      function(res) {
        // my.alert({content: '请求超时'});     
      })
  },
  goDetail(e) {
    // console.log(e)
    //id为0是进入没有物流信息快递详情页，id为1进入有物流信息的快递详情页
    // console.log(e.currentTarget.id);
    let jumpid = e.currentTarget.id;
    let myExpressData = this.data.list[e.currentTarget.dataset.id];
    if (jumpid == "1") {
      wx.setStorage({
        key: 'myExpressData',
        data: {
          myExpressData: myExpressData,
        },
        success: function() {
          wx.navigateTo({
            url: '../orderDetail/orderDetail'
          });
        }
      });
    } else if (jumpid == "0") {
      


      wx.setStorage({
        key: 'myExpressData',
        data: {
          myExpressData: myExpressData,
        },
        success: function() {
          wx.navigateTo({
            url: '../removeOrder/removeOrder'
          });
        }
      });
    }

  }

});