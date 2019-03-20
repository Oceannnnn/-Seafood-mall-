const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {},
  onLoad() {
    util.uploadFormIds();
    this.setData({
      name: app.globalData.name,
      phone: app.globalData.phone,
      address: app.globalData.address,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      logo: app.globalData.logo,
      qrcode: app.globalData.qrcode,
      markers: [{
        iconPath: "../../images/add.png",
        id: 0,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        width: 30,
        height: 30
      }]
    })
  },
  toCall(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  toHelp(){
    wx.navigateTo({
      url: '../helpList/helpList',
    })
  },
  toPosition() {
    wx.openLocation({
      latitude: Number(this.data.latitude),
      longitude: Number(this.data.longitude),
      name: this.data.address,
      scale: 15
    })
  }
})