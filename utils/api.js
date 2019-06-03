const ERROR = '000000'
const api = {
  // 生产环境
  // url: 'https://smallapp.xilaikd.com/xilaisender_s',
  // url2: 'https://smallapp.xilaikd.com/xilaimanager_s',

  // 测试环境
  // url: "https://smallapp-cs.xilaikd.com/xilaisender_s",
  // url2: "https://smallapp-cs.xilaikd.com/xilaimanager_s",


  // 开发环境
  url: "http://game.icerno.com/xilaisender_s",
  url2: "http://game.icerno.com/xilaimanager_s"
  // url: "http://10.10.10.166:1880",
  // url2: "http://10.10.10.166:1882",
}
const port = {
  createVerificationCode: api.url + '/user/createVerificationCode',
  userLogin: api.url + '/login/userLogin',
  validateUserIdCard: api.url + '/idCardAuth/validateUserIdCard',
  senderOrder: api.url + '/order/senderOrder',
  queryBySearchFilter: api.url + '/addressBook/queryBySearchFilter',
  queryFromApp: api.url + '/addressBook/queryFromApp',
  remove: api.url + '/addressBook/remove',
  createAddress: api.url + '/addressBook/create',
  updateAddress: api.url + '/addressBook/update',
  queryUserOrderList: api.url + '/expressOrderDetail/queryUserOrderList',
  getByLogisticsNo: api.url + '/route/getByLogisticsNo',
  userCancelOrder: api.url + '/order/userCancelOrder',
  findCourierByUuid: api.url + '/user/findCourierByUuid',
  getCityNames: api.url + '/addressBook/getCityNames',
  senderAddressCheck: api.url+ '/user/senderAddressCheck',
  receiverAddressCheck: api.url +  '/user/receiverAddressCheck',
  createOpenid: api.url + '/order/createOpenid',
  createFromId: api.url + '/order/createFromId',
  selectByUuid: api.url + '/expressOrderDetail//selectByUuid',
  getByCourierUuid: api.url2 + '/organization/getByCourierUuid',
  findCourierByUuid: api.url2 + '/user/findCourierByUuid',
}
module.exports = {
  api: api,
  port: port,
  ERROR: ERROR
}