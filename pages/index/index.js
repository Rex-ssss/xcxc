// pages/index/index.js
Page({
  data: {
    // 页面数据
  },

  onLoad: function(options) {
    // 页面加载时执行
    const app = getApp();
    // 检查用户是否已登录，如果已登录则直接跳转到个人中心
    if (app.globalData.isLogin) {
      wx.switchTab({
        url: '/pages/dashboard/dashboard'
      });
    }
  },

  // 跳转到登录页面
  goToLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 跳转到注册页面
  goToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
});