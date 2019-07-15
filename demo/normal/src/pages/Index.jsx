import PageGo from 'pagego';
import React from 'react'

class Index extends React.Component {

  static defaultProps = {
    PageTitle: 'index'
  }
  
  goNext = () => {
    PageGo.next('second')
  }

  goHover = () => {
    PageGo.hover('hover')
  }

  render() {
    return (
      <div>
        <div className='innerContainer' style={{ top: '0px' }}>
          <h2 style={{marginTop: '32px'}}>Hello World!</h2>
          <h3 style={{marginBottom: '10px'}}>This is Index Page</h3>
          <p>Click Next button to next page!</p>
          <button onClick={this.goNext}>Next</button>
          <p>Click Hover button to Hover page!</p>
          <button onClick={this.goHover}>Hover</button>
        </div>
      </div>
      );
  }
}

export default Index;