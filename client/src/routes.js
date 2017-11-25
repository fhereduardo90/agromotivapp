import React from 'react';

import auth from './auth';

import Login from './containers/login';
import Dashboard from './containers/dashboard';
import UserList from './containers/users';
import UserDetail from './containers/users/details';
import UserCreate from './containers/users/create';
import UserEdit from './containers/users/edit';
import ProductList from './containers/products';
import ProductDetail from './containers/products/details';
import ProductCreate from './containers/products/create';
import ProductEdit from './containers/products/edit';
import CategoryList from './containers/categories';
import CategoryDetail from './containers/categories/details';
import CategoryCreate from './containers/categories/create';
import CategoryEdit from './containers/categories/edit';
import UnitList from './containers/units';
import UnitDetail from './containers/units/details';
import UnitCreate from './containers/units/create';
import UnitEdit from './containers/units/edit';
import StateList from './containers/states';
import StateDetail from './containers/states/details';
import StateCreate from './containers/states/create';
import StateEdit from './containers/states/edit';
import Settings from './containers/settings';

import AsyncComponent from './async';

const LandingPage = './containers/index';
const PrivacyPolicy = './containers/privacy';

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
}

export default [
  {
    path: '/',
    name: 'home',
    exact: true,
    component: props => (
      <AsyncComponent load={LandingPage}>
        {Comp => <Comp {...props} />}
      </AsyncComponent>
    ),
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/privacy-policy',
    name: 'privacy',
    exact: true,
    component: props => (
      <AsyncComponent load={PrivacyPolicy}>
        {Comp => <Comp {...props} />}
      </AsyncComponent>
    ),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    onEnter: requireAuth,
  },
  {
    path: '/user-list',
    name: 'usersList',
    exact: true,
    component: UserList,
    onEnter: requireAuth,
  },
  {
    path: '/user-list/type/:type',
    name: 'usersListFilter',
    exact: true,
    component: UserList,
    onEnter: requireAuth,
  },
  {
    path: '/user-list/create',
    name: 'userCreate',
    component: UserCreate,
    onEnter: requireAuth,
  },
  {
    path: '/user-list/view/:type/:id',
    name: 'userDetail',
    component: UserDetail,
    onEnter: requireAuth,
  },
  {
    path: '/user-list/edit/:type/:id',
    name: 'userEdit',
    exact: true,
    component: UserEdit,
    onEnter: requireAuth,
  },
  {
    path: '/products',
    name: 'productsList',
    exact: true,
    component: ProductList,
    onEnter: requireAuth,
  },
  {
    path: '/products/detail/:id',
    name: 'productDetail',
    exact: true,
    component: ProductDetail,
    onEnter: requireAuth,
  },
  {
    path: '/products/create',
    name: 'productCreate',
    exact: true,
    component: ProductCreate,
    onEnter: requireAuth,
  },
  {
    path: '/products/edit/:id',
    name: 'productEdit',
    exact: true,
    component: ProductEdit,
    onEnter: requireAuth,
  },
  {
    path: '/settings/categories',
    name: 'categoriesList',
    exact: true,
    component: CategoryList,
    onEnter: requireAuth,
  },
  {
    path: '/settings/categories/detail/:id',
    name: 'categoryDetail',
    exact: true,
    component: CategoryDetail,
    onEnter: requireAuth,
  },
  {
    path: '/settings/categories/create',
    name: 'categoryCreate',
    exact: true,
    component: CategoryCreate,
    onEnter: requireAuth,
  },
  {
    path: '/settings/categories/edit/:id',
    name: 'categoryEdit',
    exact: true,
    component: CategoryEdit,
    onEnter: requireAuth,
  },
  {
    path: '/settings',
    name: 'settings',
    exact: true,
    component: Settings,
    onEnter: requireAuth,
  },
  {
    path: '/settings/units',
    name: 'unitList',
    exact: true,
    component: UnitList,
    onEnter: requireAuth,
  },
  {
    path: '/settings/units/detail/:id',
    name: 'unitDetail',
    exact: true,
    component: UnitDetail,
    onEnter: requireAuth,
  },
  {
    path: '/settings/units/create',
    name: 'unitCreate',
    exact: true,
    component: UnitCreate,
    onEnter: requireAuth,
  },
  {
    path: '/settings/units/edit/:id',
    name: 'unitEdit',
    exact: true,
    component: UnitEdit,
    onEnter: requireAuth,
  },
  {
    path: '/settings/states',
    name: 'statesList',
    exact: true,
    component: StateList,
    onEnter: requireAuth,
  },
  {
    path: '/settings/states/detail/:id',
    name: 'stateDetail',
    exact: true,
    component: StateDetail,
    onEnter: requireAuth,
  },
  {
    path: '/settings/states/create',
    name: 'stateCreate',
    exact: true,
    component: StateCreate,
    onEnter: requireAuth,
  },
  {
    path: '/settings/states/edit/:id',
    name: 'stateEdit',
    exact: true,
    component: StateEdit,
    onEnter: requireAuth,
  },
];
