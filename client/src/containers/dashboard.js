import React, { Component } from 'react'
import { Row, Col, Icon } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import DashboardPage from '../components/dashboardPage'
import ProductScroller from '../components/product/scroller'

import { fetchProducts } from '../actions/products'
import { fetchUsers } from '../actions/users'

class Dashboard extends Component {
  static getPageConfig() {
    return {
      hideHeader: true,
      hideBreadcrum: true,
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
    dispatch(fetchUsers('sellers'));
  }

  render() {
    const {
      route,
      products: {
        list,
        loading,
        total: totalProducts
      },
      users: {
        sellers: {
          total: totalUsers
        }
      },
      app: {
        categories
      }
    } = this.props;

    return (
      <div>
        <div style={{ padding: 24, paddingBottom: 0 }}>
          <Row>
            <Col lg={6} md={8} xs={12} className="gutter-row">
              <Link to={ route('usersListFilter', { type: 'seller' }) } style={{ color: '#8fc9fb' }}>
                <MetricCard className="ant-card">
                  <div className="ant-card-body">
                    <StyledIcon type="team" />

                    <div className="card-text">
                      <div className="metric-title ellipsis">Agricultores</div>
                      <div className="metric-number">
                        <span>{ totalUsers }</span>
                      </div>
                    </div>
                  </div>
                </MetricCard>
              </Link>
            </Col>
            <Col lg={6} md={8} xs={12} className="gutter-row">
              <Link to={ route('productsList') } style={{ color: '#f69899' }}>
                <MetricCard className="ant-card">
                  <div className="ant-card-body">
                    <StyledIcon type="shopping-cart" />

                    <div className="card-text">
                      <div className="metric-title ellipsis">Productos</div>
                      <div className="metric-number">
                        <span>{ totalProducts }</span>
                      </div>
                    </div>
                  </div>
                </MetricCard>
              </Link>
            </Col>
            <Col lg={6} md={8} xs={12} className="gutter-row">
              <Link to={ route('categoriesList') } style={{ color: '#d897eb' }}>
                <MetricCard className="ant-card">
                  <div className="ant-card-body">
                    <StyledIcon type="tags" />

                    <div className="card-text">
                      <div className="metric-title ellipsis">Categorias</div>
                      <div className="metric-number">
                        <span>{ categories.data.length }</span>
                      </div>
                    </div>
                  </div>
                </MetricCard>
              </Link>
            </Col>
          </Row>

          {
            !loading && list.length > 0 && (
              <h2 style={{ marginTop: 20 }}>Ultimos productos</h2>
            )
          }

        </div>
      
        { !loading && list.length > 0 && (
          <StyledProductScroller
            boxed
            loading={ loading }
            list={ loading ? [] : list }
            route={ route }
            onButtonClick={ () => this.props.history.push(route('productsList')) }
          />
        ) }

      </div>
    );
  }
}

const MetricCard = styled.div`
  &.ant-card {
    border-radius: 0;
    margin-bottom: 24px;
    padding: 25px;
    margin-right: 15px;
    
    .ant-card-body {
      padding: 0px;
    }

    .card-text {
      width: 100%;
      padding-left: 78px;
    }

    .ellipsis {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    
    .metric-title {
      line-height: 16px;
      font-size: 16px;
      margin-bottom: 8px;
      height: 16px;
    }

    .metric-number {
      line-height: 32px;
      font-size: 24px;
      height: 32px;
    }
  }
`;

const StyledIcon = styled(Icon)`
  font-size: 54px;
  float: left;
`;

const StyledProductScroller = styled(ProductScroller)`
  margin-left: -16px;
  margin-right: -16px;
  background-color: #e2e2e2 !important;
`;

const mapState = ({ products, users }) => ({
  products,
  users,
});

export default DashboardPage(mapState, null)(Dashboard);