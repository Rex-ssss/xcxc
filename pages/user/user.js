// pages/user/user.js
Page({
  data: {
    userInfo: null,
    isLoading: true,
    isLogin: false,
    orderStats: {
      pendingPayment: 0,
      pendingShipment: 0,
      pendingReceipt: 0,
      completed: 0
    }
  },

  onLoad: function() {
    this.checkLoginStatus();
  },

  onShow: function() {
    // 每次显示页面时检查登录状态和刷新数据
    this.checkLoginStatus();
    if (this.data.isLogin) {
      this.loadUserInfo();
      this.loadOrderStats();
    }
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const app = getApp();
    if (app.globalData.isLogin && app.globalData.userInfo) {
      this.setData({
        isLogin: true,
        userInfo: app.globalData.userInfo
      });
    } else {
      this.setData({ isLogin: false });
    }
  },

  // 加载用户信息
  loadUserInfo: function() {
    this.setData({ isLoading: true });
    
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo,
      isLoading: false
    });
  },

  // 加载订单统计
  loadOrderStats: function() {
    const orders = wx.getStorageSync('orders') || [];
    const userId = getApp().globalData.userInfo.studentId;
    
    // 筛选当前用户的订单
    const userOrders = orders.filter(order => order.userId === userId);
    
    this.setData({
      orderStats: {
        pendingPayment: userOrders.filter(order => order.status === '待付款').length,
        pendingShipment: userOrders.filter(order => order.status === '待发货').length,
        pendingReceipt: userOrders.filter(order => order.status === '待收货').length,
        completed: userOrders.filter(order => order.status === '已完成').length
      }
    });
  },

  // 跳转到登录页面
  goToLogin: function() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  // 跳转到订单页面
  goToOrders: function(e) {
    const status = e.currentTarget.dataset.status || 0;
    wx.switchTab({
      url: '/pages/orders/orders',
      success: () => {
        // 这里可以通过globalData传递状态参数给orders页面
        getApp().globalData.selectedOrderStatus = status;
      }
    });
  },

  // 跳转到我的发布
  goToMyPublish: function() {
    wx.showToast({ title: '我的发布功能开发中', icon: 'none' });
  },

  // 跳转到我的收藏
  goToMyFavorites: function() {
    wx.showToast({ title: '我的收藏功能开发中', icon: 'none' });
  },

  // 跳转到地址管理
  goToAddressManagement: function() {
    wx.showToast({ title: '地址管理功能开发中', icon: 'none' });
  },

  // 跳转到客服中心
  goToCustomerService: function() {
    wx.showToast({ title: '客服中心功能开发中', icon: 'none' });
  },

  // 跳转到设置页面
  goToSettings: function() {
    wx.showToast({ title: '设置功能开发中', icon: 'none' });
  },

  // 退出登录
  logout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.logout();
          
          this.setData({
            isLogin: false,
            userInfo: null
          });
          
          wx.showToast({ title: '已退出登录' });
        }
      }
    });
  }
});