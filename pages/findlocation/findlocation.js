const amapFile = require("../../utils/amap-wx.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: "北京市",
    tips: {},
    adcode: '110105',
  },
  onLoad(e) {
    var that = this;
    //带过来的城市
    let city_test = e.id
    let city_code = e.code
    if (city_test != '') {
      this.setData({
        city: city_test,
        adcode: city_code
      })
      var keywords = city_test;
      var key = "f951696ba64bfc95033a4db927992ce0";
      var myAmapFun = new amapFile.AMapWX({
        key: key
      });
      myAmapFun.getInputtips({
        keywords: keywords,
        citylimit: true,
        city: city_code,
        success: function(data) {
          if (data && data.tips) {
            var list = [];
            for (var i = 0; i < data.tips.length; i++) {
              if (data.tips[i].location != "") {
                //记录详细地址到address
                data.tips[i].address = data.tips[i].name;
                //记录完整地址到name
                data.tips[i].name = data.tips[i].district + data.tips[i].name;
                list.push(data.tips[i]);
              }
            }
            that.setData({
              tips: list
            });
          }
          console.log(that.data.tips);
        }
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.getLocation({
      success: function(res) {
        let location = res.longitude + "," + res.latitude;
        let key = "38782d2bc8e5e42e210eb8013e17836a";
        let url = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${location}&key=${key}&radius=3000&extensions=all`;
        wx.request({
          url: url,
          method: 'GET',
          dataType: 'json',
          success: function(res) {
            console.log(res);
            var nocity = res.data.regeocode.addressComponent.city;
            if (nocity.length == 0) {
              that.setData({
                city: res.data.regeocode.addressComponent.province,
                adcode: res.data.regeocode.addressComponent.adcode
              })
            } else {
              that.setData({
                city: res.data.regeocode.addressComponent.city,
                adcode: res.data.regeocode.addressComponent.adcode
              })
            }
            let key = "38782d2bc8e5e42e210eb8013e17836a";
            let url1 = `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${location}&poitype=&radius=&extensions=all&batch=false&roadlevel=0`;
            wx.request({
              url: url1,
              method: 'GET',
              dataType: 'json',
              success: function(res) {
                let data = res.data.regeocode.addressComponent;
                let district = data.district != '' ? data.district : '';
                let street = data.streetNumber.street != '' ? data.streetNumber.street : '';
                let name = res.data.regeocode.aois.length != 0 ? res.data.regeocode.aois[0].name : '';
                //查询
                let keyword = data.province + data.city + district + street + name;
                console.log(res.data.regeocode.aois[0]);
                var key1 = "f951696ba64bfc95033a4db927992ce0";
                var myAmapFun = new amapFile.AMapWX({
                  key: key1
                });

                myAmapFun.getInputtips({
                  keywords: keyword,
                  citylimit: true,
                  city: that.data.adcode,
                  success: function(data) {
                    if (data && data.tips) {
                      var list = [];
                      for (var i = 0; i < data.tips.length; i++) {
                        if (data.tips[i].location != "") {
                          //记录详细地址到address
                          data.tips[i].address = data.tips[i].name;
                          //记录完整地址到name
                          data.tips[i].name = data.tips[i].district + data.tips[i].name;
                          list.push(data.tips[i]);
                        }
                      }
                      that.setData({
                        tips: list
                      });
                    }
                    console.log(data);
                  }
                })

                wx.hideLoading()
              },
              fail: function(res) {
                wx.hideLoading()
              }
            })

          },
          fail: function(res) {
            wx.hideLoading()
          }
        })
      },
      fail() {
        wx.hideLoading();
      }
    })
  },
  onShow() {
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.index != undefined) {
      //有参数
      that.setData({ //将携带的参数赋值
        city: currPage.data.item,
        adcode: currPage.data.item1
      });
    }
  },
  bindInput(e) {
    console.log("11111"+this.data.adcode);
    var that = this;
    var keywords = e.detail.value;
    var key = "f951696ba64bfc95033a4db927992ce0";
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    myAmapFun.getInputtips({
      keywords: keywords,
      citylimit: true,
      city: this.data.adcode,
      success: function(data) {
        if (data && data.tips) {
          var list = [];
          for (var i = 0; i < data.tips.length; i++) {
            if (data.tips[i].location != "") {
              //记录详细地址到address
              data.tips[i].address = data.tips[i].name;
              //记录完整地址到name
              data.tips[i].name = data.tips[i].district + data.tips[i].name;
              list.push(data.tips[i]);
            }
          }
          that.setData({
            tips: list
          });
        }
        console.log(data);
      }
    })
  },
  bindSearch(e) {
    var keywords = e.currentTarget.dataset.keywords.name;
    //获取省市区后面的地址
    var getformatted = e.currentTarget.dataset.keywords.address;
    var key = "38782d2bc8e5e42e210eb8013e17836a";
    var url = `https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${keywords}&city=`;
    wx.request({
      url: url,
      method: 'GET',
      dataType: 'json',
      success(res) {
        //找到地点
        if (res.data.geocodes.length != 0) {
          let geocodes = res.data.geocodes[0];
          let pages = getCurrentPages(); //当前页面
          let prevPage = pages[pages.length - 2]; //上一页面
          prevPage.setData({ //直接给上移页面赋值
            item: getformatted,
            province: geocodes.province,
            city: geocodes.city,
            county: geocodes.district,
            index: "get"
          });
          wx.navigateBack({
            delta: 1
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: '网络错误',
            duration: 1000
          })
        }
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: '请求失败',
          duration: 1000
        })
      }
    })
  },
  changecity() {
    this.setData({
      tips: {}
    })
    wx: wx.navigateTo({
      url: '../changecity/changecity'
    })
  }

})