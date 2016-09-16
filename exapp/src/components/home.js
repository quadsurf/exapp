

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';

import styles from '../styles.js';
import { firebaseAuth, rootRef } from './auth/authentication';

import FBSDK from 'react-native-fbsdk';
const {
  LoginButton,
  LoginManager
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
    if (!firebaseAuth.currentUser) {
      this.signOut();
    } else {
    let authUser = firebaseAuth.currentUser;
    let uid = authUser.uid;
    let hasLocation = rootRef.child(`settings/${uid}/location`);
    hasLocation.once('value')
      .then(
        (snap) => {
          let location = snap.val();
          if (location === 'done') {
            this.props.navigator.push({
              screen: 'settings',
              uid: uid
            });
          }
        }
      );
    }
  }

  signOut(){
    LoginManager.logOut();
    firebaseAuth.signOut()
      .then(() => {
        let authUser = firebaseAuth.currentUser;
        if (!authUser){
          this.props.navigator.popToTop();
        }
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
          <TouchableHighlight
            onPress={() => this.signOut()}
          >
            <Text>
              Log Out
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => {
              this.props.navigator.push({
                screen: 'settings'
              })
            }}
          >
            <Text>
              Settings
            </Text>
          </TouchableHighlight>

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
