import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Form, Input } from 'antd'
import styled from 'styled-components'

import DashboardPage from '../components/dashboardPage';
import FullscreenLoader from '../components/fullscreen-loader'

import { login, getUserData } from '../actions/session'

import { config } from '../utils'
import route from '../utils/get-route'

const FormItem = Form.Item

class LoginPage extends Component {

  state = {
    token: localStorage.token
  }

  componentWillMount() {
    const { dispatch, history, session, route, location } = this.props;

    if ( localStorage.token && !session.loggedIn ) {
      dispatch(getUserData(err => {
        if ( err ) {
          localStorage.removeItem('token');
          
          this.setState({ token: null });
          
          return false;
        }

        history.push(location.state && location.state.next ? decodeURIComponent(location.state.next) : route('dashboard'));
      }));
    }
  }

  componentWillReceiveProps(props) {
    const { history, location } = this.props;

    if ( props.session.loggedIn ) {
      this.setState({ token: localStorage.token }, () => {
        setTimeout(() => {
          history.push(location.state && location.state.next ? decodeURIComponent(location.state.next) : route('dashboard'));
        }, 500);
      });
    }
  }

  render() {
    const {
      session,
      history,
      dispatch,
      location,
      form: {
        getFieldDecorator,
        validateFieldsAndScroll,
      },
    } = this.props;
    const { token } = this.state;
    const { loginLoading } = session;

    function handleOk () {
      validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return
        }

        dispatch(login(values, () => {
          dispatch(getUserData( err => {
            if ( err ) {
              window.reload();
              return false;
            }

            history.push(location.state && location.state.next ? decodeURIComponent(location.state.next) : route('dashboard'));
          } ));
        }));
      })
    }

    if ( token ) {
      return (
        <FullscreenLoader label="Validando..." />
      );
    }

    return (
      <Container>
        <div className="logo">
          <span>{config.name}</span>
        </div>
        <form>
          <FormItem hasFeedback>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input size="large" onPressEnter={handleOk} placeholder="Username" />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="Password" />)}
          </FormItem>
          <Row>
            <Button type="primary" size="large" onClick={handleOk} loading={loginLoading} style={{width: '100%'}}>
              Sign in
            </Button>
          </Row>

        </form>
      </Container>
    );
  }
}

LoginPage.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

const Container = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -160px 0 0 -160px;
    width: 320px;
    padding: 36px;
    boxShadow: 0 0 100px rgba(0,0,0,.08);

    p {
        color: rgb(204, 204, 204);
        text-align: center;
        margin-top: 16px;
    }

    p span:first-child {
        margin-right: 16px;
    }

    .logo {
        text-align: center;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        margin-bottom: 24px;
    }

    .logo span {
        vertical-align: text-bottom;
        font-size: 16px;
        text-transform: uppercase;
        display: inline-block;
    }
`;

const LoginForm = Form.create()(LoginPage);

LoginForm.getPageConfig = () => {
  return {
    outsideDashboard: true,
    anonymousAccess: true,
  };
};

export default DashboardPage(null, null)(LoginForm);