import { createBrowserHistory } from 'history';
import qs from 'qs';

const history = createBrowserHistory();

history.location = {
  ...history.location,
  query: qs.parse(history.location.search.substr(1)),
  state: { modal: false, scroll: false },
};


const reloadApp = (pathname: string) => {
    // Hard reload the page if new build released
    if((window as any).swUpdate) {
        window.location.href = window.location.href;
    }
}

/* istanbul ignore next */
const unlisten =  history.listen(() => {
  reloadApp(history.location.pathname);
  history.location = {
    ...history.location,
    query: qs.parse(history.location.search.substr(1)),
    state: history.location.state || {},
  };
});
unlisten();
export default history;
