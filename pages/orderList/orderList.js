// pages/orderList/orderList.js
const $https = require('../../utils/http.js').API
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currtab: 0,//当前滑块的index
    swipertab: [{ name: '全部', id: 0 }, { name: '待付款', id: 1 }, { name: '待发货', id: 2 }, { name: '待收货', id: 3 }, { name: '已签收', id: 4 }],
    allOrderS: null,//全部订单
    waitPayOrder: null,//待付款订单
    waitSentOrder: null,//待发货订单
    waitReceivedOrder: null,//待收货订单
    completeOrder: null,//已完成订单
    ifhiddenone: false,//按钮隐藏
    ifhiddentwo: false, //按钮隐藏
    orderHandleOne:'',
    orderHandleTwo :''
  },
  getorderlist:function(){
      if (this.data.currtab === 0){
        this.data.currtab = ''
      }
      let id = this.data.currtab
      $https.getOrderlist(id).then(res =>{
        console.log(res.data)
          if (id ===''){
            this.setData({
              allOrderS:res.data.result,
              // ifhiddenone:false,//按钮隐藏
            })
            console.log(this.data.allOrderS)
          }else if(id === 1){
            this.setData({
              waitPayOrder:res.data.result,
              // ifhiddenone: true, //按钮显示
              // ifhiddentwo: true, //按钮显示
              // orderHandleOne:'取消订单',
              // orderHandleTwo:'确认付款'
            })
          }else if(id === 2){
            this.setData({
              waitSentOrder:res.data.result,
              // ifhiddenone: true, //按钮显示
              // ifhiddentwo: true, //按钮显示
              // orderHandleOne:'催TA发货',
              // orderHandleTwo:'申请退款'
            })
          }else if(id === 3){
            this.setData({
              waitReceivedOrder:res.data.result,
              // ifhiddenone: true, //按钮显示
              // ifhiddentwo: true, //按钮显示
              // orderHandleOne:'申请退款',
              // orderHandleTwo:'确认收货'
            })
          }else if(id === 4){
            this.setData({
              completeOrder:res.data.result,
              // ifhiddenone: false, //按钮隐藏
              // ifhiddentwo: true, //按钮显示
              // orderHandleTwo:'删除订单'
            })
          } 
      }).catch(res =>{
        wx.showToast({
          title: '获取信息失败',
          icon: 'error',
          duration: 2000
        });
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getorderlist();
    if (option.currtab == null || option.currtab == '') {
      option.currtab = 0
    } else {
      let tab = option.currtab
      this.setData({
        currtab: tab
      })
    }
  },
  // 导航栏切换
  tabSwitch:function(e){
    var that = this
    // console.log(e)
    let id = e.target.dataset.current
    if (this.data.currtab === id) {
      return false
      } else {
        that.setData({
        currtab: id
      })
    }
    this.getorderlist();
  },
  // 滑动切换
  onTabChange:function (e) {
    var that = this
    let id = e.target.dataset.current
    that.setData({
      currtab: id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDeviceInfo()
  },
    /*
  * 设置swiper高度，swiper本身高度限制必须重写否则里面内容过多不显示，这是swiper本身的坑。
   */
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})