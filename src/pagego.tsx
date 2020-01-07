import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EventEmitter, ListenerFn} from 'eventemitter3';
import APP from './app';
import route from './route';
import {viewPortInit, viewPort, showProtect, hideProtect} from './dom';
import './polyfill/string';
import './polyfill/Object-assign';
import {state} from './status'

interface Param {
  pageList: Function[],
  routerMode?: 'browser' | 'hash',
  viewportCss?: string,
  // 页面将被切换的钩子
  pageWillSwitch?: ListenerFn,
  // 页面切换完成的钩子
  pageDidSwitch?: ListenerFn,
  // context模式初始值
  initContext?: any,
  initState?: any,
  // useReducer模式
  reducer?: Function,
  // 全局props
  globalProps?: any,
  // 在主页用域名，子页用具体地址时使用，该值为域名和项目名间的中间值
  MidPathWhenOnlyDomain?: string,
  baseUrlWithoutProtocol?: string,
  noHashRouter?: boolean,
  Connector?: any,
  Provider?: any,
  store?: any
}

export default (function () {
  'use strict';
  // 初始化参数
  let Param:Param;
  let popHashArr = [], hoverTitles = [], preLoadArr = [];
  let Connector, Provider, store;
  // 首次加载页面标志用于首次加载需要重新replace
  let fromDirection:string;
  let app;
  const PageEvent = new EventEmitter()

  return {
    init: function(param:Param): Promise<void> {
      const {pageWillSwitch, pageDidSwitch, ...tempParam} = param;
      Param = tempParam;
      // pageList 是打包时注册的各页面的异步路由集合
      if (!param.pageList) {
        throw('PageGo.init needs the parameter "pageList" to initialize pages')
      }

      let hasConnector = !!param.Connector,
        hasProvider = !!param.Provider,
        hasStore = !!param.store;
      if (hasConnector && hasProvider && hasStore) {
        // 所以redux所需参数完备，调整为rdeux模式
        state.reduxMode = true;
        Connector = param.Connector;
        Provider = param.Provider;
        store = param.store;
      } else if (hasConnector || hasProvider || hasStore) {
        // 不具备redux所有完备参数，抛错
        throw('redux mode need both Connector, Provider and store')
      }

      // 监听页面切换事件
      pageWillSwitch && PageEvent.on('WILLSWITCH', pageWillSwitch);
      pageDidSwitch && PageEvent.on('DIDSWITCH', pageDidSwitch);

      // 路由初始化
      route.init(Param);

      // 视窗初始化
      viewPortInit(Param);

      // 监听路由事件
      window.addEventListener('popstate', evt=>{
        if (evt.state) {
          this.renderHistoryPage(evt.state);
        }
      }, false);

      return Promise.resolve();
    },

    preLoad: function(pagepath){
      if (pagepath) {
        let pathArr;
        if (typeof pagepath == 'string') {
          pathArr = [pagepath]
        } else {
          pathArr = pagepath;
        }
        const pathLen = pathArr.length;
        for (let i = 0; i < pathLen; i++) {
          // preLoadArr是已经预加载的列表，未预加载的才加载
          if (preLoadArr.indexOf(pathArr[i]) < 0) {
            Param.pageList[pathArr[i]]();
            preLoadArr.push(pathArr[i]);
          }
        }
      }
    },

    next: function(path: string, pageData?, callback?){
      this.go(path, 'next', pageData, callback)
    },

    hover: function(path: string, pageData?, callback?){
      this.go(path, 'next-hover', pageData, callback)
    },

    jump: function(path: string, pageData?, callback?){
      this.go(path, 'current', pageData, callback)
    },

    go: function(path: string, direction?:string, pageData?:Object, callback?, historyGo?, replace?){
      const [pagepath, pageSearch] = route.getRenderPath(path, Param.pageList);
      const pageFunc = Param.pageList[pagepath];
      const render = (page) => {
        this.renderGo(page, {
          pagePath: pagepath,
          pageSearch: pageSearch,
          direction: direction
        }, pageData, historyGo, replace);
        callback && callback();
      }
      // 通过判断是否有页面组件属性来判断是否是同步页面
      if (pageFunc.defaultProps || pageFunc.hookPage) {
        render(pageFunc);
      } else {
        // 否则认为是异步按需加载
        // 根据路由动态加载页面组件
        Param.pageList[pagepath]().then(page => {
          render(page);
        })
      }
    },

    // 获取到要滑动至的页面，并进行位置设置
    renderGo: function(currentpage, pageAttribute, pageData?, historyGo?, replace?) {
      // 若是经过redux connect函数包装过的页面组件，取内部组件
      const mayWrappedPage = currentpage.WrappedComponent || currentpage;
      const defaultProps = mayWrappedPage.defaultProps || mayWrappedPage.hookPage,
        preLoad = defaultProps.PreLoad;
      const direction = pageAttribute.direction || 'next';
      const PagePath = pageAttribute.pagePath,
        PageTitle = (pageData ? pageData.PageTitle : '') || defaultProps.PageTitle;
      // 将globalProps赋值给当前页面的数据，并且pageData优先
      let renderPageData = Object.assign({}, Param.globalProps, pageData);

      const switchParam = {
        pagePath: PagePath,
        pageTitle: PageTitle,
        pageData: renderPageData,
        routeForward: historyGo ? historyGo === 'forward' : true
      }
      // 若有注册页面开始回调事件，执行
      PageEvent.emit('WILLSWITCH', switchParam)

      // 根据是否是浏览器的前进后退操作确定正常到达当前页面的页面方向
      // 此页面方向提供给下一次浏览器操作时所用
      if (historyGo) {
        fromDirection = window.history.state.direction;
      } else {
        fromDirection = direction;
      }

      // 若是有预加载页面注册监听页面加载完成事件
      if (preLoad) {
        PageEvent.once('LOADPRE', ()=>{this.preLoad(preLoad)});
      }

      if (direction === 'next' || direction === 'back') {
        !state.firstRender && showProtect();
      } else if (direction === 'top' || direction === 'bottom'|| direction === 'next-hover') {
        // 展开保护层
        showProtect();
        setTimeout(function(){
          hideProtect();
        }, 350)
        popHashArr.push(state.nowPath);
        hoverTitles.push(document.title);
      }

      state.nowPath = PagePath.toLowerCase();
      document.title = PageTitle || '';

      if (!this.entryPageName) this.entryPageName = state.nowPath;

      // 非历史路由需要设置前往路径及pushstate
      if (!historyGo) {
        // 如果是首次加载(包括刷新等)
        if (state.firstRender) {
          const historyState = window.history.state;
          if (historyState && historyState.hasOwnProperty('index')) {
            state.nowIndex = historyState.index;
          }
          // 若是刷新页面时，使用之前保留的数据
          if (historyState && historyState.pageData) {
            pageData = renderPageData = historyState.pageData;
          }
        }

        route.setRoutePath({
          path: state.nowPath,
          index: state.nowIndex,
          direction: direction,
          pageSearch: pageAttribute.pageSearch,
          MidPathWhenOnlyDomain: Param.MidPathWhenOnlyDomain,
          replace: replace,
          // pushState及replaceState 是不允许存入function的
          // 通过这种方式去除function
          // 因此，跨页面传参时不要传入函数，因为这些函数很可能会失效
          pageData: pageData ? JSON.parse(JSON.stringify(pageData)) : null
        });
      }

      let appProps = {
        currentpage: currentpage,
        PagePath: PagePath,
        renderPageData: renderPageData,
        direction: direction,
        history: !!historyGo,
        initContext: Param.initContext || Param.initState,
        reducer: Param.reducer,
        // 根据上面得出的nowIndex及其他信息获取页面是否手势返回，当页面顺序为0时
        PageSwipeBack: state.nowIndex > 0 ? ((pageData ? pageData.PageSwipeBack : null) || defaultProps.PageSwipeBack || false) : false
      }
      // 使用react渲染页面
      if (state.firstRender) {
        this.renderFirstPage(appProps, switchParam);
      } else {
        this.renderPage(appProps, switchParam);
      }
    },
    // 渲染第一个页面
    renderFirstPage: function(props, switchParam){
      state.firstRender = false;
      const ctRef:any = React.createRef();
      ReactDOM.hydrate(
        state.reduxMode
        ? <Provider store={ store }>
            <APP {...props} ref={ctRef} Connector = { Connector }  />
          </Provider>
        : <APP ref={ctRef} {...props} />
        , viewPort, ()=>{
            app = ctRef.current;
            PageEvent.emit('DIDSWITCH', switchParam);
            PageEvent.emit('LOADPRE');
        })
    },
    // 渲染后续页面
    renderPage: function(props, switchParam){
      app.renderPage({
        ...props,
        // 非redux模式值为空
        Connector: Connector
      }, ()=>{
        // 若有注册页面切换成功回调事件，执行
        if (props.direction === 'current') {
          PageEvent.emit('DIDSWITCH', switchParam)
        } else {
          setTimeout(()=>{PageEvent.emit('DIDSWITCH', switchParam)}, 350);
        }
        PageEvent.emit('LOADPRE');
      });
    },
    // 类似于window.location.replace方法
    replace: function(pagepath, direction, pageData, callback?) {
      this.go(pagepath, direction, pageData, callback, null, true)
    },
    back: function(num?: number, touchback?: boolean) {
      route.back(num, touchback);
    },
    renderHistoryPage: function(pageInfo) {
      const pagePath = pageInfo.path,
        thisIndex = pageInfo.index,
        dvalue = state.nowIndex - thisIndex;
      // 将浏览器历史渲染页面次序赋值给当前页面顺序
      state.nowIndex = thisIndex;
      // 浏览器后退
      if (dvalue > 0) {
        if (fromDirection === 'current' || fromDirection === 'next') {
          this.go(pagePath, fromDirection === 'current' ? 'current' : 'back', pageInfo.pageData, null, 'backward')
        } else if (fromDirection === 'top' || fromDirection === 'bottom' || fromDirection === 'next-hover'){
          !state.swipeback && app.hoverBack(dvalue);
          state.nowPath = popHashArr.splice(-dvalue, dvalue)[0];
          // hover返回后重置title
          document.title = hoverTitles.splice(-dvalue, dvalue)[0];
          fromDirection = pageInfo.direction;
        } else {
          console.error('路由出错了')
        }
        state.swipeback = false
        // 否则前进
      } else {
        this.go(pagePath, pageInfo.direction, pageInfo.pageData, null, 'forward');
      }
    }
  };
})();
