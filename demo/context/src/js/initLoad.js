import PageGo from 'pagego';
// 该文件会在打包时自动创建
import pageList from '../../packCache/importpage.js';
import FastClick from 'fastclick';
import '../css/exp.css';

!!document.body && FastClick.attach(document.body);

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {number: state.number + 1};
    case 'decrement':
      return {number: state.number - 1};
    default:
      throw new Error();
  }
}

const initialState = {number: 1};

PageGo.init({
  pageList: pageList,
  routerMode: 'browser',
  initContext: initialState,
  // reducer: reducer
}).then(function() {
  PageGo.go(window.initPagePath);
});
