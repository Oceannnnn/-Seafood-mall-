// pages/distributionQRCode/distributionQRCode.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {},
  onLoad(op) {
    let token = app.globalData.token;
    util.http('order/get_pic', { order_no: op.order_no}, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          image: res.data
        })
      } else if (res.code == -1) {
        util.clear();
      }
    })
  },
  //预览图片
  previewImage(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.image.split(',') // 需要预览的图片http链接列表
    })
  }
})