// pages/goodsdetail/goodsdetail.js
const $https = require('../../utils/http.js').API
//获取应用实例
const app = getApp();
var goodsId = null;
var slideshowImg = [];  
var detailImg = [];
var goodsit = null;
var goods = null;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    isLike: false,
    showDialog: false,
    goods:null,
    indicatorDots:true, //是否显示面板指示点
    autoplay:true, //是否自动切换
    interval:3000, //自动切换时间间隔,3s
    duration:1000, //  滑动动画时长1s
  },
  // 收藏
  addLike(){
    if (app.globalData.userToken){
      this.setData({
        isLike:true
        // 发送收藏接口
      })
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
  // 跳到购物车
  toCar() {
    if (app.globalData.userToken){
      wx.switchTab({ url: '../cart/cart' })
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
  // 立即购买
  immeBuy() {
    if(app.globalData.userToken){
      // 获取用户地址id
      let arr = wx.getStorageSync('addressList');
      // 获取商品id
      let good_id = String(this.data.goods.goodsId)
      console.log(good_id)
      // 获取商品购买数量
      let count = String(this.data.goods.count)
      // 获取商品价格
      let pay_price = this.data.goods.totalMoney
      // 获取商品标题
      let order_title = 'KonwGoods'
      if (arr === ''){
        setTimeout(() =>{
          wx.showToast({
            title: '请先添加地址',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.switchTab({ url: '../mine/mine' })
          }, 2000)
        })
      }else{
        $https.getpayUrl({"order_addr":arr[0].user,"pay_num":{[good_id]:count},"order_title":order_title,"pay_price":pay_price}).then(res =>{
          var  pay_url = res.data.pay_url
          console.log(pay_url)
          wx.showModal({
            title:'由于特殊原因，请复制以下链接打开浏览器扫码支付',
            content:pay_url,
            cancelText:'取消',
            cancelColor: "66ff66",
            confirmText:'点我复制',
            confirmColor:'ff0066',
            success(res) {
              if (res.confirm) {
                wx.setClipboardData({
                  data:pay_url,
                  success(res) {wx.getClipboardData({
                    success(res) {
                      console.log(res.data) // data
                    }
                  })
                  }
                })
              }
            }
          })
        }).catch(res =>{
          wx.showToast({
            title: res.data.detail,
            icon:'error',
            duration:2000
          })
        })
      }
      
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    goodsId = options.goodsId;
    that.goodsDetailShow();
  },
  // 商品详情函数
  goodsDetailShow:function(success) {
    var that=this
    $https.getgoodsDetailShow(goodsId).then(res =>{
      console.log(res)
      goodsit = res.data.detail
      var goodsItem = res.data
      for(var i = 0; i < goodsItem.slideshow.length; i++){
        slideshowImg[i] = goodsItem.slideshow[i].detail_slideshow;
        // slideshowImg = res.data.slideshow
      }
      for(var i = 0; i < goodsItem.detailimg.length; i++){
        detailImg[i]=goodsItem.detailimg[i].detail_img;
        // detailImg = res.data.detailimg
      }
      // that.
      console.log(slideshowImg)
      var goods = {
        // 商品轮播图
        slideshowImg: slideshowImg,
        // 商品详情图片
        detailImg: detailImg,
        // 商品标题
        title: goodsit.get_detail.title,
        // 商品现价格
        price: goodsit.price,
        // 商品原价格
        privilegePrice: goodsit.privilegePrice,
        // 商品id
        goodsId: goodsId,
        // 商品信息
        goodsit:goodsit,
        // 销量
        buyRate:goodsit.get_detail.stock,
        // 初始数量
        count:1,
        // 加购物车的价格（含数量计算）
        totalMoney: goodsit.price,
        
      }
      // console.log(slideshowImg)
      // console.log(detailImg)
      console.log(goods)
      that.setData({
        goods:goods
      })
    }).catch(res =>{
      console.log(res)
      wx.showToast({
        title: res.data.detail,
        icon: 'error',
        duration: 2000
      });
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

  },
  // 加入购物车弹出
  toggleDialog: function () {
    if(app.globalData.userToken){
      this.setData({
        showDialog: !this.data.showDialog
      });
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
  // 关闭
  closeDialog: function () {
    console.info("关闭");
    this.setData({
      showDialog: false
    });
  },
   // 减数 
  delCount: function (e) {
    console.log("减1");
    var count = this.data.goods.count;
    // 商品总数量-1
    if (count > 1) {
      this.data.goods.count--;
    }
    // 将数值与状态写回  
    this.setData({
      goods: this.data.goods
    });
    this.priceCount();
  },
    // 加数
  addCount: function (e) {
      console.log("加1");
      var count = this.data.goods.count;
      // 商品总数量-1  
      if (count < 10) {
        this.data.goods.count++;
      }
      // 将数值与状态写回  
      this.setData({
        goods: this.data.goods
      });
      this.priceCount();
  },
  // 价格计算
  priceCount: function (e) {
      this.data.goods.totalMoney = this.data.goods.price * this.data.goods.count;
      this.setData({
        goods: this.data.goods
      })
  },
  // 加入购物车
  addCar: function (e) {
    var goods = this.data.goods;
    goods.isSelect=false;
    var count = this.data.goods.count;
    var title = this.data.goods.title;
    if (title.length > 13) {
      goods.title = title.substring(0, 13) + '...';
    }

    // 获取购物车的缓存数组（没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    console.log("arr,{}", arr);
    if (arr.length > 0) {
      // 遍历购物车数组  
      for (var j in arr) {
        // 判断购物车内的item的id，和事件传递过来的id，是否相等  
        if (arr[j].goodsId == goodsId) {
          // 相等的话，给count+1（即再次添加入购物车，数量+1）  
          arr[j].count = arr[j].count + 1;
          // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）  
          try {
            wx.setStorageSync('cart', arr)
          } catch (e) {
            console.log(e)
          }
          //关闭窗口
          wx.showToast({
            title: '加入购物车成功！',
            icon: 'success',
            duration: 2000
          });
          this.closeDialog();
          // 返回（在if内使用return，跳出循环节约运算，节约性能） 
          return;
        }
      }
      // 遍历完购物车后，没有对应的item项，把goodslist的当前项放入购物车数组  
      arr.push(goods);
    } else {
      arr.push(goods);
    }
    // 最后，把购物车数据，存放入缓存  
    try {
      // 返回（在if内使用return，跳出循环节约运算，节约性能） 
      // 向后端发送添加接口
      // 获取商品id
      let good_id = String(this.data.goods.goodsId)
      // 获取商品购买数量
      let count = String(this.data.goods.count)
      $https.getAddCartGood({"productgood":good_id,"productgood_num":count,"user":app.globalData.openid}).then(res =>{
        //关闭窗口
        wx.setStorageSync('cart', arr)
        wx.showToast({
        title: '加入购物车成功！',
        icon: 'success',
        duration: 2000
        });
        this.closeDialog(); 
        return;
      }).catch(res =>{
        wx.showToast({
          title: '加入购物车失败！',
          icon: 'error',
          duration: 2000
          });
      })
      
    } catch (e) {
      console.log(e)
    } 
  }
})