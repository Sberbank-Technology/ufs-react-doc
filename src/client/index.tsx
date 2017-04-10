import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Layout from '../common/Layout';
import configureStore from '../redux/configureStore';

const history = createBrowserHistory();
const preloadedState = window['__PRELOADED_STATE__'];

delete window['__PRELOADED_STATE__'];

const store = configureStore(preloadedState);

ReactDOM.render(
    (
        <Provider store={store}>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </Provider>
    ),
    document.querySelector('#root')
);

if (module['hot']) {
    console.log("i'm hot");
    module['hot'].accept();
}
