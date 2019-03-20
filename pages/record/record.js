// pages/record/record.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    page: 1,
    onBottom: true,
    list:[]
  },
  onLoad(options) {
    util.uploadFormIds();
    this.list(1);
  },
  list(page) {
    let list = this.data.list;
    let token = app.globalData.token;
    let json = {
      size:10,
      page:page,
      type:2
    }
    util.http('order/record', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            list: list
          })
        } else {
          if (page > 1) {
            this.data.onBottom = false;
          }
        }
      } else if (res.code == -1) {
        util.clear();
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.list(this.data.page);
    }
  }
})