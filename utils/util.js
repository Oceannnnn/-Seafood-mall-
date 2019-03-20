const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 正则校验手机号
const toCheck = (str) => {
  // 定义手机号的正则
  var isMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  //拿到去除空格后的手机号
  // 校验手机号
  return isMobile.test(str);
}
const u = "https://sf.fqwlkj.cn/api/"
const http = (url, data = {}, method = 'get', token = '') => {
  const allUrl = u + url;
  return new Promise(function(resolve, reject) {
    wx.request({
      url: allUrl,
      data: data,
      method: method ? method : 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      }
    })
  })
}

const collectFormIds = (formId) => {
  let formIds = app.globalData.globalFormIds; // 获取全局推送码数组
  if (formId == undefined) return
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  let data = {
    form_id: formId,
    expire_time: timestamp + 60480000 // 7天后的过期时间戳
  }
  formIds.push(data);
  app.globalData.globalFormIds = formIds;
}

const uploadFormIds = () => {
  var formIds = app.globalData.globalFormIds; // 获取全局推送码
  if (formIds.length) {
    formIds = JSON.stringify(formIds); // 转换成JSON字符串
    let token = app.globalData.token;
    http('pay/saveFormIds', {
      formid_arr: formIds
    }, 'post', token).then(res => {
      if (res.code == 200) {
        app.globalData.globalFormIds = []; // 清空当前全局推送码
      }
    })
  }
}
const clear = () => {
  wx.clearStorage();
  app.globalData.state = 0;
  wx.showToast({
    title: '登陆过期,请登录',
    icon: "none"
  })
}
const unique = (arr) => { //去重
  // 遍历arr，把元素分别放入tmp数组(不存在才放)
  var tmp = new Array();
  for (var i in arr) {
    //该元素在tmp内部不存在才允许追加
    if (tmp.indexOf(arr[i]) == -1) {
      tmp.push(arr[i]);
    }
  }
  return tmp;
}
const uniqueObject = (array) => { //对象去重
  var allArr = []; //建立新的临时数组
  for (var i = 0; i < array.length; i++) {
    var flag = true;
    for (var j = 0; j < allArr.length; j++) {
      if (array[i].priceId == allArr[j].priceId) {
        flag = false;
      };
    };
    if (flag) {
      allArr.push(array[i]);
    };
  };
  return allArr;
}

const indexOfObject = (arr, valArr) => { //删除指定数组的元素
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < valArr.length; j++) {
      if (arr[i].priceId == valArr[j].priceId) return i;
    }
  }
  return -1;
}

const removeObject = (arr, valArr) => { //删除指定数组的元素
  var tmp = new Array();
  var index = indexOfObject(arr, valArr);
  if (index > -1) {
    arr.splice(index, 1);
    tmp = arr
  }
  return tmp;
}

const indexOf = (arr, val) => { //删除指定数组的元素
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) return i;
  }
  return -1;
}

const remove = (arr, val) => { //删除指定数组的元素
  var tmp = new Array();
  var index = indexOf(arr, val);
  if (index > -1) {
    arr.splice(index, 1);
    tmp = arr
  }
  return tmp;
}
module.exports = {
  clear: clear,
  formatTime: formatTime,
  http: http,
  toCheck: toCheck,
  collectFormIds: collectFormIds,
  uploadFormIds: uploadFormIds,
  remove: remove,
  uniqueObject: uniqueObject,
  unique: unique,
  removeObject: removeObject,
}