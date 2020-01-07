import PageGo from 'pagego';
import pageList from './js/pagesroute';
import FastClick from 'fastclick';
import './css/base.css';
import './css/exp.css';

PageGo.init({
  pageList: pageList,
  pageWillSwitch: (data)=>{
  },
  // 使用浏览器路由，可将此值设置为hash，demo将以hash路由方式正常工作
  // 若不设置此项，默认以hash路由工作
  routerMode: 'browser',
  renderMethod: process.env.NODE_ENV === 'production' ? 'hydrate' : 'render'
}).then(function() {
  PageGo.go(window.initPagePath);
});

!!document.body && FastClick.attach(document.body);
