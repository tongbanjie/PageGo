import PageGo from 'pagego';
import React from 'react'

class Deep extends React.Component {

  static defaultProps = {
    PageTitle: 'deep'
  }
  
  goNext = () => {
    PageGo.next('hook')
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
          <h2>This is deep route page</h2>
          <p>If your page requires multiple levels of routing, first create a subfolder under the parent page folder, then create a subpage named after the index under the subfolder.</p>
          <p className='warn'>The deep route html file is created by gulp, not PageGo.</p>
          <button onClick={this.goNext}>Next</button>
        </div>
      </div>
      );
  }
}

export default Deep;