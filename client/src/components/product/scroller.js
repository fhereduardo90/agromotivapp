import React from 'react'
import { Row, Icon } from 'antd'

import ProductCard from './index'
import If from '../if'

const ProductScroller = ({ loading, list, route, boxed, className, onButtonClick = () => {} }) => {
  const productSize = ((list.length || 1) * 255) + 60;

  return (
    <div className={ `product-scroller ${ boxed ? 'boxed' : '' } ${ className }` }>
      <button className="scroller-button" onClick={ onButtonClick }>
        <Icon type="plus" />
      </button>
      <div className="scroller-content">
        <If condition={ loading }>
          <div style={{ width: productSize, padding: 10 }}>
            <ProductCard loading scroller />

            <div className="clearfix"></div>
          </div>
        </If>
        <If condition={ !loading }>
          <Row style={{ width: productSize }}>
            {
              list.map( product => {
                return (
                  <ProductCard
                    scroller
                    key={ product.id }
                    loading={ loading }
                    product={ product }
                    route={ route } />
                );
              } )
            }
          </Row>
        </If>

        <div className="clearfix"></div>
      </div>
    </div>
  );
};

export default ProductScroller;