import PageGo from 'pagego';
import React from 'react'

class Second extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: 'Hello PageGo!'
    }
  }

  static defaultProps = {
    PageTitle: 'second'
  }
  
  change = (e) => {
    this.setState({
      message: e.target.value
    })
  }

  goNext = () => {
    PageGo.next('message', {message: this.state.message})
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
          <h2>You can pass this message to next page</h2>
          <p>message:</p>
          <input type="text" value={this.state.message} onChange={this.change} />
          <button onClick={this.goNext}>Next</button>
        </div>
      </div>
      );
  }
}

export default Second;