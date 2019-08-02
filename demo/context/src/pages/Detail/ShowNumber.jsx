
import React, {useContext} from 'react';
import {Context} from 'pagego'

function ShowNumber(props){
  const {state, setContext, dispatch} = useContext(Context);
  return (
    <div style={{margin: '15px', border: '1px dashed #415EAB'}}>
      <p>You can use useContext hook to show number in children components:</p>
      <h2 style={{color: '#415EAB'}}>
        Number in children: {state.number}
      </h2>
    </div>
    );
}

export default ShowNumber