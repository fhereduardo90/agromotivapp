import React, { Component } from 'react';
import { Form, Row, Col, Button, Input, notification, message } from 'antd';

import DashboardPage from '../../components/dashboardPage';

import { createUnit } from '../../actions/units'

const FormItem = Form.Item;

class ResourceForm extends Component {
  state = {
    confirmDirty: false,
  };

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  handleSubmit = e => {
    const { form, dispatch, history, route } = this.props;

    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        dispatch(createUnit(values, (result, response) => {
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
          }

          message.success('Creado correctament!');

          history.push(route('unitDetail', { id: response.id }));
        }));
      }
    });
  }

  render() {
    const { app: { unit: { saving } }, form: { getFieldDecorator } } = this.props;

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
                label="Abreviacion"
                hasFeedback
              >
                {getFieldDecorator('description', {
                  rules: [{ max: 4, message: 'Maximo de 4 letras' }]
                })(
                  <Input placeholder="Abreviacion" />
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