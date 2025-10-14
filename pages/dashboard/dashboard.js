// pages/dashboard/dashboard.js
Page({
  data: {
    userInfo: null,
    isLoading: true
  },

  onLoad: function(options) {
    this.checkLoginStatus();
  },

  onShow: function() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const app = getApp();
    
    if (app.globalData.isLogin && app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        isLoading: false
      });
    } else {
      // 如果未登录，跳转到登录页面
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
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
          
          wx.redirectTo({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  // 跳转到二手交易页面
  goToTrading: function() {
    wx.showToast({
      title: '跳转到二手交易页面',
      icon: 'none'
    });
    // 在实际应用中，这里应该跳转到二手交易页面
  },

  // 跳转到个人设置页面
  goToSettings: function() {
    wx.showToast({
      title: '跳转到个人设置页面',
      icon: 'none'
    });
    // 在实际应用中，这里应该跳转到个人设置页面
  }
});