import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import DashboardPage from '../../components/dashboardPage';

class Categories extends Component {
  static getPageConfig() {
    return {
      title: 'Configuracion',
      headerActions: [],
      containerStyle: {
        backgroundColor: 'transparent',
        boxShadow: 'none'
      }
    };
  }

  render() {
    const {
      route,
      app: {
        units: {
          data
        },
        categories: {
          data: categoriesList
        }
      }
    } = this.props;

    return (
      <div>
        <Heading>Configurar Sistema</Heading>
        <Row>

          <Col lg={8} md={8} xs={12} className="gutter-row">
            <Link to={ route('unitList') } style={{ color: '#fff' }}>
              <MetricCard className="ant-card" style={{ backgroundColor: '#d897eb' }}>
                <div className="ant-card-body">
                  <StyledIcon type="pay-circle" />

                  <div className="card-text">
                    <div className="metric-title ellipsis">Unidades de medida</div>
                    <div className="metric-number">
                      <span>{ data.length }</span>
                    </div>
                  </div>
                </div>
              </MetricCard>
            </Link>
          </Col>
          
          <Col lg={6} md={8} xs={12} className="gutter-row">
            <Link to={ route('categoriesList') } style={{ color: '#fff' }}>
              <MetricCard className="ant-card" style={{ backgroundColor: '#f69899' }}>
                <div className="ant-card-body">
                  <StyledIcon type="tags" />

                  <div className="card-text">
                    <div className="metric-title ellipsis">Categorias</div>
                    <div className="metric-number">
                      <span>{ categoriesList.length }</span>
                    </div>
                  </div>
                </div>
              </MetricCard>
            </Link>
          </Col>
        </Row>
      </div>
    );
  }
};

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

const Heading = styled.h2`
  margin-bottom: 20px;
`;

const mapState = ({ app }) => ({
  app,
});

export default DashboardPage(mapState, null)(Categories);