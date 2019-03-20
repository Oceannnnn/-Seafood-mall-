// pages/abstract/abstract.js
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {},
  onLoad(op) {
    util.uploadFormIds();
    util.http('home/company', {}, 'get').then(res => {
      this.setData({
        imgUrls: res.data.banners
      })
      let details = res.data.content.content;
      WxParse.wxParse('details', 'html', details, this, 0)
    })
  }
})