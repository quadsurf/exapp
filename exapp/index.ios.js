

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  StyleSheet
} from 'react-native';

import { Main } from './src/main';

class exapp extends Component {
  render() {
    return (
      <Main />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
  }
});

AppRegistry.registerComponent('exapp', () => exapp);
