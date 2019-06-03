const common = require("../../utils/common.js");
const Api = require('../../utils/api.js')
const app = getApp();

Page({
  data: {
    currentTab: '0',
    show: false,
    addrType: '',
    tabs: [{
        name: "全部"
      },
      {
        name: "收件"
      },
      {
        name: "发件"
      }
    ]
  },
  setaddress(e) {
    //获取data.list的信息
    console.log(this.data.list)
    if (this.data.fromindex == '2') {
      let fromAddress = this.data.list[e.currentTarget.dataset.id];
      wx.setStorage({
        key: 'fromAddress',
        data: {
          fromAddress: fromAddress,
        }
      });
      wx.navigateBack({
        delta: 1
      })
    } else if (this.data.fromindex == '1') {
      let desAddress = this.data.list[e.currentTarget.dataset.id];
      console.log(desAddress)
      wx.setStorage({
        key: 'desAddress',
        data: {
          desAddress: desAddress,
        }
      });
      wx.navigateBack({
        delta: 1
      })
    }
    console.log(this.data);

  },
  manage() {
    console.log("调用此方法")
    if (!this.data.show) {
      this.setData({
        show: true,
        active: 'active'
      })
    } else {
      this.setData({
        show: false,
        active: ''
      })
    }

  },

  onLoad(query) {
    //判断从发件或者收件进入地址tab
    let id = query.index;
    const left = 250 * id;
    this.setData({
      left: left,
      currentTab: id,
      fromindex: id,
      loadingflag: true,
      noaddress: false
    })
    //判断有没有session


  },
  onShow() {
    // 节点操作
    this.getRect()
    this.setData({
      noaddress: false,
      loadingflag: true
    })
    let that = this;
    if (that.data.currentTab == '1') {
      this.setData({
        addrType: 2
      })
    } else if (that.data.currentTab == '2') {
      this.setData({
        addrType: 1
      })
    } else if (that.data.currentTab == '0') {
      this.setData({
        addrType: ''
      })
    }
    console.log(that.data.addrType)
    //改成显示提示框
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getStorage({
      key: 'cookie',
      success: function(res) {
        let userName = res.data.userName;
        that.setData({
          userName: userName,
        })
        console.log("用户名")
        console.log(that.data.userName)
        let jsonData = {
          "object": {
            "object": {
              // "addUserPhone":that.data.userName,
              "addUserPhone": that.data.userName,
              "addUserType": "1",
              "addrType": that.data.addrType
            }
          }
        }
        //  "addrType": '1' //1,2

        console.log(JSON.stringify(jsonData));
        common.ajax(Api.port.queryBySearchFilter, jsonData,
          function(res) {
            wx.hideLoading()
            that.setData({
              loadingflag: false
            })
            common.unLogin(res)
            let header = res.header;
            let setcookie = header["Set-Cookie"];
            common.sessionvalid(setcookie, function() {
              if (res.data.errCode == '000000') {
                let list = res.data.object.list;
                // 第一次加载此处
                console.log(list);
                for (let i = 0; i < list.length; i++) {
                  let txt = list[i].proviceCityRegionTxt.split('-').join('');
                  list[i].done_proviceCityRegionTxt = txt;
                }
                if (list.length == 0) {
                  that.setData({
                    noaddress: true,
                    list: list,
                  })
                } else {
                  that.setData({
                    noaddress: false,
                    list: list,
                  })
                }
                // 第二次加载此处
                console.log(that.data.list);
                that.setData({
                  loadingflag: false
                })
              } else {

                wx.showToast({
                  title: res.data.errDesc,
                  icon: 'none',
                  duration: 1000,
                })
              }
            })
          },
          function(res) {
            wx.hideLoading()
            that.setData({
              loadingflag: false
            })
            console.log(res)
            if (res.error == '13') {
              wx.showToast({
                title: '请求超时',
                icon: 'none',
                duration: 1000,
              })
            } else {
              wx.showToast({
                title: res.error,
                icon: 'none',
                duration: 1000,
              })
            }
          })
      }
      //cookie获取失败
      // fail: function(res){
      //   my.alert({content: res.errorMessage});
      // }
    });

  },
  // 获取节点高度
  getRect: function() {
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#allHeight').boundingClientRect()
    query.exec(function(res) {
      let allHeight = res[0].height;
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            scrollViewHeight: res.windowHeight - allHeight
          })
        }
      })
    })
  },
  tab(e) {
    console.log(e.currentTarget.dataset.id)
    const id = e.currentTarget.dataset.id;
    const left = 250 * id;
    this.setData({
      left: left,
      currentTab: id,
      list: [],
      loadingflag: true,
      noaddress: false
    })
    //请求发件／收件地址
    let that = this;
    if (id == '1') {
      this.setData({
        addrType: 2
      })
    } else if (id == '2') {
      this.setData({
        addrType: 1
      })
    } else if (id == '0') {
      this.setData({
        addrType: ''
      })
    }

    //tab查询地址
    let jsonData = {
      "object": {
        "object": {
          // "addUserPhone":that.data.userName,
          "addUserPhone": that.data.userName,
          "addUserType": "1",
          "addrType": that.data.addrType
        }
      }
    }
    //  "addrType": '1' //1,2
    console.log(JSON.stringify(jsonData));
    common.ajax(Api.port.queryBySearchFilter, jsonData,
      function(res) {
        that.setData({
          loadingflag: false
        })
        common.unLogin(res)
        let header = res.header;
        let setcookie = header["Set-Cookie"];
        common.sessionvalid(setcookie, function() {
          if (res.data.errCode == '000000') {
            let list = res.data.object.list;
            for (let i = 0; i < list.length; i++) {
              let txt = list[i].proviceCityRegionTxt.split('-').join('');
              list[i].done_proviceCityRegionTxt = txt;
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

            console.log(that.data.list)
            that.setData({
              loadingflag: false
            })
          } else {
            wx.showToast({
              title: res.data.errDesc,
              icon: 'none',
              duration: 1000,
            })
          }
        })
      },
      function(res) {
        that.setData({
          loadingflag: false
        })
        console.log(res)
        if (res.error == '13') {
          wx.showToast({
            title: '请求超时',
            icon: 'none',
            duration: 1000,
          })
        } else {
          wx.showToast({
            title: res.error,
            icon: 'none',
            duration: 1000,
          })
        }
      })
  },
  searchInput(e) {
    // 过滤掉特殊字符
    let specialCharacter = "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]";

    function stripScript(s) {
      let pattern = new RegExp(specialCharacter)
      let rs = "";
      for (let i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
      }
      return rs;
    }
    let searchValue = stripScript(e.detail.value);
    console.log(searchValue)
    this.setData({
      searchValue: searchValue,
      // loadingflag:true,
    })
    if (e.detail.value.length == 0) {
      let that = this;
      let searchValue = that.data.searchValue;
      let jsonData = {
        "object": {
          "object": {
            "name": searchValue,
            "phone": searchValue,
            "proviceCityRegionTxt": searchValue,
            "addrDetail": searchValue,
            "addUserType": "1",
            // "active": "1",
            "addUserPhone": that.data.userName,
            "addrType": that.data.addrType
          }
        }
      }
      //  "addrType": '1' //1,2
      console.log(JSON.stringify(jsonData));
      common.ajax(Api.port.queryFromApp, jsonData,
        function(res) {
          that.setData({
            loadingflag: false
          })
          common.unLogin(res)
          let header = res.header;
          let setcookie = header["Set-Cookie"];
          common.sessionvalid(setcookie, function() {
            if (res.data.errCode == '000000') {
              let list = res.data.object.list;
              for (let i = 0; i < list.length; i++) {
                let txt = list[i].proviceCityRegionTxt.split('-').join('');
                list[i].done_proviceCityRegionTxt = txt;
              }
              if (list.length == 0) {
                that.setData({
                  list: list
                })
              } else {
                that.setData({
                  list: list,
                })
              }


              console.log(that.data.list)
              that.setData({
                loadingflag: false
              })

            } else {
              wx.showToast({
                title: res.data.errDesc,
                icon: 'none',
                duration: 1000,
              })
            }
          })
        },
        function(res) {
          that.setData({
            loadingflag: false
          })
          if (res.error == '13') {
            wx.showToast({
              title: '请求超时',
              icon: 'none',
              duration: 1000,
            })
          } else {
            wx.showToast({
              title: res.error,
              icon: 'none',
              duration: 1000,
            })
          }
        })
    }

  },
  // hideBtn(){  
  //   this.setData({
  //       showBtn:false,
  //    })
  // },
  // showBtn(){
  //   this.setData({
  //       showBtn:true,
  //    })
  // },
  searchAddress() {
    let that = this;
    that.setData({
      loadingflag: true,
    })
    let searchValue = that.data.searchValue;
    let jsonData = {
      "object": {
        "object": {
          "name": searchValue,
          "phone": searchValue,
          "proviceCityRegionTxt": searchValue,
          "addrDetail": searchValue,
          "addUserType": "1",
          // "active": "1",
          "addUserPhone": that.data.userName,
          "addrType": that.data.addrType
        }
      }
    }
    //  "addrType": '1' //1,2
    console.log(JSON.stringify(jsonData));
    common.ajax(Api.port.queryFromApp, jsonData,
      function(res) {
        that.setData({
          loadingflag: false
        })
        common.unLogin(res)
        let header = res.header;
        let setcookie = header["Set-Cookie"];
        common.sessionvalid(setcookie, function() {
          if (res.data.errCode == '000000') {
            let list = res.data.object.list;
            for (let i = 0; i < list.length; i++) {
              let txt = list[i].proviceCityRegionTxt.split('-').join('');
              list[i].done_proviceCityRegionTxt = txt;
            }
            if (list.length == 0) {
              that.setData({
                list: list
              })
            } else {
              that.setData({
                list: list,
              })
            }

            console.log(that.data.list)
            that.setData({
              loadingflag: false
            })
          } else {
            wx.showToast({
              title: res.data.errDesc,
              icon: 'none',
              duration: 1000,
            })
          }
        })
      },
      function(res) {
        that.setData({
          loadingflag: false
        })
        if (res.error == '13') {
          wx.showToast({
            title: '请求超时',
            icon: 'none',
            duration: 1000,
          })
        } else {
          wx.showToast({
            title: res.error,
            icon: 'none',
            duration: 1000,
          })
        }
      })
  },
  deleteAddress(e) {
    console.log("删除")
    let that = this;
    that.setData({
      noaddress: false,
    })
    wx.showModal({
      title: '确认要删除吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: (result) => {
        if (result.confirm) {
          //  that.setData({
          //     loadingflag:true
          //   })
          const addressmess = e.currentTarget.dataset.id.split(",");
          let addressid = addressmess[0];
          let addressuuid = addressmess[1];
          console.log('delete' + addressid)
          console.log('delete' + addressuuid)
          //删除
          let that = this;
          let jsonData = {
            "object": addressuuid
          }
          console.log(that.data.list);
          common.ajax(Api.port.remove, jsonData,
            function(res) {
              that.setData({
                loadingflag: false
              })
              common.unLogin(res)
              let header = res.header;
              let setcookie = header["Set-Cookie"];
              common.sessionvalid(setcookie, function() {
                if (res.data.errCode == '000000') {

                  let newlist = [];
                  for (let i = 0; i < that.data.list.length; i++) {
                    if (that.data.list[i].uuid != addressuuid) {
                      newlist.push(that.data.list[i])
                    }
                  }
                  for (let i = 0; i < newlist.length; i++) {
                    let txt = newlist[i].proviceCityRegionTxt.split('-').join('');
                    newlist[i].done_proviceCityRegionTxt = txt;
                  }
                  if (newlist.length == 0) {
                    that.setData({
                      noaddress: true,
                      list: newlist,
                    })
                  } else {
                    that.setData({
                      noaddress: false,
                      list: newlist,
                    })
                  }
                  //提示删除成功
                  wx.showToast({
                    icon: 'none',
                    title: '删除成功',
                    duration: 1000,
                    success: () => {},
                  });
                } else {
                  wx.showToast({
                    title: res.data.errDes,
                    icon: 'none',
                    duration: 1000,
                  })
                }
              })
            },
            function(res) {
              wx.showToast({
                title: res.errorMessage,
                icon: 'none',
                duration: 1000,
              })
            })
        }
      },
    })
  },
  editAddress(e) {

    let editAddress = this.data.list[e.currentTarget.dataset.id];
    console.log(editAddress)
    wx.setStorage({
      key: 'editAddress',
      data: {
        editAddress: editAddress,
      }
    });
    //用户地址编辑
    let edit = "../edit-myAddress/edit-myAddress?userName=" + this.data.userName;
    console.log(edit);
    wx.navigateTo({
      url: edit
    });
  },
  goDetail() {
    wx.navigateTo({
      url: '../expressDetail/expressDetail'
    });
  },
  addAddress() {
    var addrType = 2;
    if (this.data.currentTab == 2) {
      addrType = 1
    } else if (this.data.currentTab == 1) {
      addrType = 2
    }
    let vertiurl = "../add-address/add-address?userName=" + this.data.userName + '&addrType=' + addrType;
    wx.navigateTo({
      url: vertiurl
    });
  }

});