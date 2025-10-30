// pages/orders/orders.js
Page({
  data: {
    orders: [],
    tabs: ['全部', '待付款', '待发货', '待收货', '已完成'],
    activeTab: 0,
    isLoading: true,
    isLogin: false,
    // 新增：管理模式
    manageMode: false,
    filteredOrders: []
  },

  onLoad: function() {
    this.checkLoginStatus();
  },

  onShow: function() {
    // 每次显示页面时检查登录状态和刷新订单数据
    this.checkLoginStatus();
    if (this.data.isLogin) {
      this.loadOrders();
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

  // 跳转到登录页面
  goToLogin: function() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  // 切换标签
  switchTab: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
    // 根据标签筛选订单
    this.filterOrders();
  },

  // 加载订单数据
  loadOrders: function() {
    this.setData({ isLoading: true });
    
    // 模拟获取订单数据
    setTimeout(() => {
      // 从本地存储获取订单数据
      let orders = wx.getStorageSync('orders') || [];
      
      // 如果没有订单数据，创建一些模拟订单
      if (orders.length === 0) {
        orders = this.createMockOrders();
        wx.setStorageSync('orders', orders);
      }
      
      this.setData({
        orders: orders,
        isLoading: false
      });
      
      // 筛选订单
      this.filterOrders();
    }, 500);
  },

  // 创建模拟订单
  createMockOrders: function() {
    const app = getApp();
    const userId = app.globalData.userInfo.studentId;
    
    return [
      {
        id: '1001',
        userId: userId,
        items: [
          { id: 'p001', title: '九成新MacBook Pro 2022', price: 8999, quantity: 1, image: '' }
        ],
        totalPrice: 8999,
        status: '待付款',
        createTime: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '1002',
        userId: userId,
        items: [
          { id: 'p002', title: 'iPhone 14 Pro 128GB', price: 6999, quantity: 1, image: '' }
        ],
        totalPrice: 6999,
        status: '待发货',
        createTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: '1003',
        userId: userId,
        items: [
          { id: 'p003', title: 'AirPods Pro 2', price: 1899, quantity: 1, image: '' }
        ],
        totalPrice: 1899,
        status: '待收货',
        createTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      },
      {
        id: '1004',
        userId: userId,
        items: [
          { id: 'p004', title: 'iPad Air 5', price: 4799, quantity: 1, image: '' }
        ],
        totalPrice: 4799,
        status: '已完成',
        createTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
      }
    ];
  },

  // 筛选订单
  filterOrders: function() {
    const { orders, activeTab, tabs } = this.data;
    let filteredOrders = orders;
    
    if (activeTab > 0) {
      filteredOrders = orders.filter(order => order.status === tabs[activeTab]);
    }
    
    this.setData({ filteredOrders: filteredOrders });
  },

  // 管理模式切换
  toggleManageMode: function() {
    this.setData({ manageMode: !this.data.manageMode });
  },

  // 删除订单中的某个商品
  deleteOrderItem: function(e) {
    const orderId = e.currentTarget.dataset.orderId;
    const productId = e.currentTarget.dataset.productId;
    wx.showModal({
      title: '删除商品',
      content: '确定要从订单中删除该商品吗？',
      confirmColor: '#ff6b81',
      success: (res) => {
        if (!res.confirm) return;
        let orders = this.data.orders.slice();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;
        const order = orders[orderIndex];
        const newItems = (order.items || []).filter(p => p.id !== productId);
        if (newItems.length === 0) {
          // 若订单已无商品，删除整个订单
          orders.splice(orderIndex, 1);
        } else {
          order.items = newItems;
          // 重新计算总价
          order.totalPrice = newItems.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
          orders[orderIndex] = order;
        }
        wx.setStorageSync('orders', orders);
        this.setData({ orders });
        this.filterOrders();
        wx.showToast({ title: '已删除' });
      }
    });
  },

  // 查看订单详情
  viewOrderDetail: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({ title: '查看订单详情功能开发中', icon: 'none' });
  },

  // 取消订单
  cancelOrder: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          let orders = this.data.orders;
          const index = orders.findIndex(order => order.id === orderId);
          if (index !== -1) {
            orders[index].status = '已取消';
            wx.setStorageSync('orders', orders);
            this.setData({ orders: orders });
            this.filterOrders();
            wx.showToast({ title: '订单已取消' });
          }
        }
      }
    });
  },

  // 付款
  payOrder: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({ title: '支付功能开发中', icon: 'none' });
  },

  // 确认收货
  confirmReceipt: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品吗？',
      success: (res) => {
        if (res.confirm) {
          let orders = this.data.orders;
          const index = orders.findIndex(order => order.id === orderId);
          if (index !== -1) {
            orders[index].status = '已完成';
            wx.setStorageSync('orders', orders);
            this.setData({ orders: orders });
            this.filterOrders();
            wx.showToast({ title: '收货成功' });
          }
        }
      }
    });
  },

  // 删除所有订单（仅管理模式下展示按钮触发）
  deleteAllOrders: function() {
    wx.showModal({
      title: '删除所有订单',
      content: '确定要删除所有订单吗？此操作不可恢复。',
      confirmColor: '#ff6b81',
      success: (res) => {
        if (res.confirm) {
          // 清空本地存储中的订单数据
          wx.setStorageSync('orders', []);
          this.setData({
            orders: [],
            filteredOrders: []
          });
          wx.showToast({ title: '所有订单已删除' });
        }
      }
    });
  }
});