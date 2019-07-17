## 简介
 一个以页面为核心的适用于wap开发的单页面系统

## Introduction
This is a React based SPA system for mobile wap development.

 ---

## 安装
使用npm来安装
```js
npm i pagego
```

## [这里是详细文档](https://github.com/tongbanjie/PageGo/wiki)

## 用法

以下三个步骤可能帮你快速开始使用PageGo, 不过更建议你查看具体[**文档**](https://github.com/tongbanjie/PageGo/wiki)

### 步骤一

定义单页面的入口文件，并使用pagego进行初始化

main.js:
```js
  import PageGo from 'pagego'
  import pagelist from './pagelist'
  // 初始化
  PageGo.init({
    // pageList是页面组件的引用列表
    // 步奏二会具体阐明
    pageList: pagelist
  }).then(function() {
    // go方法的第一个参数对应要去前往的页面
    // 它需要与pagelist中的key相对应
    PageGo.go('index')
  });
```
+ pagelist是各页面组件的引用列表，步骤二会进行说明
+ 完成初始化后, 使用PageGo.go方法进入到你的第一个页面

### 步骤二

+ 为了使PageGo.go方法通过页面名称来转换页面视图，需要定义一个页面组件引用列表
+ 你可以使用直接引用的方式来注册引用列表
+ 你也可以使用webpack支持的Dynamic Imports方式或其他异步方式来按需加载你的页面

```js
import Index from '../pages/Index'
import Second from '../pages/Second'

export default {
  "index": Index,
  "detail": Second
}
```
PageGo在运行时将会用对应的key渲染对应的页面组件

你还可以使用Dynamic Imports方式对页面组件进行按需加载
```js
export default {
  "index": function(){
    // 通过动态import，webpack打包时会将此页面单独打成chunk包进行异步加载
    return import(/* webpackChunkName: "indexPage" */"../pages/Index").then(_ => {
      return _.default;
    })
  },
  "detail": function(){
    return import(/* webpackChunkName: "detailPage" */"../pages/Detail").then(_ => {
      return _.default;
    })
  }
}
```

### 步奏三

定义页面组件:
```js
class Index extends React.Component {

  static defaultProps = {
    PageTitle: '首页'
  }
  // 点击事件响应
  goNext = () => {
    PageGo.next('detail')
  }

  render() {
    return (
      <div>
        {/* <div>页头</div> */}
        <div className='innerContainer'>
          Hello World!
          <button onClick={this.goNext}>Next</button>
        </div>
        {/* <div>页尾</div> */}
      </div>
      );
  }
}
export default Index;
```
+ 页面组件中需要在defaultProps中定义PageTitle， PageTitle将设置为页面标题
+ 如果要渲染并跳转到其他页面，使用PageGo.go或者PageGo.next就好
+ pagego中的页面组件支持页头，页内容，页尾布局；页内容需要包裹在一个className为innerContainer的div中;
+ 如果你需要定义页头，首页设置innerContainer的style的top值为页头高度，并将页头内容放在innerContainer前
+ 如果你需要定义页尾，首页设置innerContainer的style的bottom值为页尾高度，并将页尾内容放在innerContainer后


另外页面组件支持React Hook写法:
```js
function Index(props){
  return (
    <div>
      {/* <div>页头</div> */}
      <div className='innerContainer'>
        Hello World!
      </div>
      {/* <div>页尾</div> */}
    </div>
    );
}
// 定义页面属性，同class组件的defaultProps
Index.hookPage = {
  PageTitle: '首页'
}
export default Index;
```
