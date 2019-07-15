import PageGo from 'pagego';
import React from 'react'

class Swipe extends React.Component {

  static defaultProps = {
    PageTitle: 'swipe',
    PageSwipeBack: true
  }
  
  change = (e) => {
    this.setState({
      message: e.target.value
    })
  }

  goNext = () => {
    PageGo.next('havehead')
  }

  back = () => {
    PageGo.back();
  }

  render() {
    return (
      <div>
        <div className='innerContainer'>
          <div className="back" onClick={this.back}>
            {`< back`}
          </div>
          <h2>In this page, you can use gesture to return</h2>
          <button onClick={this.goNext}>Next</button>
        </div>
      </div>
      );
  }
}

export default Swipe;