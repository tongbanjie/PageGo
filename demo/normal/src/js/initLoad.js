import PageGo from 'pagego';
// 该文件会在打包时自动创建
import pageList from '../../packCache/importpage.js';
import FastClick from 'fastclick';
import '../css/exp.css';

PageGo.init({
  pageList: pageList,
  // 使用浏览器路由，可将此值设置为hash，demo将以hash路由方式正常工作
  // 若不设置此项，默认以hash路由工作
  routerMode: 'browser'
}).then(function() {
  PageGo.go(window.initPagePath);
});

!!document.body && FastClick.attach(document.body);
