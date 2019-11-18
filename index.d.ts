import {Provider, InferableComponentEnhancerWithProps} from 'react-redux'
import {Store} from 'redux'

interface SwitchData{
  /**
   * The page route path
   */
  pagePath: string,
  /**
   * The page title
   */
  pageTitle: string,
  /**
   * Page data passed from previous page
   */
  pageData: object,
  /**
   * If the route is forward, this value will return true
   */
  routeForward: boolean
}

interface InitParam{
  /**
   * Page component object list, see detail https://github.com/tongbanjie/PageGo/wiki/PageList
   */
  pageList: object,
  /**
   * You should use "routerMode" to replace this
   */
  noHashRouter?: boolean,
  /**
   * If your entry address is like "https://m.xxx.com/", and follow-up page address is like "https://m.xxx.com/abc/xyz/detail.html", you should set this value like "m.xxx.com/abc/xyz"
   */
  baseUrlWithoutProtocol?: string,
  /**
   * set the routing mode, optional 'browser' and 'hash', if not set, the default is hash routing
   */
  routerMode?: 'browser' | 'hash',
  /**
   * This function will be called before each page is rendered.
   */
  pageWillSwitch?(data:SwitchData):void,
  /**
   * This function will be called after each page is rendered and switching completed.
   */
  pageDidSwitch?(data:SwitchData):void,
  /**
   * For example, if you set this object to {number:1}, you can use this.props.number in each page
   */
  globalProps?: object,
  initContext?: object,
  initState?: object,
  Connector?: InferableComponentEnhancerWithProps<{any},{}>,
  /**
   * Provider: import { Provider } from 'react-redux'
   */
  Provider?: any,
  store?: Store
}

declare module 'pagego'{
  function init(param:InitParam):Promise<void>;
  /**
   * The "go" method use page path to render page
   */
  function go(path:string, direction?:'next' | 'top' | 'bottom' | 'next-hover' | 'current', pageData?:Object, callback?:()=>void):void;
  /**
   * Convenient way of go('YOURPATH', 'next')
   */
  function next(path:string, pageData?:Object, callback?:()=>void):void;

  /**
   * Convenient way of go('YOURPATH', 'next-hover')
   */
  function hover(path:string, pageData?:Object, callback?:()=>void):void;

  /**
   * Convenient way of go('YOURPATH', 'current')
   */
  function jump(path:string, pageData?:Object, callback?:()=>void):void;

  /**
   * Like window.location.replace
   */
  function replace(path:string, direction?:'next' | 'top' | 'bottom' | 'next-hover' | 'current', pageData?:Object, callback?:()=>void):void;

  /**
   * Like window.history.back
   */
  function back(num?: number):void;

  /**
   * Like window.history.back
   */
  function preLoad(path: string | string[]):void;
}