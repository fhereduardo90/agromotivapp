import React, { Component } from 'react';
import { Table, Row, Col, Menu } from 'antd';
import { Link } from 'react-router-dom';

import DashboardPage from '../../components/dashboardPage';

import { fetchUsers } from '../../actions/users';

const { Column } = Table;

class Users extends Component {
  state = {
    pagination: {},
    loading: false,
    current: 'user'
  };

  componentWillMount() {
    const { match, history } = this.props;
    const current = match.params.type;
    const currentKey = `${ current }s`;

    if ( !current ) {
      history.replace( this.props.route('usersList') +  '/type/user');
    } else {
      this.setState({ current }, () => {
        this.fetch(currentKey);
      });
    }
  }

  componentWillReceiveProps(props) {
    const { match } = this.props;
    const { match: nextMatch } = props;

    const current = nextMatch.params.type;
    const currentKey = `${ current }s`;

    if ( match.params.type !== nextMatch.params.type ) {
      this.fetch(currentKey);
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { match } = this.props;

    const current = match.params.type;
    const currentKey = `${ current }s`;
    
    this.fetch(currentKey, pagination.current);
  }

  fetch = (currentKey, page = 1) => {
    const { dispatch } = this.props;

    dispatch(fetchUsers(currentKey, { page }));
  }

  handleMenuClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  render() {
    const { users, loading } = this.props;
    const { current } = this.state;
    const key = `${ current }s`;

    return (
      <div>
        <Menu
          onClick={ this.handleMenuClick }
          selectedKeys={[current]}
          mode="horizontal"
        >
          <Menu.Item key="user">
            <Link to={ this.props.route('usersListFilter', { type: 'user' }) }>Usuarios</Link>
          </Menu.Item>

          <Menu.Item key="seller">
            <Link to={ this.props.route('usersListFilter', { type: 'seller' }) }>Agricultores</Link>
          </Menu.Item>

          <Menu.Item key="admin">
            <Link to={ this.props.route('usersListFilter', { type: 'admin' }) }>Administradores</Link>
          </Menu.Item>

        </Menu>

        <Row className="content">
          <Col span={24} className="gutter-row">
            <div className="gutter-box">
              <Table
                rowKey={ record => record.id }
                dataSource={ users[key].list }
                pagination={ users[key] }
                loading={ loading }
                onChange={ this.handleTableChange }>

                <Column
                  title="Nombre"
                  dataIndex="name"
                  key="name"
                />
                <Column
                  title="Correo Electronico"
                  dataIndex="email"
                  key="email"
                />
                <Column
                  title="Municipio"
                  render={({city}) => (city ? city.name: '')}
                  key="city"
                />
                <Column
                  title="Acciones"
                  key="action"
                  render={(text, record) => (
                    <span>
                      <Link to={ this.props.route('userDetail', { id: record.id, type: key }) }>Ver detalles</Link>
                      &nbsp; | <Link to={ this.props.route('userEdit', { id: record.id, type: key }) }>Editar</Link>
                    </span>
                  )}
                />
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
};

Users.getPageConfig = () => {
  return {
    title: 'Usuarios',
    headerActions: [
      {
        text: 'Crear nuevo usuario',
        icon: 'user-add',
        onClick: ({ history, route }) => {
          history.push(route('userCreate'));
        }
      }
    ]
  };
};

const mapState = ({ users }) => ({
  users,
});

export default DashboardPage(mapState, null)(Users);