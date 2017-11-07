import React, { Component } from 'react';
import { Row, Col, notification, message } from 'antd';

import DashboardPage from '../../components/dashboardPage';
import CreateProductForm from '../../components/product/create-product-form';
import PricesForm from '../../components/product/prices-form';

import { createProduct } from '../../actions/products'
import { searchSellers } from '../../actions/users'

let timeout;
let currentValue;

class ProductForm extends Component {
  state = {
    confirmDirty: false,
    prices: [],
    sellers: [],
  };

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  handleSubmit = form => e => {
    const { dispatch, history, route } = this.props;
    const { prices: units } = this.state;

    e.preventDefault();

    if ( units.length === 0 ) {
      notification.error({
        message: 'Sin precios?',
        description: (
          <span>Es necesario que agregues un precio para poder proceder.</span>
        )
      });

      return false;
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { seller_id: sellerId } = values;
        const formData = values;

        const data = {
          ...formData,
          units,
        };

        dispatch(createProduct({ sellerId, data }, (result) => {
          if ( result ) {
            let errors = [];
            
            if ( !result.error ) {
              return false;
            }

            const errorData = JSON.parse(result.error.response);

            const serverErrors = errorData.errors ? errorData.errors.map( _err => {
              return `${ _err.fieldname } (${ _err.messages.join(', ') })`;
            } ) : [];

            if ( errorData.error ) {
              errors.push(errorData.error);
            }

            errors = [
              ...errors,
              ...serverErrors,
            ];

            notification.error({ message: 'Error de creacion', description: (
                <div>
                  <p>No se pudo crear.</p>
                  { errors.length && <div><p>&nbsp;</p><h4>Errores:</h4></div> }
                  <ul>
                    { errors.map( (err, index) => {
                      return (
                        <li key={ index }>{ err }</li>
                      );
                    } ) }
                  </ul>
                </div>
              ) });

            return false;
          }

          message.success('Producto creado correctament!');

          history.push(route('productsList'));
        }));
      }
    });
  }

  handleSubmitPrice = form => e => {
    const { prices } = this.state;

    e.preventDefault();

    form.validateFieldsAndScroll((err, price) => {
      if (!err) {
        const allPrices = prices.map( item => item.price );
        const allQuantities = prices.map( item => item.quatity );
        const allUnits = prices.map( item => item.unit_id );

        if ( allPrices.indexOf(price.price) !== -1 ) {
          const index = allPrices.indexOf(price.price);

          if ( allQuantities[index] === price.quatity && allUnits[index] === price.unit_id ) {
            notification.error({
              message: 'Precio existente',
              description: (
                <span>Parece que ya existe un precio similar, agrega precios diferentes.</span>
              )
            });

            return false;
          }
        }

        this.setState(state => ({
          prices: [
            ...state.prices,
            price
          ]
        }), () => {
          form.setFieldsValue({
            unit_id: '',
            name: '',
            price: '',
            quantity: '',
          });
        });
      }
    });
  }

  handleRemovePrince = priceItem => e => {
    e.preventDefault();

    this.setState(state => {
      const prices = state.prices.filter( price => {
        if ( price.id && priceItem.id ) {
          return priceItem.id !== price.id;
        }

        return price !== priceItem;
      } );

      return {
        prices
      };
    });
  }

  onSellerChange = query => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = query;

    const search = () => {

      if ( !currentValue ) {
        return false;
      }

      this.props.dispatch(searchSellers(currentValue, (error, sellers) => {
        if ( error ) {
          message.info(`No se encontaron resultados para "${ query }"`);

          return false;
        }
  
        this.setState({ sellers });
      }));
    }

    timeout = setTimeout(search, 500);
  }

  render() {
    const { products, units, categories } = this.props;
    const { sellers } = this.state;
    const { saving } = products;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    const formItemLayoutFullWidth = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    return (
      <div>
        <Row>
          <Col span={24} className="gutter-row">
            <div>
              <h2>Crear producto</h2>
            </div>
            <div className="divider" />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col lg={16} md={12} xs={24} className="gutter-row">
            <PricesForm
              handleSubmit={ this.handleSubmitPrice }
              handleRemove={ this.handleRemovePrince }
              formItemLayout={ formItemLayout }
              formItemLayoutFullWidth={ formItemLayoutFullWidth }
              tailFormItemLayout={ tailFormItemLayout }
              prices={ this.state.prices }
              units={ units }
            />

            <div className="divider" />

            <CreateProductForm
              handleSubmit={ this.handleSubmit }
              formItemLayout={ formItemLayout }
              tailFormItemLayout={ tailFormItemLayout }
              categories={ categories }
              loading={ saving }
              sellers={ sellers }
              onSellerChange={ this.onSellerChange }
            />
          </Col>

          <div className="clearfix" />
        </Row>

        <div className="clearfix" />
      </div>
    );
  }
};

const mapState = ({ products, app: { units, categories } }) => ({
  products,
  units,
  categories,
});

ProductForm.getPageConfig = function getPageConfig() {
  return {
    title: 'Crear producto',
    hideBreadcrum: true,
    headerActions: [
      {
        text: 'Cancelar',
        icon: 'close',
        onClick: ({ history, route }) => {
          history.push(route('productsList'));
        }
      }
    ]
  };
};

export default DashboardPage(mapState, null)(ProductForm);