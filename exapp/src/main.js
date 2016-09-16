

import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { signIn } from './components/auth/signin';
import { home } from './components/home';
import { settings } from './components/auth/settings';
import { mapSelector } from './components/mapSelector';
import { myVideos } from './components/myVideos';

const routes = {
  signIn,
  home,
  settings,
  mapSelector,
  myVideos
}

export class Main extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{screen: 'signIn'}}
        renderScene={this.renderScene}
      />
    )
  }
  renderScene(route,navigator){
    let Component = routes[route.screen];
    let { cities, uid } = route;
    return (
      <Component
        navigator={navigator}
        cities={cities}
        uid={uid}
      />
    )
  }
};
