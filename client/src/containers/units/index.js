import React, { Component } from 'react';
import { Table, Row, Col, Spin } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import DashboardPage from '../../components/dashboardPage';

const { Column } = Table;

class ReourceList extends Component {

  static getPageConfig() {
    return {
      title: 'Unidades',
      headerActions: [
        {
          text: 'Crear Nuevo',
          icon: 'tags',
          onClick: ({ history, route }) => {
            history.push(route('unitCreate'));
          }
        }
      ]
    };
  }

  render() {
    const { app: { units: resource } } = this.props;

    if ( !resource.fetched ) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <Spin />
        </div>
      );
    }

    return (
      <SinglePageResource>
        <Row className="content">
          <Col span={24} className="gutter-row">
            <div className="gutter-box">

              { resource.fetched && resource.data.length === 0 ? <h2>No hay unidades</h2> : null }

              { resource.data.length ? (
                <Table
                  rowKey={record => record.id}
                  dataSource={resource.data}
                  loading={!resource.fetched}>

                  <Column
                    title="Nombre"
                    dataIndex="name"
                    key="name"
                  />
                  <Column
                    title="Descripcion"
                    dataIndex="description"
                    key="description"
                  />
                  <Column
                    title="Acciones"
                    key="action"
                    render={(text, record) => (
                      <span>
                        <Link to={ this.props.route('unitDetail', { id: record.id }) }>Ver detalles</Link>
                        &nbsp; | <Link to={ this.props.route('unitEdit', { id: record.id }) }>Editar</Link>
                      </span>
                    )}
                  />
                </Table>
              )  : null }
            </div>
          </Col>
        </Row>
      </SinglePageResource>
    );
  }
};

const SinglePageResource = styled.div`
  .ant-pagination {
    display: none;
  }
`;

const mapState = ({ app }) => ({
  app,
});

export default DashboardPage(mapState, null)(ReourceList);