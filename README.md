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

## 用法

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
    PageGo.go('detail')
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

  render() {
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
}
export default Index;
```
+ 页面组件中需要在defaultProps中定义PageTitle， PageTitle将设置为页面标题
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

# API

## init
init方法接受一个对象，并用这个对象内的参数初始化单页面，参数有
1. pageList, 异步页面配置, 必需
2. noHashRouter, 不使用hash路由，默认使用hash路由，如果配置为true，则使用正常路由。在正常路由中，在做刷新页面操作时，刷新后的页面需要与刷新前的页面保持一致，因此你需要保证刷新的地址有真实对应的页面路径，否则将会出现404错误。
3. pageWillSwitch和pageDidSwitch, 这是两个周期函数，分别定义了页面将被渲染和页面已经被渲染完成两个事件。
4. globalProps, 页面全局props, 这是一个对象，pagego会将这个对象的属性映射到每个页面的props上，例如定义的globalProps是{api:'/api'}, 那么你可以在每个页面中这样使用this.props.api; 另外globalProps的属性优先级低于页面间传值的props。
5. initContext, React Context的初始状态，当设置此值时页面组件将会使用Context模式，详情见Context章节。
6. baseUrlWithoutProtocol, 如果你的网页入口只有一级域名, 后续页面仍然是带有具体项目名的，那么需要在这里设置你带有项目名的baseurl，这个设置不需要protocol也不需要"//"符号，例如"m.xxx.com/abc"。

## go
```js
  PageGo.go(page[,type][,param][,callback]);
```

go方法定义应用需要前往或跳转的页面。

* page为需要跳转页面的页面名，该页面名需要与配置的页面名保持一致
* type是定义页面跳转的方向，其只能为next, top(pop), bottom, next-hover及current五个值，分别对应的跳转方向是前进，向上新弹出页面（覆盖），向下新弹出页面（覆盖），向左新弹出页面(覆盖)及当前页渲染(无跳转动效)。
* 为了避免填写type类型, pagego提供了快捷方法, next, hover及jump(代表current)，这样你可以省略type参数
  ```js
    // type为"next"时
    PageGo.next(page[,param][,callback]);
    // type为"next-hover"
    PageGo.hover(page[,param][,callback]);
    // type为"current"
    PageGo.jump(page[,param][,callback]);
  ```
  注：
> 1. 此参数不配置时，默认为前进，另外不配时的初始页面不会进行任何调整只是进行渲染。
> 2. 回退时不使用go方法，请使用back方法


示例
```js
  /* 当前文件为Index.jsx */
  static defaultProps = {
    PageTitle: '首页', // 页面title
  }
  PageGo.go('main', 'next', { name: 'hello' });
```

如果你编写的是hook页面，请在页面组件函数将该函数加上hookPage子属性
```js
  // 函数组件
  function Index(props){
    return <div></div>
  }
  Index.hookPage = {
    PageTitle: '首页' // 页面title
  }
  export default Index;
```
其作用与class组件的defaultProps中的页面属性是一样的


* param定义当前页面到下个页面的传参，其格式应为一个对象，如{name:"Tom"}。在下个页面使用上个页面传参时可以直接从页面组件中的props中取得，如this.props.name。
* param数据将会被浏览器临时缓存，当你在页面上进行刷新，或者从下一个页面返回时，param依旧存在，你不需要为此重新获取数据。param数据请不要大于600KB。
* param中可以设置几个特殊的字段
  1. PushUrlParam, 将参数设置到url上, 例如设置{abc:1}时，下一个页面得到的url将会带有?abc=1
  2. CleanUrl, 如果当前页面带有hash或者search，传入CleanUrl = true后，下一个页面这些参数将会被清除
  3. PageSwipeBack, 指定下一个页面是否启用手势返回
* 注意，请不要再param中带入任何函数，因为这些函数可能在传递后无法生效。

## back

返回方法

```js
    PageGo.back(index);
    //index: 返回级数，默认为-1
```
当页面需要回退到上一页面时，请调用此方法。

## replace

类似于window.location.replace方法, 参数与go方法一致

### 支持手势返回
对需要支持的页面进行如下配置即可支持
```js
  static defaultProps = {
    PageTitle: '详情',
    PageSwipeBack: true  // 配置此项以支持当前页面手势返回
  }
```
或者在go方法的第三个参数内, 设置PageSwipeBack: true, 即可指定下个页面支持手势返回

---

## Context
PageGo支持React的Context，这能让你轻量级的管理全局状态, 使用Context首先要在PageGo.init中设置initContext, initContext是你的全局状态的初始值。

```js
  PageGo.init({
    pageList: pagelist,
    initContext: {
      number: 1
    }
  })
```
通过设置initContext, PageGo创建一个Context并使用Context.Provider包裹整个React应用，然后将每个页面组件包裹进Context.Consumer, 并将initContext值, setContext方法传递给页面props，这样你可以在页面中使用和设置全局状态了。

#### setContext方法设置状态

```js
  render() {
    return (
      <div>
        <div className='innerContainer'>
          <h3>number: {this.props.number}</h3>
          <button onClick={()=>{
            // 设置context状态值
            this.props.setContext({
              number: this.props.number + 1
            })
          }}></button>
        </div>
      </div>
      );
  }
