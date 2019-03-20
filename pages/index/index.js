//index.js
const util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    imgUrls: [],
    list: []
  },
  onLoad(op) {
    this.init();
    this.scene(op);
    this.getCompanyConfig();
  },
  scene(op) {
    let scene = '';
    if (op.scene) {
      scene = decodeURIComponent(op.scene);
      wx.navigateTo({
        url: '../voucherCard/voucherCard?scene=' + scene,
      })
    }
  },
  init() {
    util.http('home/info', {}, 'get').then(res => {
      this.setData({
        imgUrls: res.data.banners,
        notice: res.data.notice
      })
    })
    util.http('home/cate', {}, 'get').then(res => {
      this.setData({
        list: res.data
      })
    })
  },
  bindInputChange(e) {
    let value = e.detail.value;
    util.http('goods/search', {
      keywords: value
    }, 'post').then(res => {
      if (res.code == 200) {
        let id = res.data.id;
        let name = res.data.name;
        wx.navigateTo({
          url: '../details/details?id=' + id + '&name=' + name
        })
      } else {
        wx.showModal({
          content: '未搜索到相关商品',
        })
      }
    })
  },
  details(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../details/details?id=' + id + '&name=' + name
    })
  },
  getCompanyConfig() {
    let token = app.globalData.token;
    util.http('about/index', {}, 'get', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        app.globalData.address = info.address;
        app.globalData.latitude = info.latitude;
        app.globalData.longitude = info.longitude;
        app.globalData.name = info.name;
        app.globalData.phone = info.mobile;
        app.globalData.logo = info.logo;
        app.globalData.qrcode = info.qrcode;
        app.globalData.content = info.content;
      }
    })
  },
  abstract(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    wx.navigateTo({
      url: '../abstract/abstract'
    })
  },
  onShareAppMessage() {
    return {
      title: '分享不仅仅是一种生活，更是收获',
      path: '/pages/index/index'
    }
  }
})