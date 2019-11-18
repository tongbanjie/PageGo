### 1.0.0
首次上传

### 1.0.1
1. 修复hover页面返回后title不重置问题
2. 复页面状态恢复在某些情形下不起作用的问题，为此引入了PageKey
3. 改进文档

### 1.0.2
1. 增加文档内demo演示链接
2. 修复demo打包时的一个错误

### 1.0.3
1. 暴露出APP.jsx 这样用户可以拿来做SSR
2. React16.8以后的版本可以在Context模式下使用reducer
3. 一些手机兼容性问题的修复

### 1.0.4
1. 还原之前删除的object.assign的polyfill
2. 在初始化的声明周期中暴露一个routeForward，用于判断当前页面是前进还是后退而来

### 1.0.5
1. go方法的路由path可以添加url参数，即"?"符号及后面的参数,这些参数会被附带到地址栏中, 但PageGo只匹配"?"前的路由
2. init新增viewportCss参数，支持设置整个SPA的视窗，其格式是正常css样式字符串，例如你有个iphoneX的全面屏，需要在底部预留34px空间，你可以这么设置 viewportCss: "bottom:34px;"
3. init中的声明周期方法暴露的数据新增routeForward参数，为当前页面由页面前进还是后退而来

### 1.1.0
1. 对pagego文件代码结构进行优化，拆分出dom, route和status文件
2. 新增PageGo的ts声明文件
3. init接受参数新增routerMode，可能值为browser和hash，分别对应使用history路由和hash路由，默认为hash路由