// pages/my/my.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    state:0,
    balance:0
  },
  onLoad(options) {
    util.uploadFormIds();
  },
  onShow(){
    if (app.globalData.userInfo) {
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
      this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo,
        state: app.globalData.state
      })
    }
  },
  myadd(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../myadd/myadd'
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon:"none"
      })
    }
  },
  balance(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../balance/balance'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
    }
  },
  allorder(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../allorder/allorder'
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
    }
  },
  getUserInfo(e) {
    let that = this;
    wx.login({
      success: function(msg) {
        var codeText = msg.code;
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: msg => {
                  var encryptedData = msg.encryptedData;
                  var iv = msg.iv;
                  let json = {
                    code: codeText,
                    encryptedData: encryptedData,
                    iv: iv
                  }
                  json = JSON.stringify(json)
                  util.http('login/login', json, 'post').then(data => {
                    console.log(data)
                    if (data.code == 200) {
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.state = 1;
                      app.globalData.token = data.data.token;
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          userInfo: e.detail.userInfo,
                          state: 1,
                          token: data.data.token
                        }
                      })
                      wx.showToast({
                        title: '登陆成功',
                        icon: "success",
                        duration: 1000
                      })
                      setTimeout(() => {
                        wx.reLaunch({
                          url: '../index/index'
                        })
                      }, 500)
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  }
})