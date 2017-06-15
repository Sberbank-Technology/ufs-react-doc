import { createStore, applyMiddleware, Store } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';


export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );

    if (module && module['hot']) {
        // Enable Webpack hot module replacement for reducers
        module['hot'].accept('./reducers/index', () => {
            const nextRootReducer = require('./reducers/index').default;
            console.log(nextRootReducer);
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
}
