import React, { Component } from 'react';
import { Form, Row, Col, Button, Input, notification, message, Upload, Icon, Modal } from 'antd';
import ReactCrop from 'react-image-crop';

import DashboardPage from '../../components/dashboardPage';

import getBase64, { dataURLtoFile } from '../../utils/get-base-64';

import { createCategory } from '../../actions/products'

const FormItem = Form.Item;

class ResourceForm extends Component {
  state = {
    confirmDirty: false,
    previewVisible: false,
    previewImage: '',
    fileList: [],
    visible: false,
    image: null,
    imageUri: null,
    crop: {
      aspect: 1
    }
  };

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  handleSubmit = e => {
    const { form, dispatch, history, route } = this.props;
    const { fileList } = this.state;

    e.preventDefault();

    if ( fileList.length) {
      form.setFieldsValue({ file: fileList[0].name });
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const data = {
          ...values,
          image: fileList[0].file
        };

        const transformedData = new FormData();
        Object.keys(data).forEach( key => {
          transformedData.append(key, data[key]);
        } );

        dispatch(createCategory(transformedData, (result, response) => {

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

          message.success('Creado correctament!');

          history.push(route('categoryDetail', { id: response.id }));
        }));
      }
    });
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url,
      previewVisible: true,
    });
  }

  onRemove = (file) => {
    this.setState({
      fileList: [],
    });
  }

  beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('La imagen debe ser formato JPG');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
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
    const { imageUri, crop } = this.state;

    this.cropImage(imageUri, crop, (image, { width }) => {

      if ( width < 600 ) {
        message.error('La imagen seleccionada o el area recortada es muy pequena, debe ser de almenos 600px por 600px');

        return false;
      }
    
      const file = dataURLtoFile(image);

      const data = new FormData();
      data.append('image', file);

      getBase64(file, imageUrl => {
        this.setState(({ fileList }) => ({
          fileList: [{
            uid: -1,
            name: file.name,
            url: imageUrl,
            original_url: imageUrl,
            file
          }],
          fileChanged: true
        }));
      });

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
    const { app: { category: { saving } }, form: { getFieldDecorator } } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Seleccionar</div>
      </div>
    );

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
              <h2>Crear</h2>
            </div>
            <div className="divider" />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col lg={16} md={12} xs={24} className="gutter-row">
            <Form onSubmit={ this.handleSubmit }>
              <FormItem
                {...formItemLayout}
                label="Nombre"
                hasFeedback
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Escribe el nombre', whitespace: true }],
                })(
                  <Input placeholder="Nombre" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="Descripcion"
                hasFeedback
              >
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: 'Escribe una breve descripcion', whitespace: true }],
                })(
                  <Input placeholder="Descripcion" />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Imagen"
                hasFeedback
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onRemove={this.onRemove}
                  beforeUpload={this.beforeUpload}
                >
                  {fileList.length ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>

                <div className="clearfix" />

                {getFieldDecorator('file', {
                  rules: [{ required: fileList.length === 0, message: 'Elije una imagen', whitespace: true }],
                })(
                  <Input type="hidden" />
                )}
              </FormItem>

              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" loading={ saving } disabled={ saving }>Guardar</Button>
              </FormItem>
            </Form>
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
              <Button type="primary" onClick={ this.handleModalOk } disabled={ !this.state.crop.width }>Recortar</Button>
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

const mapState = ({ app }) => ({
  app,
});

const FinalForm = Form.create()(ResourceForm);

FinalForm.getPageConfig = function getPageConfig() {
  return {
    title: 'Crear',
    hideBreadcrum: true,
    headerActions: [
      {
        text: 'Cancelar',
        icon: 'close',
        onClick: ({ history, route }) => {
          history.push(route('categoriesList'));
        }
      }
    ]
  };
};

export default DashboardPage(mapState, null)(FinalForm);