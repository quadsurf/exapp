

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
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
      authUser: {},
      displayName: '',
      videoURL: ''
    };
  }

  componentDidMount() {
    let user = firebaseApp.auth().currentUser;
    let uid = user.uid;
    this.setState({ authUser: user });
    this.setState({ displayName: user.displayName });
    let hasVideo = rootRef.child('users/'+uid+'/videoURL');
    hasVideo.once('value')
      .then(
        (snap) => {
          let videoURL = snap.val();
          if (videoURL === '') {
            this.props.navigator.push({
              screen: 'preHome'
            });
          } else {
            this.setState({ videoURL: videoURL });
          }
        }
      );
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
