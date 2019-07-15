import * as React from 'react';
import {EventEmitter} from 'eventemitter3';
import Touch from './touch';

interface Props {
  reSetPage: Function,
  preventClickPop: HTMLElement,
  back: Function,
  PageSwipeBack: boolean,
  pageSetType: string,
  direction: string
}

const EE = new EventEmitter()

class Container extends React.Component<Props> {
  start: {
    x: number,
    y: number,
    time: number
  }
  delta: {
    x: number,
    y: number
  }
  pageWidth: number
  swipeRef: any
  events: Touch

  constructor(props:Props) {
    super(props);
    this.swipeRef = React.createRef();
    this.pageWidth = window.innerWidth;
  }

  componentDidMount = () => {
    // 由于react不支持设置touch事件的第三个参数 
    // 通过ref在原生元素上绑定事件
    const containerElement = this.swipeRef.current;

    this.events = new Touch(this);
    containerElement.addEventListener('touchstart', this.events.touchStart, false)
    containerElement.addEventListener('touchmove', this.events.touchMove, false)
    containerElement.addEventListener('touchend', this.events.touchEnd, false)
    containerElement.addEventListener('touchforcechange', function() {}, false)
  }

  componentDidUpdate = (prevProps, prevState) => {
    const pageSetType = this.props.pageSetType,
      direction = this.props.direction;
    // 判断页面是否在切换
    if (pageSetType !== prevProps.pageSetType) {
      if (pageSetType === 'PRE_RE_SET') {
        if (direction === 'next') {
          this.translate('-66.666666', 350 , true)
        } else if (direction == 'back') {
          // 触摸渲染顺序: 手势滑动 >> 页面动画 >> 触发渲染 >> 渲染完成 >> 触发重置
          // 目前这步属于渲染完成，对页面进行重置触发
          if (this.events.touchStatus === 'end') {
            this.events.touchStatus = ''
            EE.emit('swipeEnd')
          } else {
            // 正常点击返回的渲染顺序为
            // 触发渲染 >> 渲染完成 >> 页面动画 >> 动画完成 >> 触发重置
            // 在这里属于渲染已经完成，进行页面动画
            this.translate('0', 350 , true);
          }
        }
      } else if (pageSetType === 'NORMAL') {
        this.translate('-33.333333', 0 , true);
      }
    }
  }

  translate = (dist, speed, ispercent?)=> {
    const slide = this.swipeRef.current;
    const style = slide && slide.style;

    style.webkitTransition = style.transition = 'transform ' + speed + 'ms ease';
    if (ispercent) {
      style.webkitTransform = 'translate3d('+dist+'%,0,0)';
    } else {
      style.webkitTransform = 'translate3d(' + (dist - this.pageWidth) + 'px,0,0)';
    }
    
  }

  // next与back转场后会触发
  // 将重置页面顺序
  transitionEnd = (e) => {
    // 若是手势滑动后，并且是无效滑动则直接返回
    if (this.events.touchStatus === 'end') {
      if (!this.events.isValidSlide) { this.events.touchStatus = '';return}
      EE.once('swipeEnd', ()=>{
        this.props.reSetPage();
        this.props.preventClickPop.style.display = 'none';
      });
      this.props.back(-1, true);
    } else {
      const el = e || window.event;
      const target = el.target || el.srcElement;
      if (target.tagName.toLowerCase() === 'div' && target.id == 'pageContainer') {
        // 销毁旧旧页面并重置当前页面
        this.props.reSetPage();
        this.props.preventClickPop.style.display = 'none';
      }
    }
  }

  render() {
    const PageSwipeBack = this.props.PageSwipeBack;
    return (
      <div id="pageContainer" ref={this.swipeRef}
        onTransitionEnd={this.transitionEnd}
        className="pagego-pageContainer clearfix">
        {
          this.props.children
        }
      </div>
    );
  }
}

export default Container