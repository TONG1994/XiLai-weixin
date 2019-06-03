const common = require("../../utils/common.js");
const Api = require("../../utils/api.js");
const app = getApp();

Page({
  data: {
    checkStatus: 'false',
    clickTag: 0,
    ruleclick: true,
    condition: false,
    condition1: false,
    condition2: false,
    condition3: false,
    condition4: false,
    newtypeflag:1,//选择物品类型
    inputshow:false,//填写物品类型input隐藏
    goodsinputvalue: '',
    arrowFlag: false, 
    showDialog: false,
    isNeedRefresh: true,
    isNeedSendAddress: true,
    todayhour: "",
    itemtypes: [],
    itemtype: "日用品",
    newitemtype: "日用品",
    itemweights: [],
    weights: "0.5",
    hours: [],
    date: "",
    hour: "",
    data: "",
    hour1: "",
    hour2: "",
    data1: "",
    todaydate: "",
    tomorrowdate: "",
    aftertomorrowdate: "",
    typeid: "1",
    hourid: "",
    usercheck: false,
    fromAddressEnable: true,
    destAddressEnable: true,
    servicesStation: {},
    servereStationList: [],
    flag: false,
    showorgName: true,//显示选择服务站,
    isAlipay: '0',//是否微信扫码下单,
    fromTemp:''
  },
  onLoad(query) {
    // 页面加载,获取快递员信息
    console.log("sendexpressuuid" + query.uuid)
    //  my.alert({
    //   content:query.uuid
    // })
    let that = this;
    let uuid = query.uuid;
    if (uuid){
      that.setData({
        uuid: uuid
      })
    }
    if (uuid) {
      let jsonData = {
        "object": uuid
      }
      that.setData({
        isAlipay: '1',
      })

      common.ajax(Api.port.getByCourierUuid, jsonData,
        function (res) {
          let header = res.header;
          let setcookie = header["Set-Cookie"];
          common.sessionvalid(setcookie, function () {
            if (res.data.errCode == '000000') {
              if (res.data.object != 2) {
                that.setData({
                  loadingflag: true
                })
                //获取快递员信息
                common.ajax(Api.port.findCourierByUuid, jsonData,
                  function (res) {
                    let header = res.header;
                    let setcookie = header["Set-Cookie"];
                    common.sessionvalid(setcookie, function () {
                      that.setData({
                        loadingflag: false
                      })
                      if (res.data.errCode == '000000') {
                        let courierdata = res.data.object;
                        if (courierdata.holidayFlag == 0) {  //快递员上班状态
                          if (courierdata.photo == '') {
                            courierdata.photo = '../../image/courierimage.png'
                          }
                          let orgBaseInfoList = []; //如果有快递员信息，自动显示快递员服务站
                          let serviceItem = {}
                          serviceItem.orgUuid = courierdata.orgUuid;
                          serviceItem.orgName = courierdata.orgName;
                          serviceItem.orgNo = courierdata.orgNo;
                          orgBaseInfoList[0] = serviceItem;
                          that.setData({
                            flag: true,
                            courierdata: courierdata,
                            phone: courierdata.phone,
                            isAlipay: '1',
                            tipfromhint: false,
                            selectOrgName: courierdata.orgName,
                            orgBaseInfoList: orgBaseInfoList,
                            showorgName: false,
                          })
                        } else {
                          that.setData({
                            flag: false,
                            isAlipay: '0',
                            showorgName: true,
                          })

                          //如果快递员休假，则走正常下单流程需要调用senderAddressCheck
                          that.senderAddressCheck();
                        }
                      } else {
                        common.unLogin(res);
                        that.setData({
                          isAlipay: '0',
                        })
                        that.senderAddressCheck();
                      }
                    })
                  },
                  function (res) {
                    that.setData({
                      loadingflag: false,
                      isAlipay: '0',
                    })
                    that.senderAddressCheck();
                  })
              } else {
                that.setData({
                  isAlipay: '0',
                })
                //如果服务站禁用，则走正常下单流程需要调用senderAddressCheck
                that.senderAddressCheck();
              }
            } else {
              common.unLogin(res);
              that.setData({
                isAlipay: '0',
              })
              //如果快递员信息获取失败，则走正常下单流程需要调用senderAddressCheck
              that.senderAddressCheck();
            }
          })
        },
        function (res) {
          that.setData({
            isAlipay: '0',
          })
          that.senderAddressCheck();
        })

    } else {
      that.setData({
        isAlipay: '0',
      })
    }

    let openidData = wx.getStorageSync('openid');
    //获取openid
    if (openidData) {
      console.log(1)
      app.globalData.openid = openidData;//设置全局变量openid
    } else {
      console.log(2)
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
  imgerror() {
    let data = this.data.courierdata;
    data.photo = '../../image/courierimage.png'
    this.setData({
      courierdata: data
    })
  },
  //检测物品类型列表
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      data: this.data.itemtypes[val].type,
      usercheck: true
    })

  },
  //检测物品重量列表
  bindChange1: function (e) {
    const val = e.detail.value
    this.setData({
      data: this.data.itemweights[val],
      usercheck: true
    })
  },
  onChange() {
    if (this.data.checkStatus == 'false') {
      this.setData({
        checkStatus: 'true',
        agreementStatus: '1'
      })
    } else {
      this.setData({
        checkStatus: 'false',
        agreementStatus: '0'
      })
    }
  },
  onShow() {
    //点击 用户协议及隐私政策，不执行任何动作
    console.log("this.data.isNeedRefresh " + this.data.isNeedRefresh)
    if (!this.data.isNeedRefresh) {
      return;
    }
    this.sendData();
    this.setData({
      ruleclick: true
    })
    //收件地址验证需要
    this.senderAddressCheck();
    this.receiverAddressCheck();
  },
  senderAddressCheck(){
    let that=this;
    wx.getStorage({
      key: 'fromAddress',
      success: function (res) {
        if (res.data) {
          const from = res.data.fromAddress;
          that.setData({
            fromTemp: from
          })
          const proviceCityRegionTxt = from.proviceCityRegionTxt.split('-').join('');
          const fromaddressDetail = proviceCityRegionTxt + from.addrDetail;
          from.fromaddressDetail = fromaddressDetail;
          that.setData({
            fromhint: false,
            fromAddress: from,
          })

          //寄数据
          let senderLocation = from.longitude + "," + from.latitude;
          // console.log(senderLocation)
          console.log(that.data.isAlipay)
          if (that.data.isAlipay == '1') {  //扫码下单不需判断寄件地址是否在服务站范围内
            let senderName = from.name,
              senderPhone = from.phone,
              senderProvinceCityCountyCode = from.proviceCityRegion,
              senderProvinceCityCountyName = from.proviceCityRegionTxt,
              senderAddressDetail = from.addrDetail
            that.setData({
              jsonsenddata: {
                senderLocation: senderLocation,
                senderName: senderName,
                senderPhone: senderPhone,
                senderProvinceCityCountyCode: senderProvinceCityCountyCode,
                senderProvinceCityCountyName: senderProvinceCityCountyName,
                senderAddressDetail: senderAddressDetail
              }
            })
          } else {

            //验证地址是否在3公里范围内
            let addressJson = {};
            addressJson.longitude = from.longitude;
            addressJson.latitude = from.latitude;
            addressJson.addrDetail = from.fromaddressDetail;
            addressJson.cityCode = from.proviceCityRegion.split('-')[1];
            addressJson.isAlipay = "0"
            let addrressJsonData = {
              "object": addressJson
            };
            console.log("fromAddress " + JSON.stringify(addrressJsonData));
            common.ajax(Api.port.senderAddressCheck, addrressJsonData,
              function (res) {
                console.log("fromAddress " + JSON.stringify(res.data));
                let header = res.header;
                let setcookie = header["Set-Cookie"];
                common.sessionvalid(setcookie, function () {
                  if (res.data.errCode == '000000') {
                    let myExpressData = res.data.object;
                    console.log("checkSendAddress " + myExpressData.length)
                    if (myExpressData.length > 0) {
                      that.setData({
                        fromAddressEnable: true,
                        servereStationList: myExpressData
                      })
                      if (that.data.isNeedSendAddress) {
                        that.setData({
                          servicesStation: myExpressData[0]
                        })
                      }
                      if (myExpressData.length > 1) {
                        that.setData({
                          condition3: true,
                          arrowFlag: true
                        });
                      } else {
                        that.setData({
                          condition3: true,
                          arrowFlag: false
                        });
                      }


                      let senderLocation = from.longitude + "," + from.latitude;
                      console.log(senderLocation)
                      let senderName = from.name,
                        senderPhone = from.phone,
                        senderProvinceCityCountyCode = from.proviceCityRegion,
                        senderProvinceCityCountyName = from.proviceCityRegionTxt,
                        senderAddressDetail = from.addrDetail
                      that.setData({
                        jsonsenddata: {
                          senderLocation: senderLocation,
                          senderName: senderName,
                          senderPhone: senderPhone,
                          senderProvinceCityCountyCode: senderProvinceCityCountyCode,
                          senderProvinceCityCountyName: senderProvinceCityCountyName,
                          senderAddressDetail: senderAddressDetail
                        }
                      })


                    } else {
                      that.setData({
                        fromAddressEnable: false,
                        servicesStation: { "orgName": "暂无" },
                        servereStationList: [],
                        condition3: false,
                        arrowFlag: false
                      })
                    }
                  } else {
                    that.setData({
                      fromAddressEnable: false,
                      servicesStation: { "orgName": "暂无" },
                      servereStationList: [],
                      condition3: false,
                      arrowFlag: false
                    })
                  }
                })
              },
              function (res) {
              })
          }

        } else {
          that.setData({
            fromhint: true,
          })
        }
      },
      fail: function () {
        that.setData({
          fromhint: true,
        })
      }
    });
  },
  receiverAddressCheck(){
    let that=this;
    wx.getStorage({
      key: 'desAddress',
      success: function (res) {
        if (res.data) {
          const des = res.data.desAddress;
          console.log(des)
          if (that.data.fromhint) {
            that.setData({
              servicesStation: { "orgName": "暂无" }
            })
          }
          const proviceCityRegionTxt2 = des.proviceCityRegionTxt.split('-').join('');
          const desaddressDetail = proviceCityRegionTxt2 + des.addrDetail;
          des.desaddressDetail = desaddressDetail;
          that.setData({
            deshint: false,
            desAddress: des
          })
          //收数据
          let receiverName = des.name,
            receiverPhone = des.phone,
            receiverProvinceCityCountyCode = des.proviceCityRegion,
            receiverProvinceCityCountyName = des.proviceCityRegionTxt,
            receiverAddressDetail = des.addrDetail
          that.setData({
            jsonreceiverdata: {
              receiverName: receiverName,
              receiverPhone: receiverPhone,
              receiverProvinceCityCountyCode: receiverProvinceCityCountyCode,
              receiverProvinceCityCountyName: receiverProvinceCityCountyName,
              receiverAddressDetail: receiverAddressDetail
            }
          })
          //验证目的地址是否在3公里范围内
          let addressJson = {};
          let fromTemp = that.data.fromTemp
          if (fromTemp) {
            addressJson.longitude = fromTemp.longitude;
            addressJson.latitude = fromTemp.latitude;
            const proviceCityRegionTxt = fromTemp.proviceCityRegionTxt.split('-').join('');
            const fromaddressDetail = proviceCityRegionTxt + fromTemp.addrDetail;
            addressJson.addrDetail = fromaddressDetail;
            addressJson.cityCode = fromTemp.proviceCityRegion.split('-')[1];
            addressJson.destinationCode = des.proviceCityRegion.split('-')[1];
          }
          let addrressJsonData = {
            "object": addressJson
          };
          console.log("receiverAddressCheck " + JSON.stringify(addrressJsonData));
          common.ajax(Api.port.receiverAddressCheck, addrressJsonData,
            function (res) {
              console.log("receiverAddressCheck " + JSON.stringify(res.data));
              let header = res.header;
              let setcookie = header["Set-Cookie"];
              common.sessionvalid(setcookie, function () {
                if (res.data.errCode == '000000') {
                  let myExpressData = res.data.object;
                  if (myExpressData == "1") {
                    that.setData({
                      destAddressEnable: true
                    })
                  } else {
                    that.setData({
                      destAddressEnable: false
                    })
                  }
                  //TODO
                } else {
                  that.setData({
                    destAddressEnable: false
                  })
                }
              })
            },
            function (res) {
            })
        } else {
          that.setData({
            deshint: true,
          })
        }
      },
      fail: function () {
        that.setData({
          deshint: true,
        })
      }
    });
  },
  sendExpress(e) {
    let that = this;
    if (this.data.clickTag === 0) {
      this.setData({
        clickTag: 1
      })
      setTimeout(function () {
        that.setData({
          clickTag: 0
        })
      }, 3000);

      //点击下单时获取预约订单的信息
      console.log(this.data.typeid);
      console.log(this.data.newitemtype);
      console.log(this.data.weights);
      console.log(this.data.date);
      console.log(this.data.hour);
      let hourstart = this.data.hour.split("-")[0] + ":00";
      let hoursend = this.data.hour.split("-")[1] + ":00";
      let datestart = this.data.date + " " + hourstart;
      console.log(datestart);
      let dateend = this.data.date + " " + hoursend;
      console.log(dateend);

      //判断物品类型
      var goodsType, goodsRemark;
      if (this.data.newitemtype == '日用品') {
        goodsType = '1'
      } else if (this.data.newitemtype == '数码产品') {
        goodsType = '2'
      } else if (this.data.newitemtype == '衣物') {
        goodsType = '3'
      } else if (this.data.newitemtype == '食物') {
        goodsType = '4'
      } else if (this.data.newitemtype == '文件') {
        goodsType = '5'
      } else {
        goodsType = '0';
        goodsRemark = this.data.newitemtype;
      }
      console.log(goodsType);
      console.log(goodsRemark);

      // 验证
      console.log(this.data.clickTag)
      if (!that.data.fromhint && !that.data.deshint) {

        that.setData({
          loadingflag: true,
          ruleclick: false
        })
        const jsonsenddata = that.data.jsonsenddata;
        const jsonreceiverdata = that.data.jsonreceiverdata;
        const checked = that.data.checkStatus ? '1' : '0';
        //合并下单数据
        let json = {};
        json.agreementStatus = checked;
        json.orderSource = '0';
        json.goodsType = goodsType;
        json.goodsRemark = goodsRemark;
        json.goodsWeight = this.data.weights;
        json.bookedFrom = datestart;
        json.bookedTo = dateend;

        //有快递员的信息
        if (that.data.courierdata) {
          const courierdata = that.data.courierdata;
          json.photo = courierdata.photo;
          json.orgUuid = courierdata.orgUuid;
          json.orgName = courierdata.orgName;
          json.orgNo = courierdata.orgNo;
          json.courierUuid = that.data.uuid;
          json.courierNo = courierdata.userCode;
          json.courierName = courierdata.userName;
        }
        //服务站点表示
        json.isSelectService = "1";
        let serviceList = [];
        let serviceItem = {}
        serviceItem.orgUuid = that.data.servicesStation.orgUuid;
        serviceItem.orgName = that.data.servicesStation.orgName;
        serviceItem.orgNo = that.data.servicesStation.orgNo;
        serviceList[0] = serviceItem;
        json.orgBaseInfoList = serviceList;

        for (let attr in jsonsenddata) {
          json[attr] = jsonsenddata[attr];
        }
        for (let attr in jsonreceiverdata) {
          json[attr] = jsonreceiverdata[attr];
        }

        //微信下单增加openid字段，来推送给对应的微信号
        let openid = app.globalData.openid;
        console.log("下单前openid" + openid)
        json.openid = openid;
        let jsonData = {
          "object": json
        };
        console.log('下单数据');
        console.log(JSON.stringify(jsonData));
        common.ajax(Api.port.senderOrder, jsonData,
          function (res) {
            console.log('下单返回数据' + JSON.stringify(res.data.object))
            that.setData({
              loadingflag: false
            })
            let header = res.header;
            let setcookie = header["Set-Cookie"];
            common.sessionvalid(setcookie, function () {
              if (res.data.errCode == '000000') {
                let myExpressData = res.data.object;
                console.log(myExpressData)
                wx.setStorage({
                  key: 'myExpressData',
                  data: {
                    myExpressData: myExpressData,
                  },
                  success: function () {
                    wx.showToast({
                      icon: 'none',
                      title: '下单成功',
                      duration: 2000,
                      success: () => {
                        // 删除地址记录
                        setTimeout(function () {
                          wx.removeStorage({
                            key: 'fromAddress',
                            success: function () {
                              wx.removeStorage({
                                key: 'desAddress',
                                success: function () {

                                  wx.redirectTo({
                                    url: '../removeOrder/removeOrder'
                                  });
                                }
                              });
                            }
                          });
                        }, 2000);

                      },
                    });
                  }
                });

              } else {
                wx.showToast({
                  title: res.data.errDesc,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          function (res) {

          })



      } else {
        wx.showToast({
          title: '寄件人或发件人信息不能为空',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请勿频繁点击！',
        icon: 'none',
        duration: 2000
      })
    }
    let formId = e.detail.formId
    console.log(formId)
    this.saveformid(formId)
  },
  saveformid(formId) {
    //保存fromid
    let openid = app.globalData.openid;
    console.log("openid" + openid)
    let userUuid = wx.getStorageSync('userUuid');
    if (formId == "the formId is a mock one") {
      return
    }

    console.log('typeof (openid) == ' + typeof (openid))

    if (typeof (openid) == 'undefined' || openid=='') {
      return
    }
    let formidJsonData = { "object": { "formid": formId, "openid": openid, "userUuid": userUuid } }
    console.log('sendexpress-formidJsonData-' + JSON.stringify(formidJsonData))
    common.ajax(Api.port.createFromId, formidJsonData,
    function (res) {
      if (res.data.errCode == '000000') {
        console.log('formid存储成功')
        console.log(res.data)
      }else{
        console.log('formid失败')
        console.log(res.data.object)
      }
    },
    function (res) {
    })
  },
  jiaddress(e) {
    this.setData({
      isNeedRefresh: true,
      isNeedSendAddress: true
    })
    wx.navigateTo({
      url: '../address/my-address?index=2'
    });
    let formId = e.detail.formId
    console.log(formId)
    this.saveformid(formId)
  },
  shouaddress(e) {
    console.log(e.detail.formId);
    this.setData({
      isNeedRefresh: true,
      isNeedSendAddress: false
    })
    wx.navigateTo({
      url: '../address/my-address?index=1'
    });
    let formId = e.detail.formId
    this.saveformid(formId)
  },
  rule() {
    this.setData({
      isNeedRefresh: false
    })
    wx.navigateTo({
      url: '../rule/rule'
    });
  },
  // 存入物品类型、重量、预约时间
  sendData() {
    const itemtypes = [{
      "id": "1",
      "type": "日用品",
    },
    {
      "id": "2",
      "type": "数码产品"
    },
    {
      "id": "3",
      "type": "衣物"
    },
    {
      "id": "4",
      "type": "食物"
    },
    {
      "id": "5",
      "type": "文件"
    }, {
      "id": "0",
      "type": "其他"
    }
    ]
    const itemweights = [];
    for (let i = 0.5; i <= 30; i = i + 0.5) {
      itemweights.push(i);
    }
    const hours = [{
      "id": 11,
      "time": "9:00-11:00",
      "able": false
    },
    {
      "id": 13,
      "time": "11:00-13:00",
      "able": false
    },
    {
      "id": 15,
      "time": "13:00-15:00",
      "able": false
    },
    {
      "id": 17,
      "time": "15:00-17:00",
      "able": false
    },
    {
      "id": 19,
      "time": "17:00-19:00",
      "able": false
    }
    ];
    this.setData({
      itemtypes: itemtypes,
      itemweights: itemweights,
      hours: hours,
    })
    // 今天
    let timetamp1 = Date.parse(new Date());
    let today = new Date(timetamp1).Format("yyyy-MM-dd hh:mm:ss");
    let todaydate = today.split(" ");
    //明天
    let timetamp2 = timetamp1 + 60 * 60 * 24 * 1000;
    let tomorrow = new Date(timetamp2).Format("yyyy-MM-dd hh:mm:ss");
    let tomorrowdate = tomorrow.split(" ");
    //后天
    let timetamp3 = timetamp1 + 60 * 60 * 24 * 1000 * 2;
    let aftertomorrow = new Date(timetamp3).Format("yyyy-MM-dd hh:mm:ss");
    let aftertomorrowdate = aftertomorrow.split(" ");
    this.setData({
      todaydate: todaydate[0],
      tomorrowdate: tomorrowdate[0],
      aftertomorrowdate: aftertomorrowdate[0],
    })
    let todayhour = todaydate[1].split(":");
    // console.log(todayhour[0]);
    if (todayhour[0] < 9) {
      this.setData({
        hour: "9:00-11:00",
        hour1: "11",
        date: todaydate[0]
      })
    } else if (todayhour[0] < 11 && todayhour[0] >= 9) {
      this.setData({
        hour: "11:00-13:00",
        hour1: "13",
        date: todaydate[0]
      })
    } else if (todayhour[0] < 13 && todayhour[0] >= 11) {
      this.setData({
        hour: "13:00-15:00",
        hour1: "15",
        date: todaydate[0]
      })
    } else if (todayhour[0] < 15 && todayhour[0] >= 13) {
      this.setData({
        hour: "15:00-17:00",
        hour1: "17",
        date: todaydate[0]
      })
    } else if (todayhour[0] < 17 && todayhour[0] >= 15) {
      this.setData({
        hour: "17:00-19:00",
        hour1: "19",
        date: todaydate[0]
      })
    } else if (todayhour[0] >= 17) {
      this.setData({
        hour: "9:00-11:00",
        hour1: "11",
        date: tomorrowdate[0]
      })
    }
    this.setData({
      hour2: this.data.hour1,
      todayhour: todayhour[0]
    })


  },
  // 物品类型
  itemtype(e) {
    console.log(e.detail.formId);
    this.setData({
      condition: !this.data.condition,
      data: this.data.itemtype
    })
    let formId = e.detail.formId
    this.saveformid(formId)
  },
  confirm: function () {
    //用户没有选择直接点击确定（也就是默认选了第一个的情况下）
    if (!this.data.usercheck) {
      this.setData({
        condition: !this.data.condition,
        itemtype: this.data.itemtypes[0].type
      })
    } else {
      this.setData({
        condition: !this.data.condition,
        itemtype: this.data.data
      })
    }
    //重置
    this.setData({
      usercheck: false
    })
    switch (this.data.itemtype) {
      case "其他":
        this.setData({
          typeid: "0"
        })
        break;
      case "日用品":
        this.setData({
          typeid: "1"
        })
        break;
      case "数码产品":
        this.setData({
          typeid: "2"
        })
        break;
      case "衣物":
        this.setData({
          typeid: "3"
        })
        break;
      case "食物":
        this.setData({
          typeid: "4"
        })
        break;
      case "文件":
        this.setData({
          typeid: "5"
        })
        break;
    }
    console.log(this.data.typeid);
  },
  cancel() {
    this.setData({
      condition: !this.data.condition,
    })
    //重置
    this.setData({
      usercheck: false
    })
  },

  //新物品类型
  newitemtype(e) {
    console.log(e.detail.formId);
    this.setData({
      condition4: !this.data.condition4,
      data: this.data.newitemtype
    })
    let formId = e.detail.formId
    this.saveformid(formId)
  },
  cancel4() {
    this.setData({
      condition4: !this.data.condition4,
    })
  },
  chooseGoods(item){
      let goodstype = item.currentTarget.id;
    console.log(goodstype)
      this.setData({
        newtypeflag: goodstype,
        usercheck:true,
      });
    if (goodstype=='0'){
      this.setData({
        inputshow:true,
      })
    }else{
      this.setData({
        inputshow: false,
      })
    }
  },
  //手动输入物品类型
  bindKeyInput(e) {
    console.log(e.detail.value)
      this.setData({
        goodsinputvalue: e.detail.value,
      })
  },
  confirm4:function(){
    //用户没有选择直接点击确定（也就是默认选了第一个的情况下）
    let indexGoods = this.data.newtypeflag;
    console.log(indexGoods);
    var regEn = /[`!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
        regEx = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    if(indexGoods==0){
      if (this.data.goodsinputvalue.length == 0){
        wx.showToast({
          title: '请输入物品类型',
          icon: 'none',
          duration: 1000
        })
      } else if (regEn.test(this.data.goodsinputvalue) || regCn.test(this.data.goodsinputvalue) || regEx.test(this.data.goodsinputvalue)){
        wx.showToast({
          title: '物品类型不可有特殊字符',
          icon: 'none',
          duration: 1000
        })
      }else{
        this.setData({
          condition4: !this.data.condition4,
          newitemtype: this.data.goodsinputvalue,
          goodsinputvalue: this.data.goodsinputvalue,
        })
      }
    }else{
      this.setData({
        condition4: !this.data.condition4,
        newitemtype: this.data.itemtypes[indexGoods-1].type,
        goodsinputvalue:''
      })
    }
  },

  //物品重量
  itemweight(e) {
    console.log(e.detail.formId)
    this.setData({
      condition1: !this.data.condition1,
      data: this.data.weights
    })
    let formId = e.detail.formId
    this.saveformid(formId)
  },
  confirm1: function () {
    if (!this.data.usercheck) {
      this.setData({
        condition1: !this.data.condition1,
        weights: "0.5"
      })
    } else {
      this.setData({
        condition1: !this.data.condition1,
        weights: this.data.data
      })
    }
    //重置
    this.setData({
      usercheck: false
    })

  },
  cancel1() {
    this.setData({
      condition1: !this.data.condition1,
    })
    //重置
    this.setData({
      usercheck: false
    })
  },
  //预约时间
  scheduletime(e) {
    console.log(e.detail.formId);
    this.setData({
      condition2: !this.data.condition2,
      data: this.data.date,
      data1: this.data.hour,
    })
    console.log(this.data.hour2);
    let formId = e.detail.formId
    this.saveformid(formId)
  },
  confirm2: function () {
    if (this.data.data == "" || this.data.data1 == "") {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        condition2: !this.data.condition2,
        date: this.data.data,
        hour: this.data.data1,
      })
    }
  },
  cancel2() {
    this.setData({
      condition2: !this.data.condition2,
    })
  },
  //预约时间判断点击了哪个时间段
  checkhours: function (item) {
    let id = item.currentTarget.id;
    //用户第一次打开预约时间按钮需要附上颜色，之后点击任意按钮重置 
    this.setData({
      hour1: ""
    })

    switch (id) {
      case "11":
        this.setData({
          hourid: "11",
          data1: "9:00-11:00"
        })
        break;
      case "13":
        this.setData({
          hourid: "13",
          data1: "11:00-13:00"
        })
        break;
      case "15":
        this.setData({
          hourid: "15",
          data1: "13:00-15:00"
        })
        break;
      case "17":
        this.setData({
          hourid: "17",
          data1: "15:00-17:00"
        })
        break;
      case "19":
        this.setData({
          hourid: "19",
          data1: "17:00-19:00"
        })
        break;
    }
  },
  //预约时间为今天
  todaycheck() {
    console.log(this.data.hour2);
    this.setData({
      hour1: this.data.hour2,
      data: this.data.todaydate
    })
    switch (this.data.hour2) {
      case "11":
        this.setData({
          hourid: "11",
          data1: "9:00-11:00"
        })
        break;
      case "13":
        this.setData({
          hourid: "13",
          data1: "11:00-13:00"
        })
        break;
      case "15":
        this.setData({
          hourid: "15",
          data1: "13:00-15:00"
        })
        break;
      case "17":
        this.setData({
          hourid: "17",
          data1: "15:00-17:00"
        })
        break;
      case "19":
        this.setData({
          hourid: "19",
          data1: "17:00-19:00"
        })
        break;
    }


  },
  //预约时间为明天
  tomorrowcheck() {
    console.log(this.data.hour1);
    this.setData({
      hour1: "",
      data: this.data.tomorrowdate
    })
  },
  //预约时间为后天
  aftertomorrowcheck() {
    console.log(this.data.hour1);
    this.setData({
      hour1: "",
      data: this.data.aftertomorrowdate
    })
  },//查看服务站点
  serviceStation(e) {
    console.log(e.detail.formId)
    let that = this;
    if (!that.data.arrowFlag) {
      return;
    }
    this.setData({
      showDialog: !this.data.showDialog
    })
    let formId = e.detail.formId
    this.saveformid(formId)
  },
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });

  }, clickServiceStation: function (e) {
    console.log("clickServiceStation")
    let service = e.currentTarget.dataset.item;
    console.log("clickServiceStation " + JSON.stringify(service))
    this.setData({
      servicesStation: service,
      showDialog: !this.data.showDialog
    });
  }
});