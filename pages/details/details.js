// pages/details/details.js
const util = require('../../utils/util.js')
const app = getApp()
const WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    imgUrl: [],
    index:0,
    count:0.00,
    allNum:0,
    shopList: [],
    hidden:false
  },
  onLoad(op) {
    util.uploadFormIds();
    this.setData({
      id:op.id
    })
    wx.setNavigationBarTitle({
      title: op.name,
    })
    this.init(op.id)
  },
  init(id) {
    util.http('goods/cate', {id:id}, 'post').then(res => {
      let list = res.data.list;
      let header_img = '';
      let img_id = '';
      let goodList = [];
      for (var i = 0; i < list.length; i++){
        if (list[i].default == 1) {
          header_img = list[i].image;
          img_id = list[i].id;
          goodList = list[i].goods_list;
        }
      }
      this.setData({
        shopList: list,
        header_img: header_img,
        goodList: goodList,
        img_id: img_id
      })
    })
  },
  infoDetails(e) {
    let formId = e.detail.formId;
    util.collectFormIds(formId);
    let index = e.currentTarget.dataset.index;
    let goodList = this.data.goodList;
    let infoImg = goodList[index].original_img;
    let infoPrice = goodList[index].shop_price;
    let oldPrice = goodList[index].olr_price;
    let infoName = goodList[index].goods_name;
    let details = goodList[index].goods_content;
    this.setData({
      infoImg: infoImg,
      infoPrice: infoPrice,
      oldPrice:oldPrice,
      infoName: infoName
    })
    WxParse.wxParse('details', 'html',details , this, 0)
    this.close()
  },
  close() {
    this.setData({
      hidden: !this.data.hidden
    })
  },
  bindImg(e){
    let shopList = this.data.shopList;
    let index = e.currentTarget.dataset.index;
    let img = shopList[index].image;
    for (var i = 0; i < shopList.length; i++) {
      shopList[i].default = 0;
    }
    shopList[index].default = 1;
    let goodList = shopList[index].goods_list;
    let img_id = shopList[index].id;
    this.setData({
      index: index,
      header_img: img,
      img_id: img_id,
      goodList: goodList,
      shopList: shopList,
      count: 0,
      allNum: 0
    })
  },
  bindJia(e) {
    let num = e.currentTarget.dataset.num;
    let stock = e.currentTarget.dataset.stock;//库存
    if (num < stock) {
      num++
    }else{
      wx.showToast({
        title: '库存不足',
        icon:'none'
      })
    }
    this.comfirm(e, num);
  },
  bindJian(e) {
    let num = e.currentTarget.dataset.num;
    if (num == 0) {
      return
    } else {
      num--
    }
    this.comfirm(e, num);
  },
  bindblur(e) {
    let stock = e.currentTarget.dataset.stock;//库存
    let num = e.detail.value; 
    if (num > stock) {
      num = stock
    }
    this.comfirm(e, num);
  },
  comfirm(e, num) {
    let index = e.currentTarget.dataset.index;
    let goodList = this.data.goodList;
    goodList[index].num = num;
    this.setData({
      goodList: goodList
    })
    this.count();
  },
  count() {
    let goodList = this.data.goodList;
    let newCount = 0;
    let allNum = 0;
    for (var i = 0; i < goodList.length; i++) {
      if (goodList[i].num > 0) {
        newCount += goodList[i].num * goodList[i].shop_price
      }
    }
    newCount = newCount.toFixed(2)
    for (var i = 0; i < goodList.length; i++) {
      if (goodList[i].num > 0) {
        allNum += parseInt(goodList[i].num)
      }
    }
    allNum = allNum.toFixed(2)
    this.setData({
      count: newCount,
      allNum: allNum
    })
  },
  comBtn(e) {
    let type = e.currentTarget.dataset.type;
    let goodList = this.data.goodList;
    let arr = [];
    for (var i = 0; i < goodList.length; i++) {
      if (goodList[i].num > 0) {
        let json = {};
        json.goods_id = goodList[i].goods_id;
        if (type == 1) {
          json.count = goodList[i].num;
        } else {
          json.num = goodList[i].num;
        }
        arr.push(json)
      }
    }
    arr = JSON.stringify(arr);
    let state = app.globalData.state;
    if (state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: "none"
      })
      return
    }
    let token = app.globalData.token;
    if (type == 1) {//购买
      util.http('order/add', { goods: arr }, 'post', token).then(res => {
        if (res.code == 200) {
          wx.removeStorageSync('orderData');
          wx.setStorage({
            key: "orderData",
            data: res.data
          })
          wx.navigateTo({
            url: '../confirmationOrder/confirmationOrder',
          })
        } else if (res.code == -1) {
          util.clear();
        }
      })
    } else {
      util.http('cart/add', { goods: arr}, 'post', token).then(res => {
        if (res.code == 200) {
         wx.showToast({
           title: '加入成功！'
         })
        } else if (res.code == -1) {
          util.clear();
        }
      })
    }
  }
})