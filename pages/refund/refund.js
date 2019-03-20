// pages/refund/refund.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {},
  onLoad(op) {
    util.uploadFormIds();
    this.setData({
      id: op.id
    })
    this.init(op.id)
  },
  init(id) {
    let token = app.globalData.token;
    util.http('order/refund', {
      order_no: id
    }, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          status: res.data.status
        })
      } else if (res.code == -1) {
        util.clear();
      }
    })
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  textarea(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  bindRefund() {
    wx.showModal({
      title: '退款规定',
      content: '请按照以下步骤完成退款流程：填写姓名和手机号，提交退款申请。若有疑问，请联系客服人员。',
      success(res) {}
    })
  },
  checkboxChange(e) {
    let value = e.detail.value;
    this.setData({
      checkbox: value
    })
  },
  refundBtn() {
    let name = this.data.name;
    let id = this.data.id;
    let mobile = this.data.phone;
    let checkbox = this.data.checkbox;
    let reason = this.data.reason;
    if (!reason) {
      wx.showToast({
        title: '请输原因',
        icon: "none"
      })
      return
    }
    if (!name) {
      wx.showToast({
        title: '请输入名字',
        icon: "none"
      })
      return
    }
    if (!mobile) {
      wx.showToast({
        title: '请输入电话',
        icon: "none"
      })
      return
    }
    if (!util.toCheck(mobile)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: "none"
      })
      return
    }
    if (!checkbox) {
      wx.showToast({
        title: '请勾选退款规定',
        icon: "none"
      })
      return
    }
    let token = app.globalData.token;
    let json = {
      order_no: id,
      name: name,
      mobile: mobile,
      reason: reason
    }
    util.http('order/apply_refund', json, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '提交成功',
        })
        this.init(id)
      } else {
        wx.clearStorage();
        app.globalData.state = 0;
        wx.showToast({
          title: '登陆过期,请登录',
          icon: "none"
        })
      }
    })
  }
})