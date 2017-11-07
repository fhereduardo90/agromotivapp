import React, { Component } from 'react';
import { Row, Col, notification, message, Spin, Upload, Icon, Modal, Button } from 'antd';
import styled from 'styled-components';
import ReactCrop from 'react-image-crop';

import { mutateState, normallizeUnits } from '../../utils';
import getBase64, { dataURLtoFile } from '../../utils/get-base-64';

import DashboardPage from '../../components/dashboardPage';
import CreateProductForm from '../../components/product/create-product-form';
import PricesForm from '../../components/product/prices-form';

import { updateProduct, fetchProduct, uploadImage, deleteImage } from '../../actions/products'

class ProductForm extends Component {
  state = {
    confirmDirty: false,
    prices: [],
    previewVisible: false,
    previewImage: '',
    hydrated: false,
    fileList: [],
    visible: false,
    image: null,
    imageUri: null,
    crop: {
      aspect: 1
    }
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    dispatch(fetchProduct(id, (err, response) => {
      if ( err ) {
        return false;
      }

      this.setState(mutateState({ prices: normallizeUnits(response.units) }));
    }));
  }

  componentWillReceiveProps(props) {
    const { hydrated } = this.state;

    if ( props.products.product.data.id && !hydrated ) {
      const product = props.products.product.data;
      const { images } = product;
      const fileList = images.map( image => {
        return {
          uid: image.id,
          name: product.name,
          status: 'done',
          url: image.url.replace('/original/', '/thumbnail/'),
          original_url: image.url
        };
      } );

      this.setState({ fileList: fileList, hydrated: true });
    }
  }

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  handleSubmit = form => e => {
    const { dispatch, history, route, products: { product: { data: { id: productId } } } } = this.props;
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

        const data = {
          ...values,
          units,
          id: productId
        };

        dispatch(updateProduct({ data }, (result) => {
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

            notification.error({ message: 'Error al guardar', description: (
                <div>
                  <p>No se pudo editar.</p>
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
          
          message.success('Producto editado correctament!');

          history.push(route('productDetail', { id: productId }));
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

  handleCancel = () => this.setState({ 
    previewVisible: false, 
  })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.original_url,
      previewVisible: true,
    });
  }

  onRemove = file => {
    const { dispatch } = this.props;
    const { fileList: oldList } = this.state;
    const fileList = oldList.filter( item => {
      return item.uid !== file.uid;
    } );

    dispatch(deleteImage(file.uid, (err) => {
      if ( err ) {
        message.error('No se pudo eliminar la imagen, intente nuevamente!');
        return false;
      }

      this.setState({
        fileList
      });
    }));
  }

  beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg';
    const isLt2M = file.size / 1024 / 1024 < 5;

    if (!isJPG) {
      message.error('La imagen debe ser formato JPG');
    }

    if (!isLt2M) {
      message.error('La imagen debe pesar menos de 5MB!');
    }

    if ( isJPG && isLt2M ) {
      this.showCropModal(file);
    }

    return false;
  }

  showCropModal = image => {
    getBase64(image, imageUri => {
      this.setState({
        visible: true,
        image,
        imageUri,
      });
    });
  }

  handleModalOk = e => {
    const { dispatch } = this.props;
    const { imageUri, crop } = this.state;

    this.cropImage(imageUri, crop, (image, { width }) => {

      if ( width < 600 ) {
        message.error('La imagen seleccionada o el area recortada es muy pequena, debe ser de almenos 600px por 600px');

        return false;
      }
    
      const file = dataURLtoFile(image);

      const data = new FormData();
      data.append('image', file);
  
      dispatch(uploadImage(data, (err, { images, name }) => {
        if ( err ) {
          message.error('No se pudo subir la imagen seleccionada, intente nuevamente!');
          return false;
        }
  
        const fileList = images.map( image => {
          return {
            uid: image.id,
            name: name,
            status: 'done',
            url: image.url.replace('/original/', '/thumbnail/'),
            original_url: image.url
          };
        } );
  
        this.setState({
          fileList: fileList,
          crop: {
           aspect: 1
          } 
        });
      }));

      this.setState({
        visible: false,
        image: null,
        imageUri: null,
        crop: {
          aspect: 1
        }
      });
    });
  }

  handleModalCancel = e => {
    this.setState({
      visible: false,
      image: null,
      imageUri: null,
      crop: {
        aspect: 1
      }
    });
  }

  loadImage = (src, callback) => {
    var image = new Image();
    image.onload = function(e) {
      callback(image);
      image = null;
    };
  
    image.src = src;
  }
  
  cropImage = (imgSrc, crop, next) => {
    this.loadImage(imgSrc, cropAfterLoad.bind(this));
    
    function cropAfterLoad (loadedImg) {
      var imageWidth = loadedImg.naturalWidth;
      var imageHeight = loadedImg.naturalHeight;
  
      var cropX = (crop.x / 100) * imageWidth;
      var cropY = (crop.y / 100) * imageHeight;
  
      var cropWidth = (crop.width / 100) * imageWidth;
      var cropHeight = (crop.height / 100) * imageHeight;
  
      var canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      var ctx = canvas.getContext('2d');
  
      ctx.drawImage(loadedImg, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  
      const cropped = canvas.toDataURL('image/jpeg');
      
      if ( next && typeof next === 'function' ) {
        next( cropped, { width: cropWidth, height: cropHeight } );
      }
    }
  }

  syncCropSize = crop => {
    this.setState({ crop });
  }

  render() {
    const { products: { saving, product: { fetching, data, uploading } }, units, categories } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;

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

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Agregar</div>
      </div>
    );

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

    return (
      <div>
        <Row>
          <Col span={24} className="gutter-row">
            <div>
              <h2>Editar producto</h2>
            </div>
            <div className="divider" />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={24}>
            <FileUpload>
              <Spin spinning={ uploading }>
                <h5>Imagenes</h5>
                <Upload
                  listType="picture-card"
                  fileList={ fileList }
                  onPreview={ this.handlePreview }
                  onRemove={ this.onRemove }
                  beforeUpload={ this.beforeUpload }
                >
                  { fileList.length >= 5 ? null : uploadButton }
                </Upload>
                <Modal visible={ previewVisible } footer={null} onCancel={ this.handleCancel }>
                  <img alt="example" style={{ width: '100%' }} src={ previewImage } />
                </Modal>
              </Spin>
            </FileUpload>
          </Col>

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
              values={ data }
              loading={ saving }
            />
          </Col>

          <div className="clearfix" />
        </Row>

        <div className="clearfix" />
        <Modal
          closable={ false }
          maskClosable={ false }
          title="Recortar Imagen"
          visible={ this.state.visible }
          footer={ (
            <div>
              <Button onClick={ this.handleModalCancel }>Cancelar</Button>
              <Button type="primary" onClick={ this.handleModalOk } disabled={ !this.state.crop.width }>Recortar y Subir</Button>
            </div>
          ) }
        >
          { this.state.imageUri && (
            <ReactCrop
              src={ this.state.imageUri }
              crop={ this.state.crop }
              onComplete={ crop => this.syncCropSize(crop) }
            />
          ) }
        </Modal>
      </div>
    );
  }
};

const FileUpload = styled.div`
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 15px;

  h5 {
    margin-bottom: 10px;
  }
`;

const mapState = ({ products, app: { units, categories } }) => ({
  products,
  units,
  categories,
});

ProductForm.getPageConfig = function getPageConfig() {
  return {
    title: 'Editar producto',
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