// pages/cart/cart.js
const $https = require('../../utils/http.js').API
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [], //数据 
    iscart: false,
    hidden: null,
    isAllSelect: false,
    totalMoney: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
    var arr = wx.getStorageSync('cart') || [];
    console.info("缓存数据："+arr);
    // 有数据的话，就遍历数据，计算总金额 和 总数量  
    if (arr.length > 0) {
      // 更新数据  
      this.setData({
        carts: arr,
        iscart: true,
        hidden: false
      });
      console.info("缓存数据：" + this.data.carts);
    }else{
      this.setData({
        iscart: false,
        hidden: true,
      });
    }
  },

  //勾选事件处理函数  
  switchSelect: function (e) {
    // 获取item项的id，和数组的下标值  
    var Allprice = 0, i = 0;
    let id = e.target.dataset.id,

      index = parseInt(e.target.dataset.index);
    this.data.carts[index].isSelect = !this.data.carts[index].isSelect;
    //价钱统计
    if (this.data.carts[index].isSelect) {
      this.data.totalMoney = this.data.totalMoney + (this.data.carts[index].price * this.data.carts[index].count);
    }
    else {
      this.data.totalMoney = this.data.totalMoney - (this.data.carts[index].price * this.data.carts[index].count);
    }
    //是否全选判断
    for (i = 0; i < this.data.carts.length; i++) {
      Allprice = Allprice + (this.data.carts[index].price * this.data.carts[index].count);
    }
    if (Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    }
    else {
      this.data.isAllSelect = false;
    }
    this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
  },
  //全选
  allSelect: function (e) {
    //处理全选逻辑
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney = 0;
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = true;
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);

      }
    }
    else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,
    })
  },
  // 去结算
  toBuy() {
    if(app.globalData.userToken){
      if(this.data.totalMoney == 0){
        wx.showToast({
          title: '请先勾选商品',
          icon: 'none',
          duration: 2000
        });
      }else{
      // 获取用户地址id
        let arr = wx.getStorageSync('addressList');
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
            // 获取商品id
            // 获取商品购买数量
            let pay_num = {}
            for(let i = 0, len = this.data.carts.length; i < len; i++) {
              pay_num[[this.data.carts[i].goodsId]] = this.data.carts[i].count
            }
            console.log(pay_num);
            // 获取商品价格
            let pay_price = this.data.totalMoney
            console.log(this.data.totalMoney)
            console.log(arr[0].user)
            // 获取商品标题
            let order_title = 'KonwGoods'
            $https.getpayUrl({"order_addr":arr[0].user,"pay_num":pay_num,"order_title":order_title,"pay_price":pay_price}).then(res =>{
              var pay_url = res.data.pay_url
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
              // this.setData({
              //   iscart: !this.data.iscart,
              // });
              wx.setStorageSync('cart', []);
              this.onShow();
            }).catch(res =>{
              wx.showToast({
                title: res.data.detail,
                icon:'error',
                duration:2000
              })
            })
          }
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
  //数量变化处理
  handleQuantityChange(e) {
    var componentId = e.componentId;
    var quantity = e.quantity;
    this.data.carts[componentId].count.quantity = quantity;
    this.setData({
      carts: this.data.carts,
    });
  },
  /* 减数 */
  delCount: function (e) {
    var index = e.target.dataset.index;
    console.log("刚刚您点击了加一");
    var count = this.data.carts[index].count;
    // 商品总数量-1
    if (count > 1) {
      this.data.carts[index].count--;
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts
    });
    console.log("carts:" + this.data.carts);
    this.priceCount();
  },
  /* 加数 */
  addCount: function (e) {
    var index = e.target.dataset.index;
    console.log("刚刚您点击了加+");
    var count = this.data.carts[index].count;
    // 商品总数量+1  
    if (count < 10) {
      this.data.carts[index].count++;
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts
    });
    console.log("carts:" + this.data.carts);
    this.priceCount();
  },
  priceCount: function (e) {
    this.data.totalMoney = 0;
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].isSelect == true) {
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }

    }
    this.setData({
      totalMoney: this.data.totalMoney,
    })
  },
  /* 删除item */
  delGoods: function (e) {
    if (app.globalData.userToken){
      let good_id = this.data.carts[0].goodsId
      // 向后端发起删除请求
      $https.getDelCartGood(good_id).then(res =>{
        wx.setStorageSync('cart', this.data.carts);
        this.priceCount();
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
          });
      })
      this.data.carts.splice(e.target.id.substring(3),1);
      // 更新data数据对象  
      if (this.data.carts.length > 0) {
        this.setData({
          carts: this.data.carts
        })     
      } else {
        this.setData({
          cart: this.data.carts,
          iscart: false,
          hidden: true,
        })
        wx.setStorageSync('cart', []);
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
  }
})
