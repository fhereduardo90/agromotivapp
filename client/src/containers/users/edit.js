import React, { Component } from 'react';
import { Form, Row, Col, Button, Cascader, Input, notification, message } from 'antd';

import { transformStatesToOptions } from '../../utils';

import DashboardPage from '../../components/dashboardPage';
import Conditional from '../../components/if';

import { updateUser, fetchUser } from '../../actions/users'

const FormItem = Form.Item;
const Textarea = Input.TextArea;

class UserForm extends Component {
  state = {
    confirmDirty: false,
  };

  componentWillMount() {
    const { match, dispatch, user, location: { state } } = this.props;
    const { params } = match;
    const { type = 'users', id = 0 } = params;

    if ( !user.data || ( user && user.id !== id && !!state && !!state.fromDetails ) ) {
      dispatch(fetchUser(type, id));
    }
  }

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  handleSubmit = (e) => {
    const { dispatch, history, route, form, match, location, user, session: { user: { id: loggedUserId } } } = this.props;
    const { params } = match;
    const { type = 'users', id = 0 } = params;

    const isProfileOwner = user.data && user.data.id === loggedUserId;

    e.preventDefault();

    const password = form.getFieldValue('password');
    if ( !password ) {
      form.resetFields(['confirm']);
    }
    
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values, role: type, isProfileOwner };

        dispatch(updateUser(id, formData, (result) => {
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

            notification.error({ message: 'Error', description: (
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

            return false;
          }

          message.success('Usuario actualizado correctament!');

          if ( location.state && !!location.state.next ) {
            history.push(location.state.next);
          } else {
            history.push(route('userDetail', { id, type }));
          }
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
    if (form.getFieldValue('password') && value && value !== form.getFieldValue('password')) {
      callback('La confirmacion no es valida!');
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
    const { saving, form, app, user, match, session: { user: { id: loggedUserId, role: loggedUserRole } } } = this.props;
    const { getFieldDecorator } = form;
    const { states, cities } = app;
    const { params } = match;
    const { type = 'users' } = params;

    const residences = transformStatesToOptions(states.data, cities);
    
    const ifState = user.data && user.data.state ? [
      user.data.state.id,
      ''
    ] : [ '', '' ];

    const initialUserResidence = user.data && user.data.city ? [
      user.data.city.state.id,
      user.data.city.id
    ] : ifState;

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

    const isProfileOwner = user.data && user.data.id === loggedUserId && user.data.role === loggedUserRole;

    return (
      <div>
        <Row>
          <Col span={24} className="gutter-row">
            <div>
              { isProfileOwner ?
                  <h2>Editar Mis Datos</h2> 
                  : <h2>Editar usuario{ user.data && <span>: { user.data.name }</span> }</h2> }
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
                  initialValue: user.data ? user.data.name : '',
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
                  initialValue: user.data ? user.data.email : '',
                  rules: [{
                    type: 'email', message: 'Escribe un E-mail valido!',
                  }, {
                    required: true, message: 'Esribe tu E-mail!',
                  }],
                })(
                  <Input placeholder="correo@dominio.com" />
                )}
              </FormItem>

              <Conditional condition={ isProfileOwner }>
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="&nbsp;"
                    colon={ false }
                  >
                    <div className="divider" />
                    <h3>Cambiar Clave</h3>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Clave"
                    hasFeedback
                  >
                    {getFieldDecorator('password', {
                      rules: [{
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
                        required: form.getFieldValue('password'), message: 'Porfavor confirma tu clave!',
                      }, {
                        validator: this.checkPassword,
                      }],
                    })(
                      <Input type="password" onBlur={ this.handleConfirmBlur } />
                    )}
                  </FormItem>
                </div>
              </Conditional>

              <Conditional condition={ type !== 'admins' } >
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="Telefono"
                  >
                    {getFieldDecorator('phone', {
                      initialValue: user.data ? user.data.phone : '',
                      rules: [
                        { required: type !== 'admins', message: 'Telefono requerido' },
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
                      initialValue: initialUserResidence,
                      rules: [
                        { type: 'array', message: 'Selecciona un lugar de residencia del usuario' },
                        { required: type !== 'admins', message: 'Selecciona municipio o departamento' }
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
                      initialValue: user.data ? user.data.address : '',
                      rules: [
                        { required: type !== 'admins', message: 'La direccion es requerida' },
                        { min: 5, message: 'Minimo de caracteres es 5' }
                      ]
                    })(
                      <Textarea autosize placeholder="Calle 1, Avenida 5" />
                    )}
                  </FormItem>
                </div>
              </Conditional>
              
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" loading={ saving } disabled={ saving }>Guardar cambios</Button>
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

const mapState = ({ users, user }) => ({
  saving: users.saving,
  user
});

const UserUpdateForm = Form.create()(UserForm);

UserUpdateForm.getPageConfig = function getPageConfig() {
  return {
    title: ({ user }) => {
      if ( user.data ) {
        return `Editar usuario: ${ user.data.name }`;
      }

      return 'Editar usuario';
    },
    hideBreadcrum: true,
    headerActions: [
      {
        text: 'Cancelar',
        icon: 'close',
        onClick: ({ history, route, match }) => {
          const { params } = match;
          const { type, id } = params;

          history.push(route('userDetail', { type, id }));
        }
      }
    ]
  };
};

export default DashboardPage(mapState, null)(UserUpdateForm);