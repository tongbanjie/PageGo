import PageGo from 'pagego';
import React from 'react'
import './index.css'

class HaveHead extends React.Component {

  static defaultProps = {
    PageTitle: 'havehead'
  }

  goNext = () => {
    PageGo.next('havehead/deep')
  }

  back = () => {
    PageGo.back();
  }

  render() {
    return (
      <div>
        <header style={{height: '44px'}}>
          <div className="backbut" onClick={this.back}>
            {`< back`}
          </div>
          Header
        </header>
        <div className='innerContainer' style={{top: '44px', bottom: '52px'}}>
          <h2>In this page, there is a Head and Footer</h2>
          <button onClick={this.goNext}>Next</button>
        </div>
        <footer style={{height: '52px'}}>Footer</footer>
      </div>
      );
  }
}

export default HaveHead;