// pages/confirmationOrder/confirmationOrder.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    goodsList: [],
    coupon_num: 0,
    coupon: 0,
    coupon_id: '',
    isdiscount: true,
    couponBack: 0,
    balance: 0,
    addressId: 0,
    payMethod:0,
    message:''
  },
  onLoad(op) {
    util.uploadFormIds();
    this.init();
  },
  init() {
    let orderData = wx.getStorageSync('orderData');
    this.setData({
      goodsList: orderData.orderInfo.pStatusArray,
      balance: orderData.balance,
      postage: orderData.orderInfo.postage,
      info: orderData.info
    })
    if (orderData.info != '') {
      this.setData({
        location: orderData.info.address,
        addressId: orderData.info.id,
        name: orderData.info.name,
        phone: orderData.info.mobile
      })
    }
    let goodsList = orderData.orderInfo.pStatusArray;
    let newCount = 0;
    for (var i = 0; i < goodsList.length; i++) {
      if (goodsList[i].num > 0) {
        newCount += goodsList[i].num * goodsList[i].price
      }
    }
    newCount = newCount.toFixed(2)
    this.setData({
      newCount: newCount,
      count: newCount
    })
  },
  bindTextArea(e) {
    this.setData({
      message:e.detail.value
    })
  },
  orderAddress(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    wx.navigateTo({
      url: '../myadd/myadd?isChoose=1',
    })
  },
  radioChange(e){
    let radioValue = e.detail.value;
    this.setData({
      radioValue: radioValue
    })
    let postage = Number(this.data.postage);
    let newCount = Number(this.data.newCount);  //没加邮费前
    let count = Number(this.data.count);
    if (radioValue == 2){
      newCount += postage
    }else{
      newCount = count
    }
    newCount = newCount.toFixed(2)
    this.setData({
      newCount: newCount
    })
  },
  choosePay(e) {
    let payMethod = e.detail.value;
    this.setData({
      payMethod: payMethod
    })
  },
  comfirm(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let radioValue = this.data.radioValue;
    if (!radioValue) {
      wx.showToast({
        title: '请选择你的收获方式',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let address = this.data.addressId;
    if (radioValue == 1) {
      address = 0
    }
    if (radioValue == 2) {
      if (address == 0) {
        wx.showToast({
          title: '请选择你的地址',
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    let newCount = Number(this.data.newCount);
    let balance = Number(this.data.balance);
    let payMethod = this.data.payMethod;
    if (payMethod == 1) {
      if (balance < newCount) {
        wx.showToast({
          title: '余额不足',
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    this.setData({
      disabled: true
    })
    let token = app.globalData.token;
    let message = this.data.message;
    let json = {
      note: message,
      address: address,
      type: radioValue,//1自提，2邮寄
      balance: this.data.payMethod//1是使用余额，0是微信
    }
    util.http('order/place', json, 'post', token).then(res => {
      if (res.code == 200) {
        let payType = res.data.payType;
        this.pay(res.data.order_id, token, payType)
      } else if (res.code == -1) {
        util.clear();
      }
    })
  },
  pay(id, token, payType) {
    let that = this;
    let url = ""
    if (payType == 1) {
      url = "pay/balance_pay"
    } else {
      url = "pay/wx_pay"
    }
    util.http(url, {
      order_id: id
    }, 'post', token).then(res => {
      if (payType == 1) {
        if (res.code == 200) {
          that.setData({
            disabled: false
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../payResults/payResults?payResults=1',
            })
          }, 500)
        } else if (res.code == -1) {
          util.clear();
        } else {
          setTimeout(() => {
            wx.navigateTo({
              url: '../payResults/payResults?payResults=0',
            })
          }, 500)
        }
      } else {
        wx.requestPayment({
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': res.package,
          'signType': res.signType,
          'paySign': res.paySign,
          'success': function(res) {
            that.setData({
              disabled: false
            })
            setTimeout(() => {
              wx.reLaunch({
                url: '../payResults/payResults?payResults=1',
              })
            }, 500)
          },
          'fail': function(res) {
            that.setData({
              disabled: false
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '../payResults/payResults?payResults=0',
              })
            }, 500)
          }
        })
      }
    })
  }
})