// pages/classify/classify.js
const $https = require('../../utils/http.js').API
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyItems:null,
    littleclassifyItems:null,
    curNav: 1,
    curIndex: 0
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值
    console.log(e)
    let id = e.target.dataset.id,
    index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    var that=this
    $https.getclickclassifyShow(id).then(res =>{
      console.log(res)
      that.setData({
        littleclassifyItems:res.data.result,
        curIndex:index,
        curNav:id
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.classifyShow();
    that.clickclassifyShow();
  },
  classifyShow: function (success) {
    var that=this
    $https.getclassifyShow().then(res =>{
      that.setData({
        classifyItems:res.data.result,
        
      })
    })
    
  },
  clickclassifyShow:function(){
    var that=this
    $https.getclickclassifyShow(that.data.curNav).then(res =>{
      console.log(res)
      that.setData({
        littleclassifyItems:res.data.result
      })
    })
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
})