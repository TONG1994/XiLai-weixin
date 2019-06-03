const common = require("../../utils/common.js");
const app = getApp();

Page({
  data: {
    inputValue: '',
  },
  onShow() {
    common.status(this);
    common.validateUserIdCard(this);
  },
  login() {
    if (this.data.login == 'false') {
      common.navigate('../login/login');
    }
  },
  certificate() {
    common.navigate('../verified/verified');
  },
  myExpress() {
    common.navigate('../myExpress/myExpress');
  },
  address() {
    common.navigate('../address/my-address?index=0');
  },
  // coupon() {
  //   common.navigate('../coupon/coupon');
  // },
  set() {
    common.navigate('../setting/setting');
  },
  phonecall() {
    wx.makePhoneCall({
      phoneNumber: '021-52658180'
    })
  },
  about() {
    common.navigate('../about/about');
  }
});