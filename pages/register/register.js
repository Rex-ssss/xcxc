// pages/register/register.js
Page({
  data: {
    studentId: '',
    name: '',
    phone: '',
    verificationCode: '',
    email: '',
    password: '',
    confirmPassword: '',
    errorMessage: '',
    isLoading: false,
    countdown: 0,
    canSendCode: true
  },

  // 处理学号输入
  inputStudentId: function(e) {
    this.setData({
      studentId: e.detail.value,
      errorMessage: ''
    });
  },

  // 处理姓名输入
  inputName: function(e) {
    this.setData({
      name: e.detail.value,
      errorMessage: ''
    });
  },

  // 处理手机号输入
  inputPhone: function(e) {
    this.setData({
      phone: e.detail.value,
      errorMessage: ''
    });
  },

  // 处理验证码输入
  inputVerificationCode: function(e) {
    this.setData({
      verificationCode: e.detail.value,
      errorMessage: ''
    });
  },

  // 处理邮箱输入
  inputEmail: function(e) {
    this.setData({
      email: e.detail.value,
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

  // 处理确认密码输入
  inputConfirmPassword: function(e) {
    this.setData({
      confirmPassword: e.detail.value,
      errorMessage: ''
    });
  },

  // 发送验证码
  sendVerificationCode: function() {
    const { phone, canSendCode } = this.data;
    
    if (!canSendCode) return;
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      this.setData({
        errorMessage: '请输入正确的手机号'
      });
      return;
    }
    
    // 调用全局的发送验证码方法
    const app = getApp();
    app.sendVerificationCode(phone)
      .then(res => {
        if (res.success) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success'
          });
          
          // 开始倒计时
          this.startCountdown();
        } else {
          this.setData({
            errorMessage: res.message || '发送验证码失败'
          });
        }
      })
      .catch(err => {
        this.setData({
          errorMessage: err.message || '发送验证码失败'
        });
      });
  },

  // 倒计时功能
  startCountdown: function() {
    let seconds = 60;
    this.setData({
      countdown: seconds,
      canSendCode: false
    });
    
    const timer = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(timer);
        this.setData({
          countdown: 0,
          canSendCode: true
        });
      } else {
        this.setData({
          countdown: seconds
        });
      }
    }, 1000);
  },

  // 注册提交
  registerSubmit: function() {
    const { studentId, name, phone, verificationCode, email, password, confirmPassword } = this.data;
    
    // 表单验证
    if (!studentId) {
      this.setData({ errorMessage: '请输入学号' });
      return;
    }
    
    if (!name) {
      this.setData({ errorMessage: '请输入姓名' });
      return;
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      this.setData({ errorMessage: '请输入正确的手机号' });
      return;
    }
    
    if (!verificationCode) {
      this.setData({ errorMessage: '请输入验证码' });
      return;
    }
    
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      this.setData({ errorMessage: '请输入正确的邮箱' });
      return;
    }
    
    if (!password || password.length < 6) {
      this.setData({ errorMessage: '密码长度不能少于6位' });
      return;
    }
    
    if (password !== confirmPassword) {
      this.setData({ errorMessage: '两次输入的密码不一致' });
      return;
    }
    
    // 显示加载状态
    this.setData({ isLoading: true });
    
    // 调用全局的注册方法
    const app = getApp();
    app.register(studentId, name, phone, email, password)
      .then(res => {
        this.setData({ isLoading: false });
        
        if (res.success) {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              // 注册成功后跳转到登录页面
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/login/login'
                });
              }, 1500);
            }
          });
        } else {
          this.setData({ errorMessage: res.message || '注册失败' });
        }
      })
      .catch(err => {
        this.setData({
          isLoading: false,
          errorMessage: err.message || '注册失败，请稍后重试'
        });
      });
  },

  // 返回登录页面
  goToLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
});