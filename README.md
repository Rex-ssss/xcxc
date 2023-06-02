基于Python2编写的hello world小程序。
使用SetupTool模板进行构建
使用语言 pthon
编译工具 python2.7

编译命令：python setup.py bdist_egg

* 构建结果

![构建结果](./images/python2Demo-构建截图.PNG)

## 流水线相关

- 是否支持自动创建流水线：**不支持**

- 流水线配置结构

> 开始阶段
+ 源码仓库

> 编译阶段
+ 构建任务
+ 代码检查任务

> 部署阶段
+ 部署任务
+ 接口测试任务

## CloudIDE相关

- 是否支持在CloudIDE导入：**支持**

* 导入结果

![导入结果](./images/Python2Demo-CloudIDE截图.PNG)

## CloudCheck相关

* 检查结果

![检查结果](./images/Python2Demo-代码检查截图.PNG)