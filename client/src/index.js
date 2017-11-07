import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router'
import 'normalize.css'
import 'antd/dist/antd.css'
import 'react-image-crop/dist/ReactCrop.css'

import './index.css'

import AsyncComponent from './async'

import routes from './routes';
import configureStore from './store';
import registerServiceWorker from './registerServiceWorker';

// Create an enhanced history that syncs navigation events with the store
const history = createHistory();

const store = configureStore({}, history);

render(
	<Provider store={ store }>
		<ConnectedRouter history={history}>
			<Switch>
				{ routes.map(({ component, ...routeData }, index) => {
					return (
						<Route
							key={ index }
							{ ...routeData }
							render={ (props) => {
								return (
									<AsyncComponent load={ component }>
										{(Comp) => <Comp {...props}/>}
									</AsyncComponent>
								);
							} }
						/>
					);
				}) }
			</Switch>
		</ConnectedRouter>
	</Provider>
, document.getElementById('root'));
registerServiceWorker();
