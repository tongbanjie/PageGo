import * as React from 'react';
import { Page, HoverPage } from './page';
import Container from './container';
import {Provider, ReducerProvider} from './context';

interface Props {
  PageName?: string,
  index?: string|number,
  currentpage: any,
  renderPageData?: any,
  key?: string,
  Connector?: any,
  initContext?: any,
  reducer?: Function,
  PageSwipeBack: boolean,
  preventClickPop: HTMLElement,
  back: Function
}
interface State {
  hoverPages: any[],
  pages: any[],
  direction: string,
  PageSwipeBack: boolean,
  pageSetType: 'NORMAL' | 'PRE_RE_SET'
}

// APP父组件
class APP extends React.Component<Props, State> {
  nowPage: any
  prePage: any
  hoverRefs: any[]

  constructor(props:Props) {
    super(props);
    this.nowPage = <Page key={props.PageName ? (props.PageName + props.index) : 'ssr'} {...props} />;
    this.hoverRefs = [];

    this.state = {
      pages:  [
                <Page key='1' />,
                this.nowPage,
                <Page key='3' />
              ],
      hoverPages: [],
      direction: '',
      pageSetType: 'NORMAL',
      PageSwipeBack: props.PageSwipeBack
    }
  }

  // 渲染页面方法
  renderPage = (pageInfo, callback) => {
    if (pageInfo.direction == 'next' || pageInfo.direction == 'back' || pageInfo.direction == 'current') {
      let key = pageInfo.PageName + pageInfo.index;
      // 如果到往的页面就是当前页面的来源页面，则交换页面，不需要重新渲染
      if (this.prePage && this.prePage.key === key && pageInfo.history) {
        [this.prePage, this.nowPage] = [this.nowPage, this.prePage]
      } else {
        [this.prePage, this.nowPage] = [this.nowPage, <Page key={key} {...pageInfo} />];
      }
      if (pageInfo.direction == 'next') {
        this.setState({
          pages: [
            <Page key='1' />,
            this.prePage,
            this.nowPage
          ],
          PageSwipeBack: pageInfo.PageSwipeBack,
          direction: pageInfo.direction,
          pageSetType: 'PRE_RE_SET'
        }, callback)
      } else if (pageInfo.direction == 'back') {
        try {
          const backHook = this.prePage.props.currentpage.defaultProps.BackHook;
          backHook && backHook();
        } catch {}

        this.setState({
          pages: [
            this.nowPage,
            this.prePage,
            <Page key='3' />
          ],
          PageSwipeBack: pageInfo.PageSwipeBack,
          direction: pageInfo.direction,
          pageSetType: 'PRE_RE_SET'
        }, callback)
      } else if (pageInfo.direction == 'current') {
        this.setState({
          pages: [
            <Page key='1' />,
            this.nowPage,
            <Page key='3' />
          ],
          PageSwipeBack: false,
          direction: pageInfo.direction
        }, callback)
      }
    } else {
      const len = this.hoverRefs.length;
      this.hoverRefs.push(React.createRef());
      this.setState({
        PageSwipeBack: pageInfo.PageSwipeBack,
        hoverPages: this.state.hoverPages.concat(<HoverPage ref={this.hoverRefs[len]} back={this.props.back} uninstall={this.hoverUninstall} key={pageInfo.PageName + pageInfo.index} {...pageInfo} />)
      })
    }
  }

  // 转场后，重置页面顺序
  reSetPage = () => {
    if (this.state.direction == 'next') {
      this.setState({
        pages: [
          this.prePage,
          this.nowPage,
          <Page key='3' />
        ],
        pageSetType: 'NORMAL'
      })
    } else if (this.state.direction == 'back') {
      this.setState({
        pages: [
          <Page key='1' />,
          this.nowPage,
          <Page key='3' />
        ],
        pageSetType: 'NORMAL'
      })
    }
  }

  // 弹出页返回，将调用最顶层弹出页的返回方法
  hoverBack = (num) => {
    if (num === 1) {
      const len = this.hoverRefs.length;
      const lastHover = this.hoverRefs[len-1];
      lastHover.current.hoverBack();
    } else {
      // 若弹出页一次返回多个页面的，不做动画，直接卸载
      this.hoverUninstall(num)
    }
  }

  // 弹出页返回动画后，卸载该页面
  hoverUninstall = (num) => {
    num = num || 1;
    this.hoverRefs.splice(-num, num)

    let tmpState:any = {
      hoverPages: this.state.hoverPages.slice(0, -num)
    }
    // 如果hoverpage最后一块被滑出，需要重新设置普通页面当前的PageSwipeBack
    if (this.hoverRefs.length === 0) {
      tmpState.PageSwipeBack = this.nowPage.props.PageSwipeBack
    }
    this.setState(tmpState)
  }

  render() {
    const container = 
      <React.Fragment>
        <Container
          reSetPage={this.reSetPage}
          PageSwipeBack={this.state.PageSwipeBack}
          preventClickPop={this.props.preventClickPop}
          back={this.props.back}
          direction={this.state.direction}
          pageSetType={this.state.pageSetType}>
          {
            this.state.pages
          }
        </Container>
        {
          this.state.hoverPages
        }
      </React.Fragment>
    return (
      <React.Fragment>
        {
          this.props.initContext && !this.props.reducer
          ? <Provider initContext={this.props.initContext}>{container}</Provider>
          : (
            this.props.reducer
            ? <ReducerProvider initContext={this.props.initContext} reducer={this.props.reducer}>{container}</ReducerProvider>
            : container
          )
        }
        <style>
          {`
          .clearfix:after {
            display: table;
            clear: both;
            content: '';
          }

          .pagego-screenPage {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
          .pagego-pageContainer {
            width: 300%;
            height: 100%;
            position: absolute;
            -webkit-transform: translate3d(-33.3333%, 0, 0);
            transform: translate3d(-33.3333%, 0, 0);
            touch-action: none;
          }

          .pagego-pageContainer .pagego-page {
            width: 33.333334%;
            height: 100%;
            position: relative;
            float: left;
            overflow: hidden;
          }

          .pagego-pageContainer .pagego-page .innerContainer {
            position: absolute;
            top:0px;
            bottom: 0px;
            -webkit-overflow-scrolling:touch;
            width: 100%;
            overflow-y: auto;
          }

          .pagego-hoverPage{
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #fff;
            -webkit-transition: -webkit-transform 0.3s;
            transition: transform 0.3s;
            box-shadow: -1px 0px 9px rgba(0,0,0,0.12);
            -webkit-box-shadow: -1px 0px 9px rgba(0,0,0,0.12);
          }

          .pagego-hoverPage .footerContainer,.pagego-pageContainer .pagego-page .footerContainer{
            background-color: #fff;
            overflow: hidden;
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0
          }

          .pagego-hoverPage .pagego-page{
            position: relative;
          }

          .pagego-hoverPage .innerContainer {
            -webkit-overflow-scrolling:touch;
            width: 100%;
            z-index: 90;
          }

          .pagego-animateTop{
            -webkit-transform: translate(0%,100%);
            transform: translate(0%,100%);
          }
          .pagego-animateBot{
            -webkit-transform: translate(0%,-100%);
            transform: translate(0%,-100%);
          }
          .pagego-animateNext{
            -webkit-transform: translate(100%,0%);
            transform: translate(100%,0%);
          }

          .pagego-preventClickPop {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 999;
            display: none;
          }
        `}
        </style>
      </React.Fragment>
    );
  }
}

export default APP
