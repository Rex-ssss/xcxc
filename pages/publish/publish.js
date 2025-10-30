// pages/publish/publish.js
Page({
  data: {
    // 基本信息
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',

    // 选项
    categoryOptions: ['教材', '电子产品', '书籍文具', '服装配饰', '运动器材', '生活用品', '其他'],
    conditionOptions: ['全新', '9成新', '8成新', '7成新', '一般'],

    // 图片（需上传3-9张）
    images: [],

    // 状态
    previewVisible: false,
    isLoading: false,
    isLogin: false
  },

  onLoad: function() {
    this.checkLoginStatus();
  },

  onShow: function() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();
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

  // 跳转到登录页面
  goToLogin: function() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  // 输入标题
  inputTitle: function(e) {
    this.setData({ title: e.detail.value });
  },

  // 输入描述
  inputDescription: function(e) {
    this.setData({ description: e.detail.value });
  },

  // 输入价格
  inputPrice: function(e) {
    this.setData({ price: e.detail.value });
  },

  // 选择分类
  selectCategory: function(e) {
    const index = e.detail.value;
    const category = this.data.categoryOptions[index];
    this.setData({ category });
  },

  // 选择新旧程度
  selectCondition: function(e) {
    const index = e.detail.value;
    const condition = this.data.conditionOptions[index];
    this.setData({ condition });
  },

  // 选择图片（需上传3-9张）
  chooseImage: function() {
    const remain = Math.max(0, 9 - this.data.images.length);
    if (remain <= 0) {
      wx.showToast({ title: '最多上传9张', icon: 'none' });
      return;
    }
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFiles.map(file => file.tempFilePath);
        const merged = [...this.data.images, ...tempFilePaths].slice(0, 9);
        this.setData({ images: merged });
      }
    });
  },

  // 删除图片
  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    this.setData({ images: images });
  },

  // 预览图片
  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    });
  },

  // 打开预览面板（不强制完整校验，让用户自查）
  openPreview: function() {
    this.setData({ previewVisible: true });
  },

  // 关闭预览面板
  closePreview: function() {
    this.setData({ previewVisible: false });
  },

  // 必填项校验（图/名称/价格）且图片至少3张
  validateRequired: function() {
    const { title, price, images } = this.data;
    if (!title.trim()) return false;
    if (!price || isNaN(parseFloat(price))) return false;
    if (!images || images.length < 3) return false;
    return true;
  },

  // 提交发布
  submitPublish: function() {
    const { title, description, price, category, condition, images } = this.data;

    // 系统校验信息：若必填项（图/名称/价格）完整，发布；否则提示补充信息
    if (!this.validateRequired()) {
      wx.showToast({ title: '请补充信息', icon: 'none' });
      return;
    }

    this.setData({ isLoading: true });

    // 模拟发布商品
    setTimeout(() => {
      // 创建商品数据
      const newProduct = {
        id: Date.now().toString(),
        title: title,
        description: description,
        price: parseFloat(price),
        category: category,
        condition: condition,
        images: images,
        publishTime: new Date().toISOString(),
        publisherId: getApp().globalData.userInfo.studentId
      };

      // 从本地存储获取现有商品列表
      const products = wx.getStorageSync('products') || [];
      products.unshift(newProduct);
      wx.setStorageSync('products', products);

      this.setData({ isLoading: false, previewVisible: false });

      wx.showToast({ title: '发布成功' });

      // 重置表单
      this.setData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        images: []
      });

      // 延时跳转到首页或“我的发布”（此处跳首页）
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1200);
    }, 800);
  }
});