import PageGo from 'pagego';
// 该文件会在打包时自动创建
import pageList from '../../packCache/importpage.js';
import FastClick from 'fastclick';
import '../css/exp.css';

!!document.body && FastClick.attach(document.body);

PageGo.init({
  pageList: pageList,
  noHashRouter: true,
  initContext: {
    number: 1
  }
}).then(function() {
  PageGo.go(window.initPagePath);
});
