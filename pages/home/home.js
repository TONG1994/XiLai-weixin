const common = require("../../utils/common.js");
const app = getApp();
const Api = require("../../utils/api.js");

Page({
  data: {},
  onLoad(options) {
    let openidData = wx.getStorageSync('openid');
    if (openidData) {
      console.log(1)
      app.globalData.openid = openidData;//设置全局变量openid
    }
    var that = this;
    //扫快递员二维码启动页面下单时
    // console.log(options)
    if (options.q) {
      let q = options.q
      let url = decodeURIComponent(q)
      console.log(url)
      let uuid = url.split('?')[1].split('&')[0].split('=')[1]
      console.log(uuid)
      //有启动参数，判断是否登陆，未登录跳转到登录页面，登录跳转到发快递页面
      var sendurl = "../sendExpress/sendExpress?uuid=" + uuid;
      var certiurl = "../verified/verified?uuid=" + uuid;
      let currentnav = wx.getStorageSync('cookie');
      if (!currentnav) {
        // 未登录存储当前想打开的页面，登录完成后自动跳转
        wx.setStorage({
          key: 'currentnav',
          data: {
            currentnav: sendurl,
          }
        });
        wx.navigateTo({ url: '../login/login' })
      } else {
        wx.getStorage({
          key: 'idCard',
          success: function (res) {
            if (res.data.idCard) {
              console.log('app.js已认证')
              wx.navigateTo({ url: sendurl });
            } else {
              console.log('app.js未认证')
              wx.navigateTo({ url: certiurl });
            }
            // console.log(that.data.CardValid)
          },
        });
        //点击send如果未认证需要认证，认证成功自动跳到sendexpress
      }
    }
  },
  onShow() {
    common.validateUserIdCard(this);
  },
  sendExpress(e) {
    //按钮点击
    let that = this;
    wx.getStorage({
      key: 'cookie',
      success: function(res) {
        // console.log(res.data);
        if (!res.data) {
          // 未登录存储当前想打开的页面，登录完成后自动跳转
          wx.setStorage({
            key: 'currentnav',
            data: {
              currentnav: '../sendExpress/sendExpress',
            }
          });
          wx.navigateTo({
            url: '../login/login'
          });
        } else {
          //登陆成功才能存储formid;
          let formId = e.detail.formId
          if (app.globalData.openid){
            that.saveformid(formId);
          }
       
          if (that.data.CardValid == 'false') {
            console.log('cardvalidfail')
            wx.setStorage({
              key: 'currentnav',
              data: {
                currentnav: '../sendExpress/sendExpress',
              }
            });
            wx.navigateTo({
              url: '../verified/verified'
            });
          } else {
            console.log('CardValidtrue')
            wx.navigateTo({
              url: '../sendExpress/sendExpress'
            });
          }
        }

      },
      fail: function(res) {
        wx.setStorage({
          key: 'currentnav',
          data: {
            currentnav: '../sendExpress/sendExpress',
          }
        });
        wx.navigateTo({
          url: '../login/login'
        });
      }
    });
  },
  saveformid(formId){
    //保存fromid
    let openid = app.globalData.openid;
    let userUuid = wx.getStorageSync('userUuid');
    if (formId =="the formId is a mock one"){
      return
    }
    let formidJsonData = { "object": { "formid": formId, "openid": openid, "userUuid": userUuid } } 
    console.log('home-formidJsonData-' + JSON.stringify(formidJsonData))
    common.ajax(Api.port.createFromId, formidJsonData,
    function (res) {
      if (res.data.errCode == '000000') {
        console.log('formid存储成功')
      } else {
        console.log('formid失败')
        console.log(res.data.object)
      }
    },
    function (res) {
    })
  },
  expressRecord() {
    common.navigate('../myExpress/myExpress');
    // my.navigateTo({ url: '../myExpress/myExpress' });
  },
  certificate() {
    common.navigate('../verified/verified');
    // my.navigateTo({ url: '../certificate/certificate' });
  }
});