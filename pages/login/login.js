// pages/login/login.js
Page({
  data: {
    studentId: '',
    password: '',
    errorMessage: '',
    isLoading: false
  },

  // 处理学号输入
  inputStudentId: function(e) {
    this.setData({
      studentId: e.detail.value,
      errorMessage: ''
    });
  },

  // 处理密码输入
  inputPassword: function(e) {
    this.setData({
      password: e.detail.value,
      errorMessage: ''
    });
  },

  // 登录提交
  loginSubmit: function() {
    const { studentId, password } = this.data;
    
    // 简单的表单验证
    if (!studentId) {
      this.setData({
        errorMessage: '请输入学号'
      });
      return;
    }
    
    if (!password) {
      this.setData({
        errorMessage: '请输入密码'
      });
      return;
    }
    
    // 显示加载状态
    this.setData({
      isLoading: true
    });
    
    // 调用全局的登录方法
    const app = getApp();
    app.login(studentId, password)
      .then(res => {
        this.setData({
          isLoading: false
        });
        
        if (res.success) {
          // 登录成功，跳转到个人中心
          wx.switchTab({
            url: '/pages/dashboard/dashboard'
          });
        } else {
          this.setData({
            errorMessage: res.message || '登录失败'
          });
        }
      })
      .catch(err => {
        this.setData({
          isLoading: false,
          errorMessage: err.message || '登录失败，请稍后重试'
        });
      });
  },

  // 跳转到注册页面
  goToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },

  // 返回首页
  goBack: function() {
    wx.navigateBack();
  }
});