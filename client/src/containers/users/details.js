import React, { Component } from 'react';
import { Row, Col, Avatar, Tag, Button, Alert, Spin, Popconfirm, message, notification } from 'antd';
import styled from 'styled-components';

import DashboardPage from '../../components/dashboardPage';
import GoogleStaticMap from '../../components/static-map';
import ProductScroller from '../../components/product/scroller';
import Conditional from '../../components/if';

import { fetchUser, deleteUser } from '../../actions/users';
import { fetchProducts } from '../../actions/products';

const ButtonGroup = Button.Group;

class UserDetails extends Component {
  componentWillMount() {
    const { match, dispatch } = this.props;
    const { params } = match;
    const { type = 'users', id = 0 } = params;

    dispatch(fetchUser(type, id, (error, user) => {
      if ( error ) {
        return false;
      }

      if ( type === 'sellers' ) {
        dispatch(fetchProducts({ sellerId: id, per_page: 5, page: 1 }));
      }
    }));
  }

  componentWillReceiveProps(props) {
    const { match, dispatch } = this.props;
    const { params } = match;
    const { type = 'users', id = 0 } = params;

    const { match: nextMatch } = props;
    const { params: nextParams } = nextMatch;
    const { type : nextType = 'users', id : nextId = 0 } = nextParams;

    if ( nextType !== type || nextId !== id ) {
      dispatch(fetchUser(nextType, nextId, (error, user) => {
        if ( error ) {
          return false;
        }

        if ( nextType === 'sellers' ) {
          dispatch(fetchProducts({ sellerId: nextId, per_page: 5, page: 1 }));
        }
      }));
    }
  }

  static getPageConfig() {
    return {
      title: 'Detalles de usuario'
    };
  }

  editUser = () => {
    const { route, match, history: { push } } = this.props;
    const { params } = match;
    const { type = 'users', id = 0 } = params;

    push({
      pathname: route('userEdit', { id, type }),
      state: {
        next: route('userDetail', { id, type }),
        fromDetails: true,
      }
    });
  }

  deleteUser = () => {
    const { route, match, dispatch, history: { push } } = this.props;
    const { params } = match;
    const { type = 'users', id = 0 } = params;

    dispatch(deleteUser(id, { role: type }, (error) => {
      if ( error ) {
        notification.error({
          message: 'Error',
          description: 'No se pudo eliminar el usuario. Porfavor intente nuevamente.'
        });
      }

      message.info('El usuario fue eliminado');

      push(route('usersList', { type }));
    }));
  }

  saveFormRef = (formName) => {
    return (form) => {
      this[formName] = form;
    }
  }

  products = () => {
    const { products: { loading, list }, route, user: { data } } = this.props;
    
    if ( !loading && list.length === 0 ) {
      return null;
    }

    return (
      <div>
        <h3>Productos del usuario</h3>

        <ProductScroller
          boxed
          list={ loading ? [] : list }
          route={ route }
          loading={ loading }
          onButtonClick={ () => this.props.history.push(route('productsList', null, { seller_id: data.id })) }
        />

        <div className="divider" />
      </div>
    );
  }

