import React, { Component } from 'react';
import { Row, Pagination } from 'antd';
import styled from 'styled-components';

import DashboardPage from '../../components/dashboardPage';
import ProductCard from '../../components/product';
import If from '../../components/if';

import { fetchProducts } from '../../actions/products';

class Products extends Component {
  state = {
    pagination: {}
  };

  static getPageConfig() {
    return {
      title: 'Productos',
      headerActions: [
        {
          text: 'Agregar producto',
          icon: 'shopping-cart',
          onClick: ({ route, history }) => {
            history.push(route('productCreate'));
          }
        }
      ],
      containerStyle: {
        backgroundColor: 'transparent',
        padding: 0,
        boxShadow: 'none'
      }
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(fetchProducts());
  }

  onChange = page => {
    const { dispatch } = this.props;

    dispatch(fetchProducts({ page }));
  }

  render() {
    const { route, products: { list, loading, current, total, pageSize } } = this.props;

    return (
      <div>
        <Row className="content gutter-box">
          <If condition={ loading }>
             <ProductCard loading />
          </If>
          <If condition={ !loading }>
            <div>
              {
                list.map( product => {
                  return (
                    <ProductCard
                      key={ product.id }
                      loading={ loading }
                      product={ product }
                      route={ route } />
                  );
                } )
              }

              <PaginationWrapper>
                <Pagination current={ current } onChange={ this.onChange } total={ total } pageSize={ pageSize } />
              </PaginationWrapper>
            </div>
          </If>
        </Row>
      </div>
    );
  }
};

const PaginationWrapper = styled.div`
  padding-top: 50px;
  clear: both;
  text-align: center;
`;

const mapState = ({ app, products }) => ({
  app,
  products,
});

export default DashboardPage(mapState, null)(Products);