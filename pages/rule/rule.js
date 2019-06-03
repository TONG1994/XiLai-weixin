const common = require("../../utils/common.js");
const app = getApp();

Page({
  data: {
  },
  onShow() {
    common.validateUserIdCard(this);
  },
  logout() {
    my.clearStorage();
    my.navigateBack({
      delta: 3
    })
  },
  certificate() {
    my.navigateTo({ url: '../certificate/certificate' });
  }
});
