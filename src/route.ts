import {state} from './status'

export default(function(){
  // 判断是否支持history.replaceState
  const noHistoryState = typeof(window) === 'undefined' ? false: !window.history.replaceState ;
  // hash路由在url中的#后面标记页面，但是整体还是走pushstate
  // 默认使用hash标记路由
  let hashRouter = true;
  // pagepath可能的参数
  // let pageSearch = '';
  // base url
  let baseurl = '';
  return {
    init: function(param){
      // 如果手动设置了baseurl
      if (param.baseUrlWithoutProtocol) {
        baseurl = location.protocol + '//' + param.baseUrlWithoutProtocol;
        baseurl = baseurl.endsWith('/') ? (baseurl + '/') : baseurl;
      }
      if (param.routerMode){
        hashRouter = param.routerMode === 'hash';
      }
      // 若设置不使用hash路由，设置hashRouter为false
      if (param.noHashRouter) {
        hashRouter = false
      }
    },
    setRoutePath: function(pageInfo){
      const {replace, MidPathWhenOnlyDomain, ...pushInfo} = pageInfo;
      const pushUrl = hashRouter ? this.getHashPushUrl(pageInfo) : this.getBrowserPushUrl(pageInfo, MidPathWhenOnlyDomain);
      // 若不支持pushState，pushUrl已在getPushUrl方法中添加了传参
      if(noHistoryState && !state.firstRender) {
        window.location.href = pushUrl;
      } else {
        if (replace || state.firstRender) {
          window.history.replaceState(pushInfo, null, pushUrl)
        } else {
          pushInfo.index = state.nowIndex = (state.nowIndex + 1);
          window.history.pushState(pushInfo, null, pushUrl)
        }
      }
    },
    getRenderPath: function(path:string, pageList){
      let pagepath = path, pageSearch:string = '';
      // 当使用hash路由时
      // 首次进入判断是否是刷新
      if (state.firstRender) {
        const hashstring = window.location.hash;
        if (hashstring) {
          let hash = hashstring.split('#')[1];
          if (!!pageList[hash]) {
            pagepath = hash;
          }
        }
      }
      
      if (pagepath.indexOf('?') > 0) {
        pageSearch = pagepath.split('?')[1];
        pagepath = pagepath.split('?')[0];
      }

      return [pagepath, pageSearch];
    },

    getHashPushUrl: function(pageInfo){
      const pageData = pageInfo.pageData;
      const pageSearch = pageInfo.pageSearch;
      const prefixUrl = location.origin + location.pathname;
      let pushUrl = '', search = location.search, appendSearch = '';

      // 有加url参数的进行变更
      if (pageData && pageData.PushUrlParam) {
        appendSearch = this.getAppendParamUrl(pageData.PushUrlParam);
        // 老版本不能兼容pushState, 通过url传递Props
        if (noHistoryState && pushUrl.indexOf('passprops')<0) {
          const passProps = ('passprops=' + encodeURIComponent(JSON.stringify(pageData)));
          appendSearch = appendSearch + '&' + passProps;
        }

        // 当未设置CleanUrl时将search传递下去
        if (!pageData.CleanUrl) {
          appendSearch = (search ? (search + '&') : '?') + appendSearch;
        } else {
          appendSearch = '?' + appendSearch
        }
      } else if (!pageData || !pageData.CleanUrl) {
        // 当未设置CleanUrl时将search传递下去
        appendSearch = search;
      }
      // 如果传递的pagepath含有参数，则往下传递
      // CleanUrl只会清除当前页面的search，因此下一个页面的search这里不会被清除
      if (pageSearch) {
        if (appendSearch) {
          appendSearch = appendSearch + '&' + pageSearch
        } else {
          appendSearch = '?' + pageSearch
        }
      }

      pushUrl = prefixUrl + appendSearch + '#' + state.nowPath

      return pushUrl

    },

    getBrowserPushUrl: function(pageInfo, MidPathWhenOnlyDomain){
      const pageData = pageInfo.pageData;
      const pageSearch = pageInfo.pageSearch;
      const preUrl = location.origin + location.pathname;
      const hash = location.hash, search = location.search;
      const suffixPath = state.nowPath + (preUrl.endsWith('.html') ? '.html' : '');
      let pushUrl = '';

      // 获取基础url
      if (!baseurl && state.firstRender) {
        if (preUrl.endsWith(suffixPath)) {
          baseurl = preUrl.replace(suffixPath, '')
        } else {
          baseurl = preUrl;
        }
      }

      if (window.location.pathname === '/') {
        // 如https://m.xxx.com/ 的形态情况下处理
        pushUrl = preUrl;
      } else {
        if (MidPathWhenOnlyDomain) {
          pushUrl = baseurl + MidPathWhenOnlyDomain + suffixPath;
        } else {
          // 默认url
          pushUrl = baseurl + suffixPath;
        }
      }
      
      // 当未设置CleanUrl时将hash和search传递下去
      if (!pageData || !pageData.CleanUrl) {
        pushUrl = pushUrl + search + hash;
      }

      // 若有设置使用URL参数
      if (pageData && pageData.PushUrlParam || pageSearch) {
        let appendUrl = '';
        if (pageData && pageData.PushUrlParam) {
          appendUrl = this.getAppendParamUrl(pageData.PushUrlParam);
        }
        // pagepath含有参数的
        if (pageSearch) {
          appendUrl += ((appendUrl ? '&' : '') + pageSearch);
        }
        if (state.firstRender) {
          pushUrl = (pushUrl + (pushUrl.indexOf('?') > 0 ? '&' : '?') + appendUrl);
        } else {
          pushUrl = pushUrl.split('?')[0] + '?' + appendUrl;
        }
      }

      // 兼容不支持history.state的设备
      if (noHistoryState && pageData && pushUrl.indexOf('passprops')<0) {
        const passProps = ('passprops=' + encodeURIComponent(JSON.stringify(pageData)));
        pushUrl = (pushUrl + (pushUrl.indexOf('?') > 0 ? '&' : '?') + passProps);
      }

      return pushUrl
    },

    getAppendParamUrl: function(param){
      let appendArr = [];
      for (var key in param) {
        if (typeof(param[key]) == 'object') {
          appendArr.push(key + '=' + JSON.stringify(param[key]))
        } else {
          appendArr.push(key + '=' + param[key])
        }
      }
      return appendArr.join('&')
    },
    back: function(num?: number, touchback?: boolean) {
      window.history.go(num || -1);
      state.swipeback = !!touchback;
    }
  }
}())