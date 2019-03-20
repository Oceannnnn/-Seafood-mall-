const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    page: 1,
    onBottom: true,
    help: []
  },
  onLoad() {
    util.uploadFormIds();
    this.help(1)
  },
  help(page) {
    let json = {
      size: 10,
      page: page
    }
    let list = this.data.help;
    util.http('about/help', json, 'post').then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            help: list
          })
        } else {
          if (page > 1) {
            this.data.onBottom = false;
          }
        }
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.help(this.data.page);
    }
  }
})