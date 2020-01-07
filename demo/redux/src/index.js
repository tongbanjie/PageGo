import PageGo from 'pagego';
import { Provider } from 'react-redux';
import store from './js/store';
import Connector from './js/connector';
import pageList from './js/pagesroute';
import FastClick from 'fastclick';
import './css/base.css';
import './css/exp.css';

PageGo.init({
  pageList: pageList,
  routerMode: 'browser',
  Connector: Connector,
  Provider: Provider,
  store: store,
  renderMethod: process.env.NODE_ENV === 'production' ? 'hydrate' : 'render'
}).then(function() {
  PageGo.go(initPagePath);
});

!!document.body && FastClick.attach(document.body);