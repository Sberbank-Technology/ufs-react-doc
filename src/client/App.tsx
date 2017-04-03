import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import createBrowserHistory from 'history/createBrowserHistory';
import Layout from '../common/Layout';
import reducers from '../redux/reducers';

import './App.css';


const history = createBrowserHistory();
const preloadedState = window['__PRELOADED_STATE__'];

delete window['__PRELOADED_STATE__'];

const store = createStore(reducers, preloadedState);

ReactDOM.render(
    (
        <Provider store={store}>
            <BrowserRouter>
                <Layout {...preloadedState} />
            </BrowserRouter>
        </Provider>
    ),
    document.querySelector('#root')
);
