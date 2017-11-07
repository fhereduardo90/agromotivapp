import React from 'react';
import { Col, Card } from 'antd';

import If from '../if';
import ProductCard from './partials/product-card';

const Product = ({ loading = false, scroller = false, product = {}, route = () => {} }) => {
  const size = scroller ? {
    style: {
      width: 255
    },
    span: 24
  } : {
    lg: 6,
    md: 8,
    xs:12
  };

  // const ColComp = !scroller ? Col : ({ children, ...props }) => <div { ...props }>{ children }</div>;

  return (
    <Col {...size} className="gutter-row">
      <If condition={ loading }>
        <Card loading title="Cargando..." />
      </If>
      
      <If condition={ !loading }>
        <ProductCard product={ product } route={ route } />
      </If>
    </Col> 
  );
};

export default Product;