// pages/voucherCard/voucherCard.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad (op) {
    this.setData({
      scene: op.scene
    })
  },
  onShow(){
    this.init()
  },
  init() {
    if (app.globalData.state == 1) {
      let token = app.globalData.token;
      let order_no = this.data.scene;
      util.http('order/donation_order', { order_no: order_no }, 'post', token).then(res => {
        if (res.code == 200) {
          this.setData({
            info:res.data,
            status: res.data.status,
            image: res.data.pic
          })
        } else if (res.code == -1) {
          util.clear();
        }
      })
    } else {
      wx.navigateTo({
        url: '../toLogin/toLogin',
      })
    }
  },
  bindCom() {
    if (app.globalData.state == 1) {
      let token = app.globalData.token;
      let order_no = this.data.scene;
      util.http('order/check_order', { order_no: order_no }, 'post', token).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '确认成功'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../index/index',
            })
          }, 500)
        } else if (res.code == -1) {
          util.clear();
        }
      })
    } else {
      wx.navigateTo({
        url: '../toLogin/toLogin',
      })
    }
  }
})