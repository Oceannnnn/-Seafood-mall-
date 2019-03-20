// pages/allorder/allorder.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    currentId: 1,
    HeaderList: [{
      name: "自提订单",
      id: 1,
      type: "1"
    }, {
      name: "邮寄订单",
      id: 2,
      type: "2"
    }],
    page: 1,
    onBottom: true,
    orderList: []
  },
  onLoad(options) {
    util.uploadFormIds();
    this.orderList(1,1);
  },
  orderList(page, type){
    let json = {
      type: type,
      size: 10,
      page: page
    }
    let list = this.data.orderList;
    let token = app.globalData.token;
    util.http('order/order_list', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            orderList: list
          })
        } else {
          if (page > 1) {
            this.data.onBottom = false;
          }
        }
      } else if(res.code==-1) {
        util.clear();
      }
    })
  },
  toList(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let id = e.currentTarget.dataset.id;
    this.setData({
      currentId: id,
      page: 1,
      onBottom: true,
      orderList: []
    })
    this.orderList(1, id)
  },
  orderDetails(e){
    let id = e.currentTarget.dataset.id;
    let type = this.data.currentId;
    wx.navigateTo({
      url: '../orderDetails/orderDetails?id='+id +'&type='+type,
    })
  },
  onReachBottom () {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.orderList(this.data.page, this.data.currentId);
    }
  },
  transfer(e) {
    let order_no = e.currentTarget.dataset.order_no;
    wx.navigateTo({
      url: '../transfer/transfer?order_no=' + order_no 
    })
  }
})