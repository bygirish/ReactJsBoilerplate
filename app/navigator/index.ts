import * as Router from 'connected-react-router';
import { WebStoreProviderService } from '@store/WebStoreProviderService';

function dispatchNavigationAction(action: any) {
  const store = WebStoreProviderService.getStore();
  if (store) return store.dispatch(action);
}

function push(pathName: string, params?: Object) {
  dispatchNavigationAction(Router.push(pathName, params));
}

function replace(pathName: string, params?: Object) {
  dispatchNavigationAction(Router.replace(pathName, params));
}
function go(n: number) {
  dispatchNavigationAction(Router.go(n));
}

function goBack() {
  dispatchNavigationAction(Router.goBack());
}

function goForward() {
  dispatchNavigationAction(Router.goBack());
}

function getCurrentLocation() {
  const store = WebStoreProviderService.getStore();
  return (store.getState().router && store.getState().router.location) ? store.getState().router.location : null;
}

export default {
  push,
  replace,
  go,
  goBack,
  goForward,
  getCurrentLocation,
};
