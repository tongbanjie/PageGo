import PageGo from 'pagego';
import ShowNumber from './ShowNumber';
import React from 'react';

function Detail (props) {
  return (
    <div>
      <div className='innerContainer'>
        <div className="back" onClick={()=>{PageGo.back()}}>
          {`< back`}
        </div>
    
        <h2>Number is: {props.number}</h2>

        <ShowNumber />
      </div>
    </div>
    );
}

Detail.hookPage = {
  PageName: 'detail',
  PageTitle: 'detail'
}

export default Detail;