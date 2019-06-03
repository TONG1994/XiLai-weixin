const tcity = require("../../utils/areajson.js");
const common = require("../../utils/common.js");
const Api = require("../../utils/api.js");
const regular = require("../../utils/regular.js");

const app = getApp();
Page({
  data: {
    provinces: [],
    province: "北京市",
    citys: [],
    city: "北京市",
    countys: [],
    county: '怀柔区',
    city_test: '', //记录把市带过去查询
    city_code: '110105', //记录把市code带过去查询
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    addrType: 1,
    clickTag: 0,
    textareaTag: true,
    door_number: '',
    address_phone: ''
  },
  onLoad: function(options) {
    this.setData({
      userName: options.userName,
      addrType: options.addrType
    })
    let that = this;
    tcity.init(that);
    let cityData = that.data.cityData;
    let provinces = [];
    let citys = [];
    let countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].label);
    }
    for (let i = 0; i < cityData[0].children.length; i++) {
      citys.push(cityData[0].children[i])
    }
    for (let i = 0; i < cityData[0].children[0].children.length; i++) {
      countys.push(cityData[0].children[0].children[i].label)
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys
    })
  },
  onShow() {
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.index != undefined) {
      //有参数
      that.setData({ //将携带的参数赋值
        srlocation: currPage.data.item,
        province: currPage.data.province,
        city: currPage.data.city,
        county: currPage.data.county,
      });
      //获取返还过来的省市区
      let pcc = that.data.province + " " + that.data.city + " " + that.data.county;
      that.setData({
        citydistrict: pcc
      })
    }

  },
  // 所在地区  选择框
  bindChange(e) {
    let a;
    if (e == undefined) {
      var val = this.data.value;
      a = this.data.value;
    } else {
      var val = e.detail.value
      a = [val[0], 0, 0]
    }
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      let citys = [];
      let countys = [];
      if (cityData[val[0]].children != undefined || cityData[val[0]].children != null) {
        for (let i = 0; i < cityData[val[0]].children.length; i++) {
          citys.push(cityData[val[0]].children[i])
          // citys.push(cityData[val[0]].children[i].label)
          // console.log(cityData[val[0]].children[i])
        }
        if (cityData[val[0]].children[0].children != undefined || cityData[val[0]].children[0].children != null) {

          for (let i = 0; i < cityData[val[0]].children[0].children.length; i++) {
            countys.push(cityData[val[0]].children[0].children[i].label)
          }
          this.setData({
            province: this.data.provinces[val[0]],
            city: cityData[val[0]].children[0].label,
            city_code: cityData[val[0]].children[0].value,
            citys: citys,
            county: cityData[val[0]].children[0].children[val[2]].label,
            countys: countys,
            values: val,
            value: a
          })

          return;
        } else {
          //香港澳门数据只有省和市，置空后面的数据

          this.setData({
            province: this.data.provinces[val[0]],
            city: cityData[val[0]].children[0].label,
            city_code: cityData[val[0]].children[0].value,
            citys: citys,
            county: '',
            countys: '',
            values: val,
            value: [val[0], 0, 0]
          })

          return;
        }
      } else {
        //台湾数据只有省，置空后面的数据

        this.setData({
          province: this.data.provinces[val[0]],
          city: '',
          citys: '',
          county: '',
          countys: '',
          values: val,
          value: [val[0], 0, 0]
        })

        return;
      }
    }
    if (val[1] != t[1]) {
      let countys = [];

      if (cityData[val[0]].children[val[1]].children != undefined || cityData[val[0]].children[val[1]].children != null) {
        for (let i = 0; i < cityData[val[0]].children[val[1]].children.length; i++) {
          countys.push(cityData[val[0]].children[val[1]].children[i].label)
        }

        this.setData({
          city: this.data.citys[val[1]].label,
          city_code: this.data.citys[val[1]].value,
          county: cityData[val[0]].children[val[1]].children[0].label,
          countys: countys,
          values: val,
          value: [val[0], val[1], 0]
        })
        return;
      } else {
        //香港澳门
        this.setData({
          city: this.data.citys.label[val[1]],
          city_code: this.data.citys.value[val[1]],
          county: '',
          countys: '',
          values: val,
          value: [val[0], val[1], 0]
        })
        return;
      }
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }

  },
  confirm() {
    this.setData({
      citydistrict: this.data.province + " " + this.data.city + " " + this.data.county,
      city_test: this.data.city,
      condition: !this.data.condition,
      textareaTag: true
    })
  },
  cancel() {
    this.setData({
      condition: !this.data.condition,
      textareaTag: true
    })
  },
  open() {
    this.getAddressBookIndex();
    this.bindChange()
    this.setData({
      condition: !this.data.condition
    })
    setTimeout(() => {
      this.setData({
        textareaTag: false
      })
    }, 200)
  },
  getAddressBookIndex() {
    let v1 = this.data.province;
    let v2 = this.data.city;
    let v3 = this.data.county;
    let province = 0,
      city = 0,
      area = 0,
      i, j, k
    let all = this.data.cityData;
    for (i in all) {
      if (v1 === all[i].label) {
        province = i;
        for (j in all[i].children) {
          if (v2 === all[i].children[j].label) {
            city = j;
            for (k in all[i].children[j].children) {
              if (v3 === all[i].children[j].children[k].label) {
                area = k
              }
            }
          }
        }

      }
    }
    let address_index = [];
    address_index.push(province, city, area)
    console.log(address_index)
    this.setData({
      value: address_index
    })
  },
  //地址类型选择
  radiofromclick() {
    this.setData({
      addrType: 2
    })
  },
  radiodesclick() {
    this.setData({
      addrType: 1
    })
  },
  //姓名输入
  nameInput(e) {
    this.setData({
      address_name: e.detail.value,
    })
  },
  //联系方式输入
  phoneInput(e) {
    let test = regular.clipboardNumber(e.detail.value)
    console.log(test);
    this.setData({
      address_phone: test,
    })
  },
  //收/发件地址选择
  findlocation() {
    //将用户选择的城市带过去
    wx.navigateTo({
      url: '../findlocation/findlocation?id=' + this.data.city_test + '&code=' + this.data.city_code
    });
  },
  //门牌号输入
  addressInput(e) {
    this.setData({
      door_number: e.detail.value,
    })
  },
  //  收/发件保存
  saveaddress() {
    let that = this;
    //计时器，确保用户不要多次点击
    if (this.data.clickTag === 0) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.setData({
        clickTag: 1
      })
      setTimeout(function() {
        that.setData({
          clickTag: 0
        })
      }, 3000);
      //判断用户输入的内容
      //姓名
      if (this.data.address_name != undefined &&
        this.data.address_name != '' &&
        //电话
        this.data.address_phone != undefined &&
        this.data.address_phone != '' &&
        //所在区域
        this.data.citydistrict != undefined &&
        this.data.citydistrict != '' &&
        //收/发件地址
        this.data.srlocation != undefined &&
        this.data.srlocation != ''
        //输入门牌号
        // this.data.door_number != undefined &&
        // this.data.door_number != ''
      ) {
        //判断电话类型
        let phone_first = this.data.address_phone.slice(0, 1);
        let phone_length = this.data.address_phone.length;
        var getphone = this.data.address_phone
        var regularphone = regular.isValid('Phone', getphone);
        if (phone_first !== "1") {
          if (!(phone_length >= 4 && phone_length <= 12)) {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: "请填写正确的手机号",
              duration: 1000
            });
            return false;
          }
        } else if (phone_first === "1") {
          if (phone_length !== 11) {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: "请填写正确的手机号",
              duration: 1000
            });
            return false;
          }
        }
        //部分省市区的地址再处理
        let done_addressAreaTest = this.data.citydistrict.split(" ")
        if (done_addressAreaTest[1] == "" || done_addressAreaTest[1] == undefined || done_addressAreaTest[1] == null) {
          //台湾
          let done_address = done_addressAreaTest.join('');
          that.setData({
            proviceCityRegionTxt: done_addressAreaTest[0],
            proviceCityRegion: done_address
          })

        } else if (done_addressAreaTest[2] == "" || done_addressAreaTest[2] == undefined || done_addressAreaTest[2] == null) {
          //香港澳门-xxx
          let done_address = done_addressAreaTest.join('');
          that.setData({
            proviceCityRegionTxt: done_addressAreaTest[0] + "-" + done_addressAreaTest[1],
            proviceCityRegion: done_address
          })

        } else {
          //正常情况xxx-xxx-xxx
          let done_addressArea = this.data.citydistrict.split(" ").join("-");
          let done_address = this.data.citydistrict.split(" ").join("");
          that.setData({
            // proviceCityRegionTxt 江苏省-无锡市-新吴区
            // proviceCityRegion 江苏省无锡市新吴区
            proviceCityRegionTxt: done_addressArea,
            proviceCityRegion: done_address
          })
        }
        //完整地址,请求高德接口
        let addressAll_text = this.data.proviceCityRegion + this.data.srlocation + this.data.door_number;
        let key = "38782d2bc8e5e42e210eb8013e17836a";
        let url = `https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${addressAll_text}&city=`;
        wx.request({
          url: url,
          method: 'GET',
          dataType: 'json',
          success: function(res) {
            wx.hideLoading()
            //找到地点
            if (res.data.geocodes.length != 0) {
              let geocodes = res.data.geocodes[0];
              let locationarray = geocodes.location.split(',');
              that.setData({
                longitude: locationarray[0],
                latitude: locationarray[1],
              })
            }
            let jsonData = {
              "object": {
                "addrType": that.data.addrType,
                "name": that.data.address_name,
                "phone": that.data.address_phone,
                "proviceCityRegionTxt": that.data.proviceCityRegionTxt,
                "addrDetail": that.data.srlocation + that.data.door_number,
                "longitude": that.data.longitude,
                "latitude": that.data.latitude,
                "addUserType": "1",
                "addUserPhone": that.data.userName,
                "active": "1"
              }
            }
            common.ajax(Api.port.createAddress, jsonData,
              function(res) {
                wx.hideLoading()
                let header = res.header;
                let setcookie = header["Set-Cookie"];
                common.sessionvalid(setcookie, function() {
                  if (res.data.errCode == '000000') {
                    wx.showToast({
                      icon: 'none',
                      title: '新增成功',
                      duration: 1000,
                      success: () => {
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    })
                  } else {
                    wx.showToast({
                      icon: 'none',
                      title: res.data.errDesc,
                      duration: 1000
                    })
                  }
                })
              },
              function(res) {
                wx.hideLoading()
                wx.showToast({
                  icon: 'none',
                  title: res.errorMessage,
                  duration: 1000
                })
              })
          },
          fail: function(res) {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: 'fail',
              duration: 1000
            })
          },
          complete: function() {
            that.setData({
              loadingflag: false
            })
          }
        });
      } else {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '请把地址填写完整哦',
          duration: 1000
        })
      }

    } else {
      wx.showToast({
        icon: 'none',
        title: '请勿频繁点击！',
        duration: 1000
      })
    }
  },
});