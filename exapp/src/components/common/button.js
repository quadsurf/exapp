

import React, { Component } from 'react';

import {
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

export class Button extends Component {
  render() {
    return (
      <TouchableHighlight
      style={styles.button}
      underlayColor={'gray'}
      onPress={this.props.onPress}>
        <Text style={styles.buttonText}>
          {this.props.text}
        </Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 6,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      paddingBottom: 10,
      width: 250,
      borderColor: 'gray',
      marginTop: 10
    },
    buttonText: {
      flex: 1,
      alignSelf: 'center',
      fontSize: 20,
      flexWrap: 'nowrap'
    }
});
