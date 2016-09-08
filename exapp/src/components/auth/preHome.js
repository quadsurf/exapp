

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';

import {firebaseApp} from './authentication';
import styles from '../../styles';

export class preHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayName: ''
    };
  }

  updateDisplayName() {
    let user = firebaseApp.auth().currentUser;
    user.updateProfile({
      displayName: this.state.displayName
    }).then(() => {
      this.props.navigator.push({
        screen: 'home'
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Create a Display Name
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({
            displayName: text
          })}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.updateDisplayName()}
        >
          <Text style={styles.buttonText}>
            Update Display Name
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

}
