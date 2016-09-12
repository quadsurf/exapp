

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import styles from '../styles.js';
import { firebaseApp } from './auth/authentication';
import { rootRef } from './auth/authentication';

import FBSDK from 'react-native-fbsdk';
const {
  LoginButton
} = FBSDK;

export class home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toast: '',
      storedUser: {},
      authUser: {},
      displayName: '',
      videoURL: ''
    };
  }

  componentWillMount(){
    let user = firebaseApp.auth().currentUser;
    this.setState({ authUser: user });
    AsyncStorage.getItem('storedUser')
      .then(
        (res) => {
          let storedUser = JSON.parse(res);
          let displayName = storedUser.displayName.split(' ')[0];
          this.setState({ storedUser: storedUser });
          this.setState({ displayName: displayName });
        }
      );
  }

  componentDidMount() {
    let authUser = this.state.authUser;
    if (!authUser) {
      this.signOut();
    } else {
    let uid = authUser.uid;
    let hasAge = rootRef.child('usersSettings/'+uid+'/ageMax');
    hasAge.once('value')
      .then(
        (snap) => {
          let ageMax = snap.val();
          if (ageMax === '') {
            this.props.navigator.push({
              screen: 'settings'
            });
          }
        }
      );
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
            {this.state.displayName}
          </Text>

          <LoginButton onLogoutFinished={() => this.signOut()} />

        </View>

        <View style={styles.body}>

          <Text>
            HOME
          </Text>

        </View>
      </View>
    )
  }
}
