import React, { Component } from 'react';
import { Form, Row, Col, Button, Input, notification, message, Spin } from 'antd';

import DashboardPage from '../../components/dashboardPage';

import { updateUnit, fetchUnit } from '../../actions/units'

const FormItem = Form.Item;

class ResourceForm extends Component {
  state = {
    confirmDirty: false,
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { id = 0 } = params;

    dispatch(fetchUnit(id));
  }

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  handleSubmit = e => {
    const { form, dispatch, history, route, app: { unit: { data: { id: unitId } } } } = this.props;

    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const data = {
          ...values,
          id: unitId
        };

        dispatch(updateUnit({ unitId, data }, (result) => {
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
                  <p>No se pudo guardar.</p>
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

          message.success('Guardado correctament!');

          history.push(route('unitDetail', { id: unitId }));
        }));
      }
    });
  }

  render() {
    const { app: { unit: { saving, fetching, data } }, form: { getFieldDecorator } } = this.props;

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
          <h2>No existente.</h2>
        </div>
      );
    }

    return (
      <div>
        <Row>
          <Col span={24} className="gutter-row">
            <div>
              <h2>Editar</h2>
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
                  initialValue: data.name || '',
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
                  initialValue: data.description || '',
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
    title: 'Editar',
    hideBreadcrum: true,
    headerActions: [
      {
        text: 'Cancelar',
        icon: 'close',
        onClick: ({ history, route }) => {
          history.push(route('unitList'));
        }
      }
    ]
  };
};

export default DashboardPage(mapState, null)(FinalForm);