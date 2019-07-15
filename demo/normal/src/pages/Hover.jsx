import PageGo from 'pagego';
import React from 'react';

class Hover extends React.Component {

  static defaultProps = {
    PageTitle: 'hover',
    PageSwipeBack: true
  }

  goBack = () => {
    PageGo.back()
  }

  render() {
    return (
      <div>
        <div className='innerContainer'>
          <h2>This is a hover page</h2>
          <p>This page is overlaid on the previous page, starting with the Hover page, you can no longer use the next method to navigate forward.</p>
          <p>But you can continue to use hover</p>
          <button onClick={this.goBack}>back</button>
        </div>
      </div>
      );
  }
}

export default Hover;