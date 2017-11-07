import auth from './auth'

const LandingPage = './containers/index';
const Login = './containers/login';
const Dashboard = './containers/dashboard';
const UserList = './containers/users/index';
const UserDetail = './containers/users/details';
const UserCreate = './containers/users/create';
const UserEdit = './containers/users/edit';
const ProductList = './containers/products/index';
const ProductDetail = './containers/products/details';
const ProductCreate = './containers/products/create';
const ProductEdit = './containers/products/edit';
const CategoryList = './containers/categories/index';
const CategoryDetail = './containers/categories/details';
const CategoryCreate = './containers/categories/create';
const CategoryEdit = './containers/categories/edit';
const UnitList = './containers/units/index';
const UnitDetail = './containers/units/details';
const UnitCreate = './containers/units/create';
const UnitEdit = './containers/units/edit';
const StateList = './containers/states/index';
const StateDetail = './containers/states/details';
const StateCreate = './containers/states/create';
const StateEdit = './containers/states/edit';
const Settings = './containers/settings/index';

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

export default [
    {
        path: '/',
        name: 'home',
        exact: true,
        component: LandingPage,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
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