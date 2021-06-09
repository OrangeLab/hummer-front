# hummer-front
Hummer Front 是针对 Hummer Web 的库，用于 Web 测试环境中，便于调试使用
> Warning: 不建议在 Web 正式环境中，使用该包，由于样式处理等模块有性能损耗，仅适用于开发环境。


## 功能模块
### Component
#### View
基本视图
#### Text
文本
#### Image
图片
#### Button
按钮
#### Input
输入框
#### TextArea
文本输入框

#### Scroller
滚动容器
#### HorizontalScroller
横向滚动容器

#### List
复用列表
#### ViewPager
轮播

### API
#### Navigator
路由模块
#### Animation
动画模块
#### Toast
Toast 提示
#### Dialog
Dialog 弹窗
#### Request
请求
#### WebSocket
Socket 链接
#### Storage
存储
#### Memory
内存
#### Location
位置

### Style
基础的样式进行转换对接
#### 单位转换
将 `hm` 单位转换为标准的适配单位 `rem`

- [x] hm 转换为 rem


# 本地调试

`Hummer-font` 作为浏览器端模拟的 `Hummer` 环境，为了方面和原生基础组件拉齐，在开发 `Hummer-font` 时，支持 `$ npm run example hummer-resource-ip`。

> eg: npm run example http://172.23.165.113:8000/component-button.js

支持多个 url，具体逻辑可以查阅 `./script/playground.js`

TodoList:

1.  完善浏览器端调试可以进入到 `Hummer-front` 的 **ts源码**。

