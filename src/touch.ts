class Touchs {
  isValidSlide: boolean
  pageWidth: number
  speed: number
  touchStatus: 'start' | 'end' | 'good' | 'bad' | ''
  start: {
    x: number,
    y: number,
    time: number
  }
  delta: {
    x: number,
    y: number
  }

  top: any

  constructor(top) {
    this.isValidSlide = false;
    this.top = top
    this.touchStatus = '';
    this.pageWidth = window.innerWidth;
    this.speed = 300
  }

  touchStart = (event) => {
    if (!this.top.props.PageSwipeBack) return
    var touches = event.touches[0];
    this.touchStatus = 'start';
    // 记录起始点位置
    this.start = {
      x: touches.pageX,
      y: touches.pageY,
      // store time to determine touch duration
      time: +new Date()
    };

  }

  touchMove = (event) => {
    if (!this.top.props.PageSwipeBack) return
    // 如果用户是多指滑动，或者是向右滑动的，滑动无效
    if (event.touches.length > 1 || (event.scale && event.scale !== 1) || this.touchStatus === 'bad')
      return;

    let touches = event.touches[0];
    // 记录当前滑动点与起始点距离
    this.delta = {
      x: touches.pageX - this.start.x,
      y: touches.pageY - this.start.y
    };

    if (this.touchStatus === 'start') {
      // 滑动冗余量，10px
      if (Math.abs(this.delta.x)<10) return
      // 不支持向右滑动, 如果大于最初冗余量并且是竖向滑动，则认为支持滑动失效
      if (this.delta.x < 0 || Math.abs(this.delta.x) < Math.abs(this.delta.y)) {
        this.touchStatus = 'bad'
        return
      } else {
        this.touchStatus = 'good'
      }
    }

    if (this.touchStatus === 'good' && this.delta.x < 0) return

    // prevent native scrolling
    event.preventDefault();
    this.delta.x =
    this.delta.x /
    ( false && this.delta.x > 0
      ? 2 // determine resistance level
      : 1); // no resistance if false

    // translate 1:1
    this.top.translate(this.delta.x-10, 0);
  }

  touchEnd = (event) => {
    if (!this.delta || !this.top.props.PageSwipeBack) return;
    // measure duration
    const duration = +new Date() - this.start.time;
    const delta = this.delta
    const width = this.pageWidth
    // determine if slide attempt triggers next/prev slide
    this.isValidSlide = this.touchStatus === 'good' &&
      (Number(duration) < 250 && // if slide duration is less than 250ms
        Math.abs(delta.x) > 20) || // and if slide amt is greater than 20px
        Math.abs(delta.x) > width / 2; // or if slide amt is greater than half the width

    // determine direction of swipe (true:right, false:left)
    const direction = delta.x < 0;

    if (this.isValidSlide) {
      if (direction) {
        this.top.translate(-width, this.speed);
      } else {
        this.top.translate(width, this.speed);
      }
    } else {
      this.top.translate(0, this.speed);
    }
    this.touchStatus = 'end';
    this.delta = undefined
  }
}

export default Touchs