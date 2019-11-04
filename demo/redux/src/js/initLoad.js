import PageGo from 'pagego';
import { Provider } from 'react-redux';
import store from './store';
import Connector from './connector';
// 该文件会在打包时自动创建
import pageList from '../../packCache/importpage.js';
import FastClick from 'fastclick';
import '../css/exp.css';

PageGo.init({
  pageList: pageList,
  routerMode: 'browser',
  Connector: Connector,
  Provider: Provider,
  store: store
}).then(function() {
  PageGo.go(window.initPagePath);
});

!!document.body && FastClick.attach(document.body);
