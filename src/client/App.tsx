import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { createStore } from 'redux';
import createBrowserHistory from 'history/createBrowserHistory';
import Layout from '../common/Layout';
import reducers from '../redux/reducers';

import './App.css';

declare var __DEV__: boolean;

const history = createBrowserHistory();
const preloadedState = window['__PRELOADED_STATE__'];

delete window['__PRELOADED_STATE__'];

const store = createStore(reducers, preloadedState);
const Router = __DEV__ == true ? BrowserRouter : HashRouter;

ReactDOM.render(
    (
        <Provider store={store}>
            <Router>
                <Layout {...preloadedState} />
            </Router>
        </Provider>
    ),
    document.querySelector('#root')
);

if (module['hot']) {
    module['hot'].accept();
}
