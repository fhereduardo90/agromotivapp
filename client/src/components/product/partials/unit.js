import React from 'react';

const Unit = ({ unit: data }) => {

  if ( !data.unit ) {
    return null;
  }

  return (
    <div className="price ellipsis">
      { data.price } <span>&times;</span> { data.unit.description }
    </div>
  );
};

export default Unit;