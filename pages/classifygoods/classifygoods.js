// pages/classifygoods/classifygoods.js
const $https = require('../../utils/http.js').API
var classifyId = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewgooddata:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classifyId = options.classifyId
    console.log('classifyId:' + classifyId);
    var that = this;
    that.previewgoodShow();
  },
  previewgoodShow:function(success){
    var that=this
    $https.getpreviewgoodShow(classifyId).then(res =>{
      console.log(res)
      that.setData({
        previewgooddata:res.data.result
      })
    })
  },
  catchTapCategory: function (e) {
    var goodsId = e.currentTarget.dataset.goodsid;
    console.log('goodsId:' + goodsId);
    //跳转商品详情
    wx.navigateTo({ url: '../goodsdetail/goodsdetail?goodsId=' + goodsId })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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