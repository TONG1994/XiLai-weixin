const common = require("../../utils/common.js");
const app = getApp();
const Api = require('../../utils/api.js')

Page({
  data: {},
  onLoad(query){
    if (query.uuid) {
      this.setData({
        uuid: query.uuid
      })
    }
  },
//通过拍照
  toPhoto() {
    let uuid = this.data.uuid;
    console.log("verified"+uuid)
    wx.chooseImage({
      count: 1,
      success(res) {
        let img = res.tempFilePaths[0];
        console.log(img);
        wx.getStorage({
          key: 'cookie',
          success: function(res) {
            let cookie = res.data.cookie;
            wx.showLoading({
              title: '上传中',
            })

            setTimeout(function () {
              wx.hideLoading()
            }, 9000)
            wx.uploadFile({
              url: Api.api.url+'/idCardAuth/getIdCardInfoByOCR',
              header: {
                'cookie': cookie
              },
              name: 'image',
              filePath: img,
              success(res) {
                let data = res.data;
                let objectData = JSON.parse(data);
                if (objectData.errCode === '000000') {
                  let realName = objectData.object.name;
                  let idCardNo = objectData.object.idCard;
                  if (idCardNo === '' || idCardNo === null || realName === '' || realName === null) {
                    wx.showToast({
                      title: '解析失败',
                      icon: 'none',
                    })
                  } else {
                    wx.navigateTo({ url: '../realname/realname?realName=' + realName + '&idCardNo=' + idCardNo + "&uuid=" + uuid })
                  }
                } else {
                  wx.showToast({
                    title: '解析失败',
                    icon: 'none',
                  })
                }
              },
              fail(res) {
                wx.showToast({
                  title: '解析失败',
                  icon: 'none',
                })
              }
            })

          },
        })

      },
      fail(res){
        if (res.errMsg == "chooseImage:fail:system permission denied"){
          wx.showToast({
            title: '暂无相机权限',
            icon: 'none',
          })
        }
      }
    })
  },

  //通过填写
  toFill() {
    common.navigate('../realname/realname?uuid=' + this.data.uuid);
  }
});