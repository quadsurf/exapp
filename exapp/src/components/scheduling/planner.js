

import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput
} from 'react-native';

export class Planner extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Weekly Planner</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 80
  }
});
