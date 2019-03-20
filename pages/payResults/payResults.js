// pages/payResults/payResults.js
Page({
  data: {},
  onLoad(op) {
    let text = "支付成功";
    if (op.payResults==0){
      text = "支付失败"
    } 
    this.setData({
      payResults: op.payResults,
      text: text
    })
  },
  bindtap(){
    wx.navigateTo({
      url: '../allorder/allorder'
    })
  },
  back() {
    wx.navigateBack()
  }
})