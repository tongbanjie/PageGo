import React from 'react';

function ShowNumber(props){
  return (
    <div style={{margin: '15px', padding: '4px', border: '1px dashed #415EAB'}}>
      <h3>In order to use action and state within a subcomponents, you need to use Connector to link your subcomponents:</h3>
      <h2>
        Number in children:{props.number}
      </h2>
    </div>
    );
}

export default ShowNumber