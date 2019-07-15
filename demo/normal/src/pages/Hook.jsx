import PageGo from 'pagego';
import React from 'react';

function Hook (props) {

  const back = function(){
    PageGo.back();
  }

  return (
    <div>
      <div className='innerContainer'>
        <div className="back" onClick={back}>
          {`< back`}
        </div>
        <h2>This page is written by the function component, so you can use React Hook here!</h2>
        <h3 style={{marginTop: '50px'}}>This is the last page, you can view the Context Demo next.</h3>
      </div>
    </div>
    );
}

Hook.hookPage = {
  PageTitle: 'hook'
}

export default Hook;