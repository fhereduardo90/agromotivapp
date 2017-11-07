import React, { Component } from 'react';
import { Row, Col, Button, Spin, Popconfirm, message, notification } from 'antd';
import styled from 'styled-components';

import DashboardPage from '../../components/dashboardPage';

import { fetchState, deleteState } from '../../actions/states';

const ButtonGroup = Button.Group;

class ResourceDetails extends Component {
  
  componentWillMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    dispatch(fetchState(id));
  }

  static getPageConfig() {
    return {
      title: 'Detalles de departamento'
    };
  }

  editResource= () => {
    const { route, match, history: { push } } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    push(route('stateEdit', { id }));
  }

  deleteResource= () => {
    const { route, match, dispatch, history: { push } } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    dispatch(deleteState(id, (error) => {
      if ( error ) {
        notification.error({
          message: 'Error',
          description: 'No se pudo eliminar. Porfavor intente nuevamente.'
        });

        return false;
      }

      message.info('Eliminado');

      push(route('statesList'));
    }));
  }

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  render() {
    const { app: { unit: { data, fetching } } } = this.props;


    const popProps = {
      title: 'Esta seguro de realizar esta accion?',
      okText: 'Si',
      cancelText: 'Cancelar',
    };

    if ( fetching ) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <Spin />
        </div>
      );
    }

    if ( !fetching && !data.id ) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2>Departamento no existente.</h2>
        </div>
      );
    }

    return (
      <div>
        <Row>
          <Col span={24} className="gutter-row">
            <div>
              <ResourceName>Detalles</ResourceName>
            </div>
            <div className="divider" />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col lg={12} md={12} xs={24} className="gutter-row">
            <Detail className="gutter-box">
              <div className="product-detail">
                <div className="meta">
                  <h3>Nombre: { data.name }</h3>
                  <h5>Municipios:</h5>
                </div>
              </div>
            </Detail>


            <div className="invisible-divider" />

            <ButtonGroup>
              <Button type="primary" icon="edit" size="large" onClick={ this.editResource }>Editar</Button>
              <Popconfirm
                { ...popProps }
                onConfirm={ this.deleteResource}>
                <Button type="danger" icon="delete" size="large">Eliminar</Button>
              </Popconfirm>
            </ButtonGroup>
          </Col>

          <div className="clearfix" />
        </Row>

      </div>
    );
  }
};

const ResourceName = styled.h2`
  text-transform: capitalize;

  span {
    color: #f5f5f5;

    small {
      color: #ccc;
    }
  }
`;

const Detail = styled.div`
  .meta {
    font-size: 1.2em;
    margin-bottom: 20px;
  }

  .address {
    margin-top: 20px;
    font-size: 1.2em;
  }

  .bold {
    font-weight: bold;
    font-size: 0.9em;
  }
`;

const mapState = ({ app }) => ({
  app,
});

export default DashboardPage(mapState, null)(ResourceDetails);