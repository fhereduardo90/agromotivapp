import React, { Component } from 'react';
import { Row, Col, Button, Alert, Spin, Popconfirm, Card, Modal, message, notification } from 'antd';
import styled from 'styled-components';

import DashboardPage from '../../components/dashboardPage';

import { fetchProduct, deleteProduct } from '../../actions/products';

const ButtonGroup = Button.Group;

class ProductDetails extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    dispatch(fetchProduct(id));
  }

  static getPageConfig() {
    return {
      title: 'Detalles de producto'
    };
  }

  editProduct = () => {
    const { route, match, history: { push } } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    push(route('productEdit', { id }));
  }

  deleteProduct = () => {
    const { route, match, dispatch, history: { push } } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    dispatch(deleteProduct(id, (error) => {
      if ( error ) {
        notification.error({
          message: 'Error',
          description: 'No se pudo eliminar el producto. Porfavor intente nuevamente.'
        });

        return false;
      }

      message.info('El producto fue eliminado');

      push(route('productsList'));
    }));
  }

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = url => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  }

  render() {
    const { products: { product: { data, fetching } } } = this.props;
    const { previewVisible, previewImage } = this.state;
    const { images = [] } = data;

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
          <h2>Producto no existente.</h2>
        </div>
      );
    }

    const unitName = (price) => {
      if ( price.unit.description ) {
        return (
          <small className="unit-name">{ price.unit.description }</small>
        );
      }

      if ( price.unit.name ) {
        return (
          <small className="unit-name">{ price.unit.name }</small>
        );
      }

      return null;
    };

    const category = () => {
      if ( data.category ) {
        return (
          <span>&mdash; <small>{ data.category.name }</small></span>
        );
      }

      return null;
    };

    return (
      <div>
        <Row>
          <Col span={24} className="gutter-row">
            <div>
              <ProductName>{ data.name } { category() }</ProductName>
              { data.seller && (<p>Agricultor <b>{ data.seller.name }</b></p>) }
            </div>
            <div className="divider" />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col lg={16} md={16} xs={24} className="gutter-row">
            { images.length  > 0 && (
              <ImageList>
                <h5>Imagenes</h5>
                <div className="product-images">
                  <div className="images-scroller" style={{ width: 245 * images.length }}>
                    {
                      images.map( (image, index) => {
                        return (
                          <Card key={ index } style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
                            <a href="#next" onClick={ e => this.handlePreview(image.url) }>
                              <div className="product-image" style={{ backgroundImage: `url(${ image.url.replace('/original/', '/thumbnail/') })` }} />
                            </a>
                          </Card>
                        );
                      } )
                    }
                  </div>
                </div>

                <div className="clearfix" />
              </ImageList>
            ) }

            <Modal visible={ previewVisible } footer={null} onCancel={ this.handleCancel }>
              <img alt="example" style={{ width: '100%' }} src={ previewImage } />
            </Modal>

            <Detail className="gutter-box">
              <div className="product-detail">
                <div className="meta">
                  <p>{ data.description }</p>
                </div>
              </div>

              <PricingHeading>{ data.units.length > 1 ? 'Precios' : 'Precio' }</PricingHeading>
              <Pricing>
                { data.units.length && data.units.map( (unit, index) => (
                  <div className="pricing-level" key={ index }>
                    <Col span={8} className="gutter-row pricing-name">
                      <div>{ unit.name }</div>
                    </Col>
                    <Col span={8} className="gutter-row pricing-price middle-column">
                      <div>
                        <span>{ unit.price }</span>
                        <small>&times;</small>
                        { unitName(unit) }
                      </div>
                    </Col>
                    <Col span={8} className="gutter-row pricing-price">
                      <div>
                        <span>{ unit.quantity }</span>
                        <small>min</small>
                      </div>
                    </Col>
                    <div className="clearfix" />
                  </div>
                ) ) }
              </Pricing>
            </Detail>
          </Col>
          <Col lg={8} md={8} xs={24}  className="gutter-row">
            <div className="gutter-box">

              <div className="danger-zone">
                <Alert
                  message="Advertencia"
                  description={
                    `Como administrador puedes cambiar cualquier valor del producto,
                    sin embargo no recomendado, dado que el agricultor podria no desear esos cambios,
                    no proceda a menos que este seguro de lo que esta haciendo.`
                  }
                  type="warning"
                  showIcon
                />

                <div className="invisible-divider" />

                <ButtonGroup>
                  <Button type="primary" icon="edit" size="large" onClick={ this.editProduct }>Editar</Button>
                  <Popconfirm
                    { ...popProps }
                    onConfirm={ this.deleteProduct }>
                    <Button type="danger" icon="delete" size="large">Eliminar</Button>
                  </Popconfirm>
                </ButtonGroup>
              </div>
            </div>
          </Col>

          <div className="clearfix" />
        </Row>

      </div>
    );
  }
};

const Pricing = styled(Row)`
  .pricing-level {
    font-size: 12px;
    border-bottom: 1px solid #f5f5f5;

    &:first-child {
      font-size: 16px;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .pricing-name,
  .pricing-price {
    div {
      padding: 5px 10px;
      text-align: center;
      font-size: 2em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .pricing-name,
  .middle-column {
    border-right: 1px solid #f5f5f5;
  }

  .pricing-name {
    div {
      text-transform: uppercase;
      color: #ccc;
    }
  }

  .pricing-price {
    span, small {
      display: inline-block;
      vertical-align: middle;
    }

    span {
      color: #61a753;
    }

    small {
      padding-left: 5px;
      padding-right: 5px;
      color: #ccc;

      &.unit-name {
        color: #222;
        text-transform: lowercase;
      }
    }
  }
`;

const PricingHeading = styled.h2`
  margin: 15px 0 10px;
  text-align: center;
  text-transform: uppercase;
`;

const ProductName = styled.h2`
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
    padding: 10px;
    background-color: #f5f5f5;
    color: #9e9e9e;
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

const ImageList = styled.div`
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 15px;
  min-height: 40px;

  h5 {
    margin-bottom: 10px;
  }

  .product-image {
    padding-bottom: 45%;
    background: #ccc no-repeat center center;
    background-size: cover;
  }

  .product-images {
    overflow: auto;
    padding: 5px 0;

    .ant-card {
      float: left;
      margin-right: 5;
    }
  }
`;

const mapState = ({ products }) => ({
  products,
});

export default DashboardPage(mapState, null)(ProductDetails);