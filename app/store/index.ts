
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import reducers from './webReducers';
import rootSaga from './webSagas';
import history from '@utils//history';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const configStore = () => {

  let composeEnhancers = compose;
  const reduxSagaMonitorOptions = {};

  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const middlewares = [sagaMiddleware, routerMiddleware(history)];
  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    reducers,
    composeEnhancers(...enhancers),
  );
  sagaMiddleware.run(rootSaga);

  if (module.hot) {
      module.hot.accept('./webReducers', () => {
      const nextRootReducer = require('./webReducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return {
    store,
    persistor: persistStore(store),
  };
};

export const storeData = () => {
  const { store, persistor } = configStore();
  return { store, persistor };
}
