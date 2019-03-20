//app.js
App({
  onLaunch () {
    if (wx.getStorageSync('httpClient')) {
      this.globalData.state = wx.getStorageSync('httpClient').state;
      this.globalData.userInfo = wx.getStorageSync('httpClient').userInfo;
      this.globalData.token = wx.getStorageSync('httpClient').token;
    }
  },
  globalData: {
    userInfo: null,
    globalFormIds:[],
    state:0
  }
})