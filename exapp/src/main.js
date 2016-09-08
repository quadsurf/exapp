

import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { signIn } from './components/auth/signin';
import { signUp } from './components/auth/signup';
import { home } from './components/home';
import { preHome } from './components/auth/preHome';

const routes = {
  signIn,
  signUp,
  home,
  preHome
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
    return (
      <Component
        navigator={navigator}
      />
    )
  }
};
