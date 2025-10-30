// pages/cart/cart.js
Page({
  data: {
    cartItems: [],
    isLoading: true,
    totalPrice: 0,
    isLogin: false
  },

  onLoad: function() {
    this.checkLoginStatus();
  },

  onShow: function() {
    // 每次显示页面时检查登录状态和刷新购物车数据
    this.checkLoginStatus();
    if (this.data.isLogin) {
      this.loadCartItems();
    }
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const app = getApp();
    if (app.globalData.isLogin) {
      this.setData({ isLogin: true });
    } else {
      this.setData({ isLogin: false });
    }
  },

  // 加载购物车数据
  loadCartItems: function() {
    this.setData({ isLoading: true });
    
    // 模拟获取购物车数据
    setTimeout(() => {
      // 从本地存储获取购物车数据
      const cartItems = wx.getStorageSync('cartItems') || [];
      
      // 计算总价
      const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      this.setData({
        cartItems: cartItems,
        totalPrice: totalPrice,
        isLoading: false
      });
    }, 500);
  },

  // 跳转到登录页面
  goToLogin: function() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  // 增加商品数量
  increaseQuantity: function(e) {
    const index = e.currentTarget.dataset.index;
    const cartItems = this.data.cartItems;
    cartItems[index].quantity += 1;
    this.updateCart(cartItems);
  },

  // 减少商品数量
  decreaseQuantity: function(e) {
    const index = e.currentTarget.dataset.index;
    const cartItems = this.data.cartItems;
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
      this.updateCart(cartItems);
    }
  },

  // 删除购物车商品
  removeFromCart: function(e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          const cartItems = this.data.cartItems;
          cartItems.splice(index, 1);
          this.updateCart(cartItems);
        }
      }
    });
  },

  // 更新购物车
  updateCart: function(cartItems) {
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.setData({
      cartItems: cartItems,
      totalPrice: totalPrice
    });
    
    // 保存到本地存储
    wx.setStorageSync('cartItems', cartItems);
  },

  // 结算
  checkout: function() {
    if (this.data.cartItems.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' });
      return;
    }
    
    wx.showToast({ title: '结算功能开发中', icon: 'none' });
  }
});