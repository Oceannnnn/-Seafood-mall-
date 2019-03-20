// pages/orderDetails/orderDetails.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    shopList: []
  },
  onLoad(op) {
    util.uploadFormIds();
    this.setData({
      type:op.type
    })
    let token = app.globalData.token; 
    util.http('order/order_detail', { order_id:op.id}, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          shopList:res.data.info,
          order: res.data.order,
          id: res.data.order.order_no
        })
      } else if (res.code == -1) {
        util.clear();
      }
    })
  },
  bindRefund(){
    wx.navigateTo({
      url: '../refund/refund?id='+this.data.id,
    })
  }
})