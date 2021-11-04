// pages/mine/mine.js
const $https = require('../../utils/http.js').API
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [
      {
        typeId: 0,
        name: '待付款',
        url: 'bill',
        imageurl: '../../images/person/personal_pay.png',
      },
      {
        typeId: 1,
        name: '待收货',
        url: 'bill',
        imageurl: '../../images/person/personal_receipt.png',
      },
      {
        typeId: 2,
        name: '待评价',
        url: 'bill',
        imageurl: '../../images/person/personal_comment.png'
      },
      {
        typeId: 3,
        name: '退换/售后',
        url: 'bill',
        imageurl: '../../images/person/personal_service.png'
      }
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserProfile(){
      // 发送code到后端获取到openid和session_key加密返沪给前前端
      wx.login({
        timeout: 3000,
        success:(res) => {
          $https.getOpenid(res).then(res => {
            // 请求成功返回的数据
            app.globalData.openid = res.data.openid 
            wx.setStorageSync('openid', res.data.openid)
            // console.log(app.globalData.openid)
          })
          .catch(_res =>{
            // 请求失败
          })
        }
      })
      wx.getUserProfile({
        desc: '完善客户信息',
        lang:'zh_CN',
        success:(file) =>{
          // 获取后端返回数据
          let openid=wx.getStorageSync('openid')
          $https.getUserdetail({userInfo:file.userInfo}).then(res =>{
            console.log(res)
            getApp().globalData.userInfo = res.data.result.userinfo;
            // 请求成功返回的数据
            this.setData({
              userInfo:res.data.result.userinfo,
              hasUserInfo:true
            })
            app.globalData.userinfo=res.data.result.userinfo;
            app.globalData.userToken=res.data.result.token
            console.log(this.data.userInfo)
          }).catch(res =>{
            wx.showToast({
              title: '获取信息失败',
              icon: 'none',
              duration: 2000
            });
          })

        }
      })
    },
    myAddress:function(success){
      if (app.globalData.userToken){
        wx.navigateTo({ url: '../addressList/addressList' });
      }else{
        setTimeout(() =>{
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.switchTab({ url: '../mine/mine' })
          }, 2000)
        })
      }
    },
    allMyOrder:function(success){
      if (app.globalData.userToken){
        wx.navigateTo({ url: '../orderList/orderList' });
      }else{
        setTimeout(() =>{
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.switchTab({ url: '../mine/mine' })
          }, 2000)
        })
      }
    },
    ToaddOerder:function(success){
      if (app.globalData.userToken){
        wx.navigateTo({ url: '../orderList/orderList' });
      }else{
        setTimeout(() =>{
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.switchTab({ url: '../mine/mine' })
          }, 2000)
        })
      }
    },
  }
})
