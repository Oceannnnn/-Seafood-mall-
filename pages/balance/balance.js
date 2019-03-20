// pages/balance/balance.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    balance: 0
  },
  onLoad() {
    util.uploadFormIds();
  },
  onShow() {
    let token = app.globalData.token;
    util.http('user/info', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          balance: res.data.balance
        })
      } else if (res.code == -1) {
        util.clear();
      }
    })
  }
})