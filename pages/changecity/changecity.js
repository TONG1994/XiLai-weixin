const city = require("../../utils/city.js");
const common = require("../../utils/common.js");
const regular = require("../../utils/regular.js");
const Api = require("../../utils/api.js");
Page({
  data: {
    hidden: true,
    searchLetter: [],
    itemH: '',
    focus: false,
    showLetter: "",
    winHeight: 0,
    tHeight: 0,
    bHeight: 0,
    startPageY: 0,
    cityList: [],
    cityList1: [],
    scrollTop: 0,
    city: "",
    pixelRatio: 0,
    height1: 0, //城市的节点高度
    height2: 0, //首字母的节点高度
    height3: 0, //两首字母间缝隙节点高度 
    height4: 0, //右侧首字母滑动栏高度
    height5: 0, //input框的高度
  },
  onLoad() {
    // 生命周期函数--监听页面加载
    var searchLetter = city.searchLetter; //A-Z
    var cityList = city.cityList(); //A-Z加上对应的城市地点
    //插入热门城市
    cityList[0].cityInfo.push({
      "id": "1",
      "provincecode": "110000",
      "city": "\u5317\u4eac\u5e02",
      "code": "110100",
      "initial": "B"
    }, {
      "id": "1001",
      "provincecode": "310000",
      "city": "上海市",
      "code": "310000",
      "initial": "S"
    }, {
      "id": "199",
      "provincecode": "440000",
      "city": "\u6df1\u5733\u5e02",
      "code": "440300",
      "initial": "S"
    }, {
      "id": "197",
      "provincecode": "440000",
      "city": "\u5e7f\u5dde\u5e02",
      "code": "440100",
      "initial": "G"
    }, {
      "id": "1002",
      "provincecode": "500100",
      "city": "重庆市",
      "code": "500100",
      "initial": "C"
    }, {
      "id": "343",
      "provincecode": "120000",
      "city": "\u5929\u6d25\u5e02",
      "code": "120100",
      "initial": "T"
    })
    var sysInfo = wx.getSystemInfoSync();
    var pixelRatio = sysInfo.pixelRatio;
    // console.log(pixelRatio);
    var winHeight = pixelRatio * sysInfo.windowHeight; //获取设备屏幕的高度
    //添加要匹配的字母范围值
    //1、屏幕高度设置子元素的高度
    var itemH = winHeight / pixelRatio * searchLetter.length;
    // console.log("itemH" + itemH);
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp);
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList,
      pixelRatio: pixelRatio
    })
  },
  getFields() {
    //获取节点的相关信息
    var that = this;
    var getfields = wx.createSelectorQuery();
    getfields.select('.item_city').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: ['margin', 'backgroundColor']
    }, function(res) {
      // console.log(res.height);
      that.setData({
        height1: res.height
      })
    }).exec();
    getfields.select('.shadows').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: ['margin', 'backgroundColor']
    }, function(res) {
      // console.log(res.height);
      that.setData({
        height2: res.height
      })
    }).exec();
    getfields.select('.item_letter').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: ['margin', 'backgroundColor']
    }, function(res) {
      // console.log(res.height);
      that.setData({
        height3: res.height
      })
    }).exec();
    getfields.select('.searchLetter').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: ['margin', 'backgroundColor']
    }, function(res) {
      // console.log(res.height);
      that.setData({
        height4: res.height
      })
    }).exec();
    getfields.select('.inputview').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: ['margin', 'backgroundColor']
    }, function(res) {
      // console.log(res.height);
      that.setData({
        height5: res.height
      })
    }).exec();

  },
  //手指接触
  searchStart(e) {
    this.getFields();
    // console.log(e);
    var showLetter = e.currentTarget.dataset.letter;
    var pageY = e.touches[0].pageY;
    // console.log(showLetter);
    // console.log(this);
    this.setScrollTop(this, showLetter);

    this.setData({
      showLetter: showLetter,
      startPageY: pageY,
    })
  },
  //手指滑动
  searchMove(e) {
    var maxHeight = this.data.height4;
    var searchLetter = city.searchLetter; //A-Z
    var average = maxHeight / searchLetter.length;
    var pageY = e.touches[0].pageY;
    var test1 = this.data.height5;
    var test2 = this.data.winHeight;
    var test3 = test1 + test2 * 7 / 50;
    var test = test3 / this.data.pixelRatio;
    // console.log("test" + test)
    var nowheight = pageY - test;
    for (var i = 0; i < searchLetter.length; i++) {
      var b = i * average + average / 2
      if (nowheight < b) {
        // console.log(searchLetter[i]);
        this.setScrollTop(this, searchLetter[i]);
        break;
      }

    }
  },
  setScrollTop(that, showLetter) {
    var scrollTop = 0;
    var cityList = that.data.cityList;
    var cityCount = 0;
    var initialCount = 0;
    var pixelRatio = this.data.pixelRatio;
    var height1 = this.data.height1;
    var height2 = this.data.height2;
    var height3 = this.data.height3;
    for (var i = 0; i < cityList.length; i++) {
      if (showLetter == cityList[i].initial) {
        scrollTop = initialCount * height2 + cityCount * height1 + initialCount * height3;
        break;
      } else {
        initialCount++;
        cityCount += cityList[i].cityInfo.length;
      }
    }

    that.setData({
      scrollTop: scrollTop
    })

  },
  bindCity(e) {
    console.log(e);
    var city = e.currentTarget.dataset.city;
    var code = e.target.dataset.code;
    console.log(city + code);
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    prevPage.setData({ //直接给上移页面赋值
      item: city,
      item1: code,
      index: "get"
    });
    wx.navigateBack({
      delta: 1
    });

  },
  //点击inputView位置都可以使键盘弹起
  bindButtonTap() {
    this.setData({
      focus: true
    })
  },
  bindKeyInput(e) {
    var that = this;
    var inputValue = e.detail.value;
    console.log()
    let jsonData = {
      "object": inputValue
    }
    if (inputValue == "") {
      that.setData({
        hidden: true
      })
    } else {
      var timer = null;
      clearTimeout(timer);
      timer = setTimeout(function() {
        that.nexInput(jsonData);
      }, 1000)

    }

  },
  nexInput(jsonData) {
    var that = this;
    common.ajax(Api.port.getCityNames, jsonData, function(res) {
      let header = res.header;
      let setcookie = header["Set-Cookie"];
      common.sessionvalid(setcookie, function() {
        if (res.data.errCode == '000000') {
          // console.log(res);
          var cityList1 = res.data.object.list
          console.log(cityList1);
          that.setData({
            hidden: false,
            cityList1: cityList1
          })
        } else {
          // wx.alert({ title: res.data.errDesc });
          wx.showToast({
            icon: 'none',
            title: res.data.errDesc,
            duration: 1000
          })
        }
      })
    }, function(res) {
      wx.showToast({
        icon: 'none',
        title: res.errorMessage,
        duration: 1000
      })
    })
  }

})