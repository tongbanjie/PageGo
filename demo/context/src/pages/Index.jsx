import PageGo from 'pagego';
import React from 'react'

class Index extends React.Component {

  static defaultProps = {
    PageName: 'index',
    PageTitle: 'index'
  }
  
  goDetail = () => {
    PageGo.next('detail')
  }

  increment = () => {
    this.props.setContext({
      number: this.props.number + 1
    })
  }

  decrement = () => {
    this.props.setContext({
      number: this.props.number - 1
    })
  }

  render() {
    return (
      <div>
        <div className='innerContainer' style={{ top: '0px' }}>
          <h2>number: {this.props.number}</h2>
          <button className='small' onClick={this.increment}> +1 </button>
          <button className='small' onClick={this.decrement}> -1 </button>
          <button onClick={this.goDetail}>show number in next page</button>
        </div>
      </div>
      );
  }
}

export default Index;