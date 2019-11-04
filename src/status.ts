interface State {
  firstRender: boolean,
  nowPath: string,
  nowIndex: number,
  reduxMode: boolean,
  swipeback: boolean
}


let state:State = {
  // 是否是首次页面渲染
  firstRender: true,
  // 当前页面路由路径
  nowPath: '',
  // 当前页面次序号
  nowIndex: 0,
  // redux模式, 默认为否
  reduxMode: false,
  // 是否是手势返回
  swipeback: false
}

export {state}