  render() {
    const { user, session: { user: { id: loggedUserId } } } = this.props;
    const { data: userData } = user;

    const getRole = (role) => {
      switch (role) {
        case 'users':
          return 'Usuario';
        case 'sellers':
          return 'Agricultor';
        default:
          return 'Adminstrador';
      }
    };

    const getRoleColor = (role) => {
      switch (role) {
        case 'users':
          return 'yellow';
        case 'sellers':
          return 'green';
        default:
          return 'red';
      }
    };

    const popProps = {
      title: 'Esta seguro de realizar esta accion?',
      okText: 'Si',
      cancelText: 'Cancelar',
    };

    if ( user.loading ) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <Spin />
        </div>
      );
    }

    if ( !user.loading && !user.data ) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2>Usuario no existente.</h2>
        </div>
      );
    }

    let userAddress = '';
    let addressFallbacks = [];

    if ( userData.address ) {
      userAddress += userData.address;
    }

    if ( userData.city ) {
      userAddress += `${ userAddress? ', ' : '' }${ userData.city.name }, ${ userData.city.state.name }`;
      addressFallbacks.push(`${ userData.city.name }, ${ userData.city.state.name }`);
    } else if ( userData.state ) {
      userAddress += `${ userAddress ? ', ' : '' }${ userData.state.name }, El Salvador`;
      addressFallbacks.push(`${ userData.state.name }, El Salvador`);
    }

    return (
      <div>
        <Row>
          <Col span={24} className="gutter-row">
            <div>
              <h2>{ loggedUserId === userData.id ? 'Mis Datos' : 'Datos de usuario' }</h2>
            </div>
            <div className="divider" />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col lg={8} md={12} xs={24} className="gutter-row">
            <Detail className="gutter-box">
              <div className="user-card">
                <div className="avatar">
                  <Avatar shape="square" size="large" icon="user" />
                </div>
                <div className="meta">
                  <h2>{ userData.name }</h2>
                  <Tag color={ getRoleColor(userData.role) }>{ getRole(userData.role) }</Tag>
                </div>
              </div>

              <div className="divider" />

              <Conditional condition={ userData.id === loggedUserId && userData.role === 'admins' }>
                <div>
                  <Button type="primary" icon="edit" size="large" onClick={ this.editUser }>Editar Perfil</Button>

                  <div className="divider" />
                </div>
              </Conditional>

              <ul>
                { (userData.phone && userData.role !== 'admins' ) && <li><b>Telefono:</b> { userData.phone }</li> }
                { userData.email && <li><b>Correo:</b> <a href="mailto:{ userData.email }">{ userData.email }</a></li> }
              </ul>

              <Conditional condition={ userData.role !== 'admins' }>
                <div>
                  <div className="address">
                      <div className="bold">Direcci&oacute;n:</div>
                      { userData.address ? <span>{ userData.address }<br /></span> : '' }
                      { userData.city ? <span>{ userData.city.name }, { userData.city.state.name }</span> : '' }
                      { userData.state && !userData.city ? <span>{ userData.city.state.name }</span> : '' }
                    </div>

                    <div className="map">
                      <GoogleStaticMap
                        address={ [ userAddress, ...addressFallbacks ] }
                        zoom={13}
                        size={{ width: 1000, height: 400 }}
                        style={{ maxWidth: '100%', heighty: 'auto' }}
                        apiKey="AIzaSyBcCAMUx2XoTD4elmb09j2EliOq11w9nI0"
                      />
                    </div>
                </div>
              </Conditional>
            </Detail>
          </Col>
          <Col lg={16} md={12} xs={24}  className="gutter-row">
            <div className="gutter-box">
              { userData.role === 'sellers' && this.products() }

              <Conditional condition={ userData.role !== 'admins' || ( userData.id !== loggedUserId && userData.role === 'admins' ) }>
                <div className="danger-zone">
                  <Alert
                    message="Advertencia"
                    description={
                      `Como administrador puedes cambiar cualquier valor del perfil del usuario,
                      sin embargo no recomendado, dado que el usuario podria no desear esos cambios,
                      no proceda a menos que este seguro de lo que esta haciendo.`
                    }
                    type="warning"
                    showIcon
                  />

                  <div className="invisible-divider" />

                  <ButtonGroup>
                    <Button type="primary" icon="edit" size="large" onClick={ this.editUser }>Editar</Button>
                    <Popconfirm
                      { ...popProps }
                      onConfirm={ this.deleteUser }>
                      <Button type="danger" icon="delete" size="large">Eliminar</Button>
                    </Popconfirm>
                  </ButtonGroup>
                </div>
              </Conditional>
            </div>
          </Col>

          <div className="clearfix" />
        </Row>

      </div>
    );
  }
};

const Detail = styled.div`
  .address {
    margin-top: 20px;
    font-size: 1.2em;
  }

  .bold {
    font-weight: bold;
    font-size: 0.9em;
  }

  .map {
    position: relative;
    margin-top: 10px;
  }
`;

const mapState = ({ users, user, products }) => ({
  users,
  user,
  products
});

export default DashboardPage(mapState, null)(UserDetails);