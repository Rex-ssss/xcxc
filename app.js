//app.js
App({
  globalData: {
    userInfo: null,
    isLogin: false
  },

  onLaunch: function() {
    // 从本地存储中获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    const token = wx.getStorageSync('token');
    
    if (userInfo && token) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLogin = true;
    }
  },

  // 登录功能
  login: function(studentId, password) {
    return new Promise((resolve, reject) => {
      // 模拟调用API进行登录验证
      // 在实际应用中，这里应该调用真实的后端API
      setTimeout(() => {
        // 模拟学生信息数据库
        const mockUserDatabase = [
          { studentId: '2021001', password: '123456', name: '张三', phone: '13800138001', email: 'zhangsan@example.com' },
          { studentId: '2021002', password: '123456', name: '李四', phone: '13800138002', email: 'lisi@example.com' }
        ];

        const user = mockUserDatabase.find(u => u.studentId === studentId && u.password === password);
        
        if (user) {
          // 登录成功
          const token = 'token_' + Date.now(); // 模拟生成token
          wx.setStorageSync('userInfo', user);
          wx.setStorageSync('token', token);
          
          this.globalData.userInfo = user;
          this.globalData.isLogin = true;
          
          resolve({ success: true, userInfo: user, token: token });
        } else {
          // 登录失败
          reject({ success: false, message: '学号或密码错误' });
        }
      }, 500);
    });
  },

  // 注册功能
  register: function(studentId, name, phone, email, password) {
    return new Promise((resolve, reject) => {
      // 模拟调用API进行注册
      setTimeout(() => {
        // 模拟检查学号是否已注册
        const existingUser = wx.getStorageSync(`user_${studentId}`);
        
        if (existingUser) {
          reject({ success: false, message: '该学号已注册' });
          return;
        }

        // 创建新用户
        const newUser = {
          studentId: studentId,
          name: name,
          phone: phone,
          email: email,
          password: password
        };

        // 存储用户信息（实际应用中应该调用后端API）
        wx.setStorageSync(`user_${studentId}`, newUser);
        
        resolve({ success: true, message: '注册成功' });
      }, 500);
    });
  },

  // 退出登录
  logout: function() {
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
    this.globalData.userInfo = null;
    this.globalData.isLogin = false;
  },

  // 发送验证码
  sendVerificationCode: function(phone) {
    return new Promise((resolve, reject) => {
      // 模拟发送验证码
      setTimeout(() => {
        // 生成6位数字验证码
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // 存储验证码（实际应用中应该由后端生成并存储）
        wx.setStorageSync(`verification_${phone}`, code);
        wx.setStorageSync(`verification_time_${phone}`, Date.now());
        
        console.log('验证码:', code); // 实际应用中不应该在控制台打印
        
        resolve({ success: true, message: '验证码已发送' });
      }, 500);
    });
  }
});