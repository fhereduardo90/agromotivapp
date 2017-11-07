import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Unit from './unit';

const ProductCard = ({ product, route }) => {
  const { id, name, units = [], images = [] } = product;
  const image = images[0];

  return (
    <StyledCard>
      <Link to={ route('productDetail', { id }) } />
      <div className="product-image" style={ image ? { backgroundImage: `url(${ image.url.replace('/original/', '/thumbnail/') })` } : {} } />
      <div className="card-head">
        <h3 className="card-head-title ellipsis">{ name }</h3>
      </div>
      <div className="card-body">
          <Unit unit={ units.length ? units[0] : { quantity: 0, price: '$0.0', unit: {} } } />
      </div>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  position: relative;
  margin: 5px;

  a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    &:hover,
    &:focus {
      border: 2px solid #108ee9;
    }
  }

  &.ant-card {
    border-width: 2px;

    &,
    &:hover {
      box-shadow: none;
      border-color: #ccc;
    }
  }

  .ant-card-body {
    padding: 0;
  }

  .product-image {
    padding-bottom: 50%;
    background: #ccc center center no-repeat;
    background-size: cover;
  }

  .card-head {
    padding: 10px;

    &-title {
      padding-bottom: 5px;
      border-bottom: 1px solid #e4e4e4;
      color: #6b6b6b;
    }
  }

  .card-body {
    padding: 0px 10px 10px;

    .price {
      text-align: center;
      font-size: 25px;
      color: #61a753;
      text-transform: lowercase;

      span,
      small {
        color: #ccc;
      }
    }
  }
`;

export default ProductCard;