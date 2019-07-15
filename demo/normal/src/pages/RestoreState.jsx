import PageGo from 'pagego';
import React from 'react'

class RestoreState extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'PageGo',
      address: 'HangZhou',
    }
  }

  static defaultProps = {
    PageTitle: 'restorestate',
    // in order to restore state, please set RestoreState to true
    RestoreState: true
  }
  
  changeName = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  changeAddress = (e) => {
    this.setState({
      address: e.target.value
    })
  }

  goNext = () => {
    PageGo.next('swipe')
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
          <h2>This page can restore the component state</h2>
          <p>name:</p>
          <input type="text" value={this.state.name} onChange={this.changeName} />
          <p>address:</p>
          <input type="text" value={this.state.address} onChange={this.changeAddress} />
          <p>If you browse two pages forward, this page component will be destroyed, but when you return to this page, the page state will be restored.</p>
          <p className='warn'>State recovery can only be applied to page component and is not valid on its subcomponents.</p>
          <button onClick={this.goNext}>Next</button>
        </div>
      </div>
      );
  }
}

export default RestoreState;