

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import styles from '../styles.js';
import { firebaseApp } from './auth/authentication';

export class home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toast: '',
      authUser: {},
      displayName: ''
    };
  }

  componentDidMount() {
    let user = firebaseApp.auth().currentUser;

    if(!user.displayName){
      this.props.navigator.push({
        screen: 'preHome'
      });
    } else {
      this.setState({ displayName: user.displayName });
    }

  }

  signOut(){
    firebaseApp.auth().signOut()
      .then(() => {
        this.props.navigator.popToTop();
      }, (error) => {
        this.setState({ toast: error.message });
      });
  }

  render(){
    return (
      <View style={styles.flexContainer}>
        <View style={styles.header}>

          <Text style={styles.displayName}>
            {this.state.displayName} |
          </Text>

          <TouchableOpacity
            onPress={() => this.signOut()}
          >
            <Text style={styles.link}>
              Sign Out
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    )
  }
}
