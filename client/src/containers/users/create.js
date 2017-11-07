import React, { Component } from 'react';
import { Form, Row, Col, Button, Cascader, Select, Input, notification, message } from 'antd';

import { transformStatesToOptions } from '../../utils';

import DashboardPage from '../../components/dashboardPage';
import Conditional from '../../components/if';

import { createUser } from '../../actions/users'

const FormItem = Form.Item;
const Option = Select.Option;
const Textarea = Input.TextArea;

class UserForm extends Component {
  state = {
    confirmDirty: false,
  };

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  handleSubmit = (e) => {
    const { dispatch, history, route, form } = this.props;

    e.preventDefault();
    
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch(createUser(values, (result) => {
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
          
          message.success('Usuario creado correctament!');
            
          history.push(route('usersList'));
        }));
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('La confirmacion de clave no coincide!');
    } else {
      callback();
    }
  }
  
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { saving, form, app } = this.props;
    const { getFieldDecorator } = form;
    const { states, cities } = app;

    const residences = transformStatesToOptions(states.data, cities);

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

    const isNormalUser = form.getFieldValue('role') !== '2';

    return (
      <div>
        <Row>
          <Col span={24} className="gutter-row">
            <div>
              <h2>Crear usuario</h2>
            </div>
            <div className="divider" />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col lg={14} md={12} xs={24} className="gutter-row">
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="Nombre"
                hasFeedback
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Escribe el nombre de usuario!', whitespace: true }],
                })(
                  <Input placeholder="Juan Nieve" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="E-mail"
                hasFeedback
              >
                {getFieldDecorator('email', {
                  rules: [{
                    type: 'email', message: 'Escribe un E-mail valido!',
                  }, {
                    required: true, message: 'Esribe tu E-mail!',
                  }],
                })(
                  <Input placeholder="correo@dominio.com" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="Clave"
                hasFeedback
              >
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: 'Escribe la clave de usuario!',
                  }, {
                    min: 6, message: 'Minimo de caracteres es 6',
                  }, {
                    validator: this.checkConfirm,
                  }],
                })(
                  <Input type="password" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="Confirmar Clave"
                hasFeedback
              >
                {getFieldDecorator('confirm', {
                  rules: [{
                    required: true, message: 'Confirma la clave de usuario!',
                  }, {
                    validator: this.checkPassword,
                  }],
                })(
                  <Input type="password" onBlur={this.handleConfirmBlur} />
                )}
              </FormItem>

              <Conditional condition={ isNormalUser }>
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="Telefono"
                  >
                    {getFieldDecorator('phone', {
                      rules: [
                        { required: isNormalUser, message: 'Telefono requerido' },
                        { min: 7, message: 'Minimo de caracteres es 7' },
                      ]
                    })(
                      <Input style={{ width: '100%' }} placeholder="7000-0000" />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Depto. / Municipio"
                  >
                    {getFieldDecorator('residence', {
                      initialValue: [],
                      rules: [
                        { type: 'array', message: 'Selecciona un lugar de residencia del usuario' },
                        { required: isNormalUser, message: 'Selecciona municipio o departamento' }
                      ],
                    })(
                      <Cascader options={residences} />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Direcci&oacute;n"
                  >
                    {getFieldDecorator('address', {
                      rules: [
                        { required: isNormalUser, message: 'La direccion es requerida' },
                        { min: 5, message: 'Minimo de caracteres es 5' }
                      ]
                    })(
                      <Textarea autosize placeholder="Calle 1, Avenida 5" />
                    )}
                  </FormItem>
                </div>
              </Conditional>

              <FormItem
               {...formItemLayout}
                label="Role"
              >
                {getFieldDecorator('role', {
                  initialValue: "0",
                  rules: [{ required: true, message: 'Selecciona un role' }],
                })(
                  <Select
                    placeholder="Selecciona una opcion"
                  >
                    <Option value="0">Usuario</Option>
                    <Option value="1">Agricultor</Option>
                    <Option value="2">Admin</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" loading={ saving } disabled={ saving }>Crear</Button>
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

const mapState = ({ users }) => ({
  saving: users.saving,
});

const UserCreateForm = Form.create()(UserForm);

UserCreateForm.getPageConfig = function getPageConfig() {
  return {
    title: 'Crear usuario',
    hideBreadcrum: true,
    headerActions: [
      {
        text: 'Cancelar',
        icon: 'close',
        onClick: ({ history, route }) => {
          history.push(route('usersList'));
        }
      }
    ]
  };
};

export default DashboardPage(mapState, null)(UserCreateForm);