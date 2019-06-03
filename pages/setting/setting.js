const common = require("../../utils/common.js");
const app = getApp();

Page({
  data: {
  },
  onShow() {
    common.validateUserIdCard(this);
  },
  logout() {
    wx.clearStorage();
    wx.switchTab({
      url: '../home/home'
    })
  },
  certificate() {
    wx.navigateTo({ url: '../verified/verified' });
  }
});