```
以上示例代码在页面组件中展现了如下功能:
* 通过this.props.number获取到这个全局状态, 如果字段与页面间传值的props发生冲突, Context的全局状态优先级更高。
* 通过this.props.setContext设置number值加一, 这个设置将会更新这个全局状态的值

#### 子组件的Context
在页面组件中你不需要做额外的操作就能获取到全局状态，但是在页面组件的子组件中需要做一些额外的操作
```js
// index.jsx
import ShowNumber from './ShowNumber'

class Index extends React.Component {

  static defaultProps = {
    PageTitle: '首页'
  }

  render() {
    return (
      <div>
        <div className='innerContainer'>
          <ShowNumber></ShowNumber>
        </div>
      </div>
      );
  }
}
export default Index;


//  ShowNumber.jsx

import {Context} from 'pagego'
class ShowNumber extends React.Component {
  render() {
    return (
      <Context.Consumer>
      {({state, setContext}) => (
        <div>
          <h3>number: {state.number}</h3>
          <button onClick={()=>{
            setContext({
              number: state.number + 1
            })
          }}></button>
        </div>
      )}
      </Context.Consumer>
      );
  }
}
export default ShowNumber;
```
你需要在子组件中额外引用Context，并将其包裹你的子组件，并通过暴露出的state, setContext来获取和设置状态。或者使用[contextType](https://zh-hans.reactjs.org/docs/context.html#classcontexttype)

如果你的子组件是基于React Hook的，那你可以这样写：
```js
  const {state, setContext} = useContext(Context);
```

---


## Redux
PageGo支持Redux模式，在使用Redux模式前你需要知道以下几点:
1. PageGo会通过用户提供的连接器(Connector)来连接每个页面(Page), 因此你可以在每个页面中通过this.props来访问action和state
2. 续第一点, 由于PageGo是自动connect每个page，因此你无需手动链接，但是每个页面得到的action和state是一样的，所以建议只将公用的action和state传入连接器(Connector)。
3. PageGo内部不会引用任何redux相关的方法，因此非react打包时不会将redux打包进去
4. 续第三点, 所以在redux模式下，需要在初始化方法中传入Connector, Provider, store三个必要参数

```js
import { connect, Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
// 你的action
import * as Action from './action'
// 你编写的store
// 即由createStore方法创建的store
import store from './store';

// 你需要通过connect方法映射state和action来创建连接器
// 但请注意，请不要使用connect的第二个方法去绑定组件
// 因为在PageGo中会自动帮你绑定每个页面
const Connector = connect(state => ({
  ...state
}), dispatch => ({
  ...bindActionCreators(Action, dispatch)
}))

PageGo.init({
  pageList: pageList,
  Connector: Connector,
  // Provider即react-redux提供的Provider
  Provider: Provider,
  // 需要通过redux提供的createStore来创建store
  store: store
}).then(function() {
  // your code
})

```
在页面(page)中，你就可以这样使用了
```js
  // 使用action
  this.props.yourAction()
  //  获取state
  this.props.yourState
```
---

## 小技巧

### 预加载
当你判断用户在当前页面时很可能会点击下一个页面，为了节省用户前往下个页面的等待时间(即提升跳转体验)，你可以在当前页面对下一页面进行预加载
```js
  static defaultProps = {
    PreLoad: 'detail' // 若多个页面可写成['detail', 'test']数组形式
  }
```

或者在componentDidMount方法中调用预加载方法
```js
  componentDidMount = () => {
    PageGo.preLoad('detail');
  }
```

### 页面组件state恢复 (react hook页面组件不支持)
在开发过程中你可能会遇到这样的业务场景:
1. 在第一个页面中用户需要输入一些Input数据
2. 在未最终提交前，用户通过点击页面上的其他按钮前往其他页面进行操作
3. 这是之前的页面可能会被销毁掉
4. 用户返回原先页面，原先的页面被重新渲染， 这时需要仍保留用户之前的填写内容
在之前你可能会使用变量去保存这个数据再手动恢复，或者更高级点使用redux帮你管理这些状态

在PageGo你不需要做额外的操作，它将自动帮你恢复之前页面上的state, 唯一需要注意的是, 这些数据必须保持在页面本身的state上，如果这些state保留在页面的子组件上，请将这些状态提升至页面组件上。

设置state恢复不是默认的，你需要设置页面是否需要恢复
```js
  static defaultProps = {
    PageTitle: '首页',
    RestoreState: true // 设置页面支持state恢复
  }
```

## 示例
在git仓库的demo文件夹中含有示例代码, 你可以这么使用：
1. 将demo中的示例代码复制到你的工作目录中，例如将demo/normal 复制出来
2. 使用npm i安装
3. npm run dev, 打包完成后可以在http://localhost:8080/index.html 中查看样例
注意: demo都是使用正常路由的，它会为每个页面创建html文件，如果你将noHashRouter去除，使用hash路由，这些demo仍将正常工作。