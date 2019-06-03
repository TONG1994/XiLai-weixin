function status(that) {
  wx.getStorage({
    key: 'cookie',
    success: function(res) {
      if (res.data) {
        that.setData({
          login: 'true',
        })
        if (res.data.userName) {
          that.setData({
            userName: res.data.userName,
          })
        } else {
          that.setData({
            userName: '注册／登录',
          })
        }
      } else {
        that.setData({
          login: 'false',
        })
      }

      // console.log(that.data.login)
    },
    fail: function(res) {
      console.log("检查是否登录", res.errMsg)
      that.setData({
        login: 'false',
      })
    }
  });
}

function validateUserIdCard(that) {
  wx.getStorage({
    key: 'idCard',
    success: function(res) {
      if (res.data) {
        if (res.data.idCard) {
          that.setData({
            CardValid: 'true',
            CardValidtext: '已认证'
          })
        } else {
          that.setData({
            CardValid: 'false',
            CardValidtext: '未认证'
          })
        }
      } else {
        that.setData({
          CardValid: 'false',
          CardValidtext: '未认证'
        })
      }
      // console.log(that.data.CardValid)
    },
    fail: function(res) {
      that.setData({
        CardValid: 'false',
        CardValidtext: '未认证'
      })
    }
  });
}

function navigate(url) {
  //判断是否登录，未登录跳转到登录页面
  wx.getStorage({
    key: 'cookie',
    success: function(res) {
      // console.log(res.data);
      if (!res.data) {
        // 未登录存储当前想打开的页面，登录完成后自动跳转
        wx.setStorage({
          key: 'currentnav',
          data: {
            currentnav: url,
          }
        });
        wx.navigateTo({
          url: '../login/login'
        });
      } else {
        wx.navigateTo({
          url: url
        });
      }

    },
    fail: function(res) {
      wx.navigateTo({
        url: '../login/login'
      });
      wx.setStorage({
        key: 'currentnav',
        data: {
          currentnav: url,
        }
      });
    }
  });

}

//验证cookie登录的网络请求
//funcsucss 请求成功调用，数据是res


function ajax(url, data, funcsucss, funcfail) {
  wx.getStorage({
    key: 'cookie',
    success: function(res) {
      let cookie = res.data.cookie;
      wx.request({
        url: url,
        header: {
          'Content-Type': 'application/json',
          'Cookie': cookie
        },
        method: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        success: funcsucss,
        fail: funcfail
      });
    },
    //cookie获取失败
    fail: function(res) {
      // wx.showToast({
      //   icon: 'none',
      //   title: res.errMsg,
      //   duration: 1000
      // })
    }
  });

}

function unLogin(res) {
  if (res.data.errCode === "AUTH09") {
    wx.showToast({
      title: res.data.errDesc,
      icon: 'none',
      duration: 2000,
    })
    wx.clearStorage()
    setTimeout(function() {
      wx.redirectTo({
        url: '../login/login'
      })
    }, 2000)
    return
  }
}

function sessionvalid(setcookie, func) {
  if (setcookie) {
    if (setcookie.indexOf('SESSION=') != -1 && setcookie.indexOf('SSOTOKEN=') != -1) {
      let data = setcookie.myReplace('; Path=/', ''),
        alldata = data.myReplace(',', ';')
        wx.getStorage({
          key: 'cookie',
          success: function(res) {
            let data=res.data;
            data.cookie = alldata
            wx.setStorage({
              key: 'cookie',
              data: data

            });
          }
        })
      
    }
  }
  func();
}
// 替换方法封装
String.prototype.myReplace = function(f, e) { //吧f替换成e
  var reg = new RegExp(f, "g"); //创建正则RegExp对象   
  return this.replace(reg, e);
}

Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};



module.exports = {
  navigate: navigate,
  status: status,
  validateUserIdCard: validateUserIdCard,
  ajax: ajax,
  unLogin: unLogin,
  sessionvalid: sessionvalid,

}