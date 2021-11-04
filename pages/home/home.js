// pages/home1/home1.js
const $https = require('../../utils/http.js').API
var sectionData = [];
var ifLoadMore = null;
var nextUrl=null; // 下一页数据url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbars:null,
    banners:null,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    brands: null,
    hidden:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //加载navbar导航条
    that.navbarShow();
    //加载banner轮播
    that.bannerShow();
    //加载新品特卖
    that.brandShow();
    //加载福利专场
    that.newGoodsShow();
    // 加载福利专场更多
    // that.getnewGoodsShow();
  },
  // 导航切换监听
  navbarTap: function (e) {
    console.debug(e);
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  //加载navbar导航条
  navbarShow:function(success){
    var that=this
    $https.getnavbarShow().then(res =>{
      console.log(res)
      that.setData({
        navbars:res.data.result
      })
      // console.log(res.data.result)
    })
  },
  //加载banner轮播
  bannerShow:function(success){
    var that=this
    $https.getbannerShow().then(res =>{
      console.log(res)
      that.setData({
        banners:res.data.result
      })
      console.log(res.data.result)
    })
  },
  //加载新品特卖
  brandShow:function(success){
    var that=this
    $https.getbrandShow().then(res =>{
      console.log(res)
      that.setData({
        brands:res.data.result
      })
      console.log(res.data.result)
    })
  },
  //加载福利专场初始
  newGoodsShow:function(success){
    var that=this
    $https.getnewGoodsShow().then(res => {
      console.log(res)
      var newGoodsData = res.data.results
      var next = res.data.next
      // console.log(next)
      sectionData['newGoods'] = newGoodsData
      nextUrl = next
      that.setData({
        nextUrl:nextUrl,
        newGoods:sectionData['newGoods'],
      })
    })
  },
  // 加载福利专场更多
  getnewGoodsShowmore:function(success){
    var that = this
    wx.request({
      url: nextUrl,
      method:'GET',
      header: {
        "Content-Type": "application/json",
      },
      success:res =>{
        var newGoodsData = res.data.results
        var next = res.data.next
        nextUrl = next
        if (ifLoadMore){
          if(newGoodsData.length>0){
            console.log(newGoodsData)
            sectionData['newGoods'] = sectionData['newGoods'].concat(newGoodsData);
          }
        }else{
          if (ifLoadMore == null){
            ifLoadMore = true
            sectionData['newGoods'] = sectionData['newGoods'].concat(newGoodsData);//刷新
          }
        }
        that.setData({
          newGoods: sectionData['newGoods'],
          nextUrl:nextUrl,
          // isHideLoadMore: true
        });
        wx.stopPullDownRefresh();//结束动画
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  catchTapCategory: function (e) {
    var that = this;
    console.log(e)
    var goodsId = e.currentTarget.dataset.goodsid;
    //跳转商品详情
    wx.navigateTo({ url: '../goodsdetail/goodsdetail?goodsId=' + goodsId })
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
    var that = this;
    console.log(nextUrl)
    console.log('加载更多');
    if (nextUrl){
      that.getnewGoodsShowmore();
    }else{
      wx.showToast({
        title: '暂无更多内容！',
        icon: 'none',
        duration: 2000
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})