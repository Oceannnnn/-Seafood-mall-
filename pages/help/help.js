const app = getApp()
const util = require('../../utils/util.js')
const WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {},
  onLoad(op) {
    util.uploadFormIds();
    util.http('about/help_info', { id: op.id }, 'post').then(res => {
      wx.setNavigationBarTitle({
        title: res.data.title,
      })
      let details = res.data.content;
      WxParse.wxParse('details', 'html', details, this, 0)
    })
  },
})