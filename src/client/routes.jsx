// @flow

import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';
import type { Node } from 'react';

import HomeAsync from './components/home/home.async';
import ProfileAsync from './components/profile/profile.async';
import NotFound from './components/not-found';

const key = (title: string): string => {
  return module.hot ? Math.random().toString() : title;
};

// key={Math.random()} - is a workaround for work of the hmr with react-loadable
// https://medium.com/@giang.nguyen.dev/hot-loader-with-react-loadable-c8f70c8ce1a6
const routes = (): Node => (
  <Switch>
    <Route exact path="/" component={HomeAsync} key={key('index')} />
    <Route path="/profile" component={ProfileAsync} key={key('profile')} />
    <Route exact path="/404" component={NotFound} key={key('404')} />
    <Route>
      <Redirect to="/404" />
    </Route>
  </Switch>
);

export default routes;
