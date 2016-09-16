

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import styles from '../styles.js';
import { firebaseAuth, rootRef } from './auth/authentication';

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
      displayName: '',
      videoURL: ''
    };
  }

  // componentDidUpdate(){
  //   this.setStorage();
  // }
  //
  // setStorage(){
  //   AsyncStorage.setItem('storedUser', JSON.stringify(this.state.authUser));
  // }

  // componentWillMount(){
  //   let user = firebaseAuth.currentUser;
  //   this.setState({ authUser: user });
  //   AsyncStorage.getItem('storedUser')
  //     .then(
  //       (res) => {
  //         let storedUser = JSON.parse(res);
  //         let displayName = storedUser.displayName.split(' ')[0];
  //         this.setState({ storedUser: storedUser });
  //         this.setState({ displayName: displayName });
  //       }
  //     );
  // }

  componentDidMount() {
    let authUser = firebaseAuth.currentUser;
    console.log('home screen Authenticated User? ',authUser);
    if (!authUser) {
      this.signOut();
    } else {
    let uid = authUser.uid;
    let hasLocation = rootRef.child('settings/'+uid+'/location');
    hasLocation.once('value')
      .then(
        (snap) => {
          let location = snap.val();
          if (location === '') {
            this.props.navigator.push({
              screen: 'settings'
            });
          }
        }
      );
    }
  }

  signOut(){
    firebaseAuth.signOut()
      .then(() => {
        this.props.navigator.popToTop();
      }, (e) => {
        this.setState({ toast: e.message });
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
