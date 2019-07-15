import PageGo from 'pagego';
// 该文件会在打包时自动创建
import pageList from '../../packCache/importpage.js';
import FastClick from 'fastclick';
import '../css/exp.css';

PageGo.init({
  pageList: pageList,
  // 在本demo中会为每个page创建html文件，因此可以使用正常路由
  // 如果你将此项noHashRouter删除，demo仍将正常工作
  noHashRouter: true
}).then(function() {
  PageGo.go(window.initPagePath);
});

!!document.body && FastClick.attach(document.body);
