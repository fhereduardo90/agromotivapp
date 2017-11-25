import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router';
import { LocaleProvider } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import 'normalize.css';
import 'antd/dist/antd.css';
import 'react-image-crop/dist/ReactCrop.css';

import './index.css';

import routes from './routes';
import configureStore from './store';
import registerServiceWorker from './registerServiceWorker';

// Create an enhanced history that syncs navigation events with the store
const history = createHistory();

const store = configureStore({}, history);

render(
  <Provider store={store}>
    <LocaleProvider locale={esES}>
      <ConnectedRouter history={history}>
        <Switch>
          {routes.map((props, index) => {
            return <Route key={index} {...props} />;
          })}
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
