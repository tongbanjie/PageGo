import * as React from 'react'
import Touch from './touch'
import {Context} from './context'
import route from './route';

interface PageProps {
  currentpage?: any,
  renderPageData?: any,
  key?: string,
  Connector?: any,
  initContext?: any
}

let stateStore = {}

const PageFactory = (pageProps) => {

  return (WrappedComponent:React.ComponentClass) => {

    return class HOC extends WrappedComponent {

      key: string
      props: any

      constructor(props) {
        super(props)
        this.key = pageProps.PagePath + pageProps.index + (props.PageKey ? ('/' + props.PageKey) : '');
        // 如果有存储的state数据，恢复至页面
        if (!!stateStore[this.key]) {
          Object.assign(this.state, stateStore[this.key]);
        }
      }

      componentWillUnmount = () => {
        // 如果设置离页面恢复，存储页面state
        if (this.props.RestoreState) {
          stateStore[this.key] = this.state;
        }
      }

      render() {
        return super.render()
      }
    }
  }
}

export class Page extends React.Component<PageProps> {

  render() {
    const {currentpage, ...pageProps} = this.props;
    let InnerPage;
    if (currentpage) {
      // hook 页面不支持state恢复
      const wrappedpage = currentpage.WrappedComponent || currentpage;
      if (!!wrappedpage && wrappedpage.hookPage) {
        InnerPage = currentpage;
      } else {
        if (currentpage) {
          InnerPage = PageFactory({
            ...pageProps
          })(currentpage);
        }
      }
      // 如果是redux模式 通过Connector生成新的InnerPage
      if (this.props.Connector) {
        InnerPage = this.props.Connector(InnerPage);
      }
    }
    return (
      <div className='pagego-page'>
      {
        currentpage
        ? (
          this.props.initContext
          ? <Context.Consumer>
            {({state, setContext, dispatch}) => (
              <InnerPage {...pageProps.renderPageData} {...state} setContext={setContext} dispatch={dispatch} />
            )}
            </Context.Consumer>
          : <InnerPage {...pageProps.renderPageData} />
        )
        : null
      }
      </div>
    );
  }
}

interface HoverProps {
  uninstall: () => void,
  direction: string,
  currentpage: any,
  renderPageData: any,
  PageSwipeBack: boolean,
  back: Function,
  Connector?: any
}

interface HoverState {
  close?: boolean,
  style: React.CSSProperties
}

export class HoverPage extends React.Component<HoverProps, HoverState> {

  innerPage: any
  hoverRef: any
  events: Touch

  constructor(props) {
    super(props);

    const {currentpage, ...pageProps} = props
    let InnerPage;
    // 可能已经是被connect过的组件
    const wrappedpage = currentpage.WrappedComponent || currentpage;
    // hook 页面不支持state恢复及redux模式
    if (!!wrappedpage && wrappedpage.hookPage) {
      InnerPage = currentpage
    } else {
      InnerPage = PageFactory({
        ...pageProps
      })(currentpage)
    }
    if (this.props.Connector) {
      InnerPage = this.props.Connector(InnerPage)
    }

    // 根据initContext判断是否是Context模式
    this.innerPage = !!props.initContext
      ? <Context.Consumer>
        {({state, setContext, dispatch}) => (
          <InnerPage {...pageProps.renderPageData} {...state} setContext={setContext} dispatch={dispatch} />
        )}
        </Context.Consumer>
      : <InnerPage {...pageProps.renderPageData} />

    this.hoverRef = React.createRef();

    this.state = {
      style: null
    }
  }

  componentDidMount = () => {
    setTimeout(()=>{
      this.setState({
        style: {
          WebkitTransform: 'translate(0%,0)',
          transform: 'translate(0%,0)'
        }
      })
    }, 20)

    // 如果支持滑动，则绑定touch事件
    if (this.props.PageSwipeBack) {
      // 由于react不支持设置touch事件的第三个参数 
      // 通过ref在原生元素上绑定事件
      const containerElement = this.hoverRef.current

      this.events = new Touch(this);
      containerElement.addEventListener('touchstart', this.events.touchStart, false)
      containerElement.addEventListener('touchmove', this.events.touchMove, false)
      containerElement.addEventListener('touchend', this.events.touchEnd, false)
      containerElement.addEventListener('touchforcechange', function() {}, false)
    }

  }

  translate = (dist, speed, ispercent?)=> {
    const slide = this.hoverRef.current;
    const style = slide && slide.style;

    style.webkitTransition = style.transition = 'transform ' + speed + 'ms ease';
    if (ispercent) {
      style.webkitTransform = 'translate3d('+dist+'%,0,0)';
    } else {
      style.webkitTransform = 'translate3d(' + (dist) + 'px,0,0)';
    }
    
  }

  // 动画结束回调事件，若是关闭的话，卸载组件
  transitionEnd = () => {
    if (this.events && this.events.touchStatus === 'end' && this.events.isValidSlide) {
      route.back(-1, true);
      this.props.uninstall();
    }
    this.state.close && this.props.uninstall();
  }

  hoverBack = () => {
    this.setState({
      style: null,
      close: true
    })
  }

  render() {
    let hoverClass = ''
    if (this.props.direction === 'top') {
      hoverClass = 'pagego-hoverPage pagego-animateTop';
    } else if (this.props.direction === 'bottom') {
      hoverClass = 'pagego-hoverPage pagego-animateBot'
    } else {
      hoverClass = 'pagego-hoverPage pagego-animateNext'
    }
    return (
      <div ref={this.hoverRef} style={this.state.style} onTransitionEnd={this.transitionEnd} className={hoverClass}>
      {
        this.innerPage
      }
      </div>
    );
  }
}
