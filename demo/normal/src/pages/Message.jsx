import PageGo from 'pagego';
import React from 'react'

class Message extends React.Component {

  static defaultProps = {
    PageTitle: 'message'
  }
  

  goNext = () => {
    PageGo.next('restorestate')
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
          <h2>The message is: </h2>
          <h3 className='red'>{this.props.message}</h3>
          <p style={{marginBottom: '15px'}}>If you refresh your browser, this message will not disappear.</p>
          <button onClick={this.goNext}>Next</button>
        </div>
      </div>
      );
  }
}

export default Message;