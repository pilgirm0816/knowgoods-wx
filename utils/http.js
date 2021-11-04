const GET = 'GET';
const POST = 'POST';
const DELETE = 'DELETE';

const baseURL = 'http://8.130.49.128:8000/applet/v1/api/';
const app = getApp();
function request(method, url, data) {
    return new Promise(function(resolve, reject) {
        let header = {
            'content-type': 'application/json',
            'openid':wx.getStorageSync('openid'),
            'token':app.globalData.userToken,
        };
        wx.request({
            url: baseURL + url,
            method: method,
            data: data,
            header: header,
            success(res) {
                if (res.data.code == 200) {
                  resolve(res)
                } else {
                    reject(res)
                }
            },
            fail(err) {
                //请求失败
                reject(err)
            }
        })
    })
}


const API = {
  // 获取openid
  getOpenid: (data) => request(POST, `get_code/`,data),
  // 获取用户信息
  getUserdetail:(data) => request(POST,'login/',data),
  // 导航条
  getnavbarShow:(data) => request(GET,'home/navbars/',data),
  // 轮播图
  getbannerShow:(data) => request(GET,'home/banners/',data),
  // 新品特卖
  getbrandShow:(data) => request(GET,'home/productsale/',data),
  // 福利专场
  getnewGoodsShow:(data) => request(GET,'home/pecialbenefits/',data),
  // 商品详情页
  getgoodsDetailShow:(data) => request(GET,'gooddetail/?goodsId='+data),
  // 商品分类页
  getclassifyShow:(data) => request(GET,'category/',data),
  // 商品小类分页
  getclickclassifyShow:(data) => request(GET,'category/index/?indexId='+data),
  // 分页类商品预览
  getpreviewgoodShow:(data) =>request(GET,'category/preview/?classifyId='+data),
  // 添加收货地址
  getaddress:(data) =>request(POST,'mine/address/',data),
  // 添加商品到购物车
  getAddCartGood:(data) => request(POST,'addcartgood/',data),
  // 商品从购物车中移除
  getDelCartGood:(data) => request(DELETE,'delcartgood/?productgood='+data),
  // 商品购买返回支付链接
  getpayUrl:(data) =>request(POST,'pay/',data),
  // 订单列表
  getOrderlist:(data) => request(GET,'orderlist/?order_status='+data)
};
module.exports = {
  API: API
}