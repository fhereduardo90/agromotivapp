import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import styled from 'styled-components'

import { mainMenu } from '../utils'
import route from '../utils/get-route'

import If from '../components/if'
import FullscreenLoader from '../components/fullscreen-loader'

import { fetchStates } from '../actions/states'
import { fetchUnits } from '../actions/units'
import { fetchCategories } from '../actions/products'
import { logout } from '../actions/session'

const { Header, Content, Footer, Sider } = Layout;
const ButtonGroup = Button.Group;

export class PageWrapper extends Component {
  componentWillMount() {
    const { dispatch, app: { states, units, categories } } = this.props;

    if ( !states.fetched ) {
      dispatch(fetchStates());
    }

    if ( !units.fetched ) {
      dispatch(fetchUnits());
    }

    if ( !categories.fetched ) {
      dispatch(fetchCategories());
    }
  }

  openRoute = (nextRoute) => {
    const { session: { user: { id } } } = this.props;

    if ( nextRoute.key === 'logout' ) {
      localStorage.clear();

      this.props.dispatch(logout());
      this.props.history.push('/');
    } else if ( nextRoute.key === 'profile' ) {
      this.props.history.push(route('userDetail', { type: 'admins', id }));
    } else {
      const to = mainMenu[nextRoute.key]['href'];
      this.props.history.push(to);
    }
  }

  getRouteMenuKeys = (path = '', routes = []) => {
    const matchingKeys = routes.map((href, index) => {
      return {
        href,
        index
      };
    }).filter((route) => {
      return route.href === path || path.indexOf(route.href) !== -1;
    });

    return matchingKeys.map((route) => {
      return route.index + [];
    });
  }

  render() {
    const { title = '', children, location, config } = this.props;
    const date = new Date();
    const year = date.getFullYear();

    const menuRoutes = mainMenu.map((item) => item.href);
    const currentMenuKeys = this.getRouteMenuKeys(location.pathname, menuRoutes);

    const configTitle = config && typeof config.title === 'function' ? config.title(this.props) : config.title;
    const pageTitle = config && configTitle ? configTitle : 'Dashboard';
    const isPage = pageTitle !== 'Dashboard';
    const hasActions = config && config.headerActions;

    return (
      <Layout>
        <Helmet>
          <title>{pageTitle} &mdash; AGROMOTIVA</title>
        </Helmet>
        <Sider
          style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
        >
          <StyledSider>
            <Link to="/dashboard">
              <div className="logo">
                <img src="/logo-small.png" alt=""/>
              </div>
            </Link>

            <Menu theme="dark" mode="inline" defaultSelectedKeys={currentMenuKeys} selectable={false} onClick={this.openRoute}>
              {
                mainMenu.map((item, index) => {
                  return (
                    <Menu.Item key={index}>
                      <span>
                        <Icon type={item.icon} />
                        <span className="nav-text">{item.label}</span>
                      </span>
                    </Menu.Item>
                  );
                })
              }

              <Menu.Divider />

              <Menu.Item key="profile">
                <span>
                  <Icon type="user" />
                  <span className="nav-text">Perfil</span>
                </span>
              </Menu.Item>
              
              <Menu.Item key="logout">
                <span>
                  <Icon type="disconnect" />
                  <span className="nav-text">Salir</span>
                </span>
              </Menu.Item>
            </Menu>
          </StyledSider>
        </Sider>
        <Layout style={{ paddingLeft: 200, display: 'block', width: '100%' }}>
          <If condition={ !config.hideHeader }>
            <Header style={headerStyles}>
              {
                hasActions && (
                  <ButtonGroup>
                    { config.headerActions.map((action, index) => {
                      if ( action.isActive && !action.isActive(this.props) ) {
                        return null;
                      }

                      return (
                        <Tooltip
                          title={ action.text }
                          placement="left"
                          key={index} >
                          <Button
                            onClick={ action.onClick.bind(this, { ...this.props, route }) }
                            icon={ action.icon || '' }
                            size="large"
                            type="ghost">{ action.text }</Button>
                        </Tooltip>
                      );
                    }) }
                  </ButtonGroup>
                )
              }

              <h3 style={{ padding: '0 20px' }}>{ pageTitle }</h3>
            </Header>
          </If>

          <If condition={ !config.hideBreadcrum }>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/dashboard">Dashboard</Link>
              </Breadcrumb.Item>
              { isPage && <Breadcrumb.Item>{ pageTitle }</Breadcrumb.Item> }
            </Breadcrumb>
          </If>

          <Content style={{ margin: '0 16px' }}>
            <div style={ { ...containerStyles, ...config.containerStyle || {} } }>
              { children }
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            AGROMOTIVA ©{ year } &middot; Created by <a href="http://twitter.com/adielhercules">Adiel Hercules</a>
          </Footer>
        </Layout>
      </Layout>
    );
  }
};

const StyledSider = styled.div`
  .logo {
    background: #62446b;
    margin: 0;
    padding: 15px;

    img {
      max-width: 100%;
    }
  }

  .ant-layout-sider-collapsed .anticon {
    font-size: 16px;
    margin-left: 8px;
  }

  .ant-layout-sider-collapsed .nav-text {
    display: none;
  }

  .ant-layout-sider-collapsed .ant-menu-submenu-vertical > .ant-menu-submenu-title:after {
    display: none;
  }
`;
const containerStyles = {
  padding: 14,
  background: '#fff',
  minHeight: 360,
  marginTop: 30,
  marginBottom: 30,
  boxShadow: '0px 0px 10px #ccc'
};

const headerStyles = {
  background: '#fff',
  padding: '30px 0px 0px',
  height: 97,
  boxShadow: '0px 0px 5px #ccc',
};


const stateObjectFn = (state, props) => ({ url: props.url });
const actionsObjectFn = (dispatch) => ({ dispatch });

const DashboardPage = (mapToState = stateObjectFn, mapToActions = actionsObjectFn) => (WrappedComponent) => {
  class Page extends Component {
    render() {
      const props = this.props;
      const { session, location } = props;
      const config = WrappedComponent.getPageConfig !== undefined
          ? WrappedComponent.getPageConfig.bind(this)
          : () => ({});

      const { anonymousAccess, outsideDashboard } = config();

      if ( !session.loggedIn && !anonymousAccess ) {
        setTimeout(() => {
          props.history.push(route('login', null, null), { next: encodeURIComponent(location.pathname) });
        }, 500);

        return <FullscreenLoader />;
      }

      if ( outsideDashboard ) {
        return <WrappedComponent {...props} />;
      }

      return (
        <PageWrapper {...props} config={ config() }>
          <WrappedComponent
            {...props}
            ref={ (el) => { this.WrappedComponent = el; } }
            route={ (name, params = false, querystring = null) => route(name, params || props.match.params, querystring) }
          />
        </PageWrapper>
      );
    }
  };

  const mapToStateFn = mapToState || stateObjectFn;

  const extendMapToState = (state, props) => {
    return {
      ...mapToStateFn(state, props),
      session: state.session,
      app: state.app,
    };
  };

  return connect(extendMapToState, mapToActions)(Page);
}

export default DashboardPage;
