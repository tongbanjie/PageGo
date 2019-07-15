import PageGo from 'pagego';
import React from 'react';
import ShowNumber from './ShowNumber';
import Connector from '../../js/connector'

function Detail (props) {
  const ConnectShowNumber = Connector(ShowNumber)
  return (
    <div>
      <div className='innerContainer'>
        <div className="back" onClick={()=>{PageGo.back()}}>
          {`< back`}
        </div>
        <h2>Number is: {props.number}</h2>
        <ConnectShowNumber />
      </div>
    </div>
    );
}

Detail.hookPage = {
  PageName: 'detail',
  PageTitle: '详情'
}

export default Detail;