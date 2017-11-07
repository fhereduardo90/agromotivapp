import React, { Component } from 'react';
import { Row, Col, Button, Spin, Popconfirm, message, notification } from 'antd';
import styled from 'styled-components';

import DashboardPage from '../../components/dashboardPage';

import { fetchCategory, deleteCategory } from '../../actions/products';

const ButtonGroup = Button.Group;

class ResourceDetails extends Component {
  
  componentWillMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    dispatch(fetchCategory(id));
  }

  static getPageConfig() {
    return {
      title: 'Detalles de categoria'
    };
  }

  editResource= () => {
    const { route, match, history: { push } } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    push(route('categoryEdit', { id }));
  }

  deleteResource= () => {
    const { route, match, dispatch, history: { push } } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    dispatch(deleteCategory(id, (error) => {
      if ( error ) {
        notification.error({
          message: 'Error',
          description: 'No se pudo eliminar la categoria. Porfavor intente nuevamente.'
        });

        return false;
      }

      message.info('La categoria fue eliminado');

      push(route('categoriesList'));
    }));
  }

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  render() {
    const { app: { category: { data, fetching } } } = this.props;


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
          <h2>Categoria no existente.</h2>
        </div>
      );
    }

    return (
      <div>
        <Row>
          <Col span={24} className="gutter-row">
            <div>
              <ResourceName>{ data.name }</ResourceName>
            </div>
            <div className="divider" />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col lg={12} md={12} xs={24} className="gutter-row">
            <Detail className="gutter-box">
              <div className="product-detail">
                { data.image && <div className="cover" style={{ backgroundImage: `url(${ data.image.replace('/original/', '/thumbnail/') })` }} /> }
                <div className="meta">
                  <p>{ data.description }</p>
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

  .cover {
    padding-bottom: 30%;
    margin-bottom: 15px;
    background: #ccc no-repeat center center;
    background-size: cover;
    border-radius: 4px;
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