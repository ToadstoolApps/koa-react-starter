// @flow

import React from 'react';
import type { Node } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import type { BrowserHistory } from 'history/createBrowserHistory';
import { ConnectedRouter } from 'connected-react-router';

import { AppProvider, Page, Card, Button } from '@shopify/polaris';
import { Link } from 'react-router-dom';

import type { StateType, StoreType } from './resources/types';

import routes from './routes';
import configureStore from './resources/store';

import styles from './styles.pcss';
import Layout from './components/layout';

const minLoadingTime: number = 1500;
const now: number = Date.now();

const initialState: StateType = {
  user: window.user,
  toast: {
    messages: [],
  },
};

const history: BrowserHistory = createHistory();
const store: StoreType = configureStore(initialState, history);
const CustomLinkComponent = ({ children, url, ...rest }): Node => {
  return (
    <Link to={url} {...rest}>
      {children}
    </Link>
  );
};

const Root = (): Node => (
  <AppProvider linkComponent={CustomLinkComponent}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Page title="Example app">
          <Card sectioned>
            <Button onClick={() => alert('Button clicked!')}>Example button</Button>
          </Card>
        </Page>
      </ConnectedRouter>
    </Provider>
  </AppProvider>
);

const renderApp = () => {
  const rootEl = document.getElementById('root');
  if (!(rootEl instanceof Element)) {
    throw new Error('invalid type');
  }

  ReactDOM.render(
    <Root />,
    rootEl,
  );
};

const hidePoster = () => {
  const poster = document.getElementById('poster');
  const html = document.documentElement;
  if (!(poster instanceof Element) || !(html instanceof Element)) {
    return;
  }
  poster.classList.add(styles.posterHidden);

  setTimeout(() => {
    poster.classList.add(styles.posterNone);
    html.classList.remove('show-poster');
  }, 600);
};

renderApp();

if (now - window.loadingTime > minLoadingTime) {
  hidePoster();
} else {
  setTimeout(hidePoster, minLoadingTime - (now - window.loadingTime));
}

if (module.hot) {
  module.hot.accept('./routes', () => {
    renderApp();
  });
}
