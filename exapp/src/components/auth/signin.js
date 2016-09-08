

import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { Button } from '../common/button';
import styles from '../../styles';
import { firebaseApp } from './authentication';
import { provider } from './authentication';
// import { FBSDK } from './authentication';

import FBSDK from 'react-native-fbsdk';
const {
  LoginButton,
  AccessToken
} = FBSDK;

export class signIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toast: '',
      authUser: {}
    };
  }

  componentDidMount(){
    firebaseApp.auth().onAuthStateChanged(firebaseUser=>{
      if(firebaseUser){
        this.setState({ authUser: firebaseUser });
        this.setState({ toast: this.state.authUser.email });
        console.log(this.state.authUser);
        this.props.navigator.push({
          screen: 'home'
        });
      } else {
        this.setState({ toast: 'Logged Out' });
      }
    });
  }

  signIn() {
    firebase.auth().signInWithPopup(provider)
    // firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential('4ef5ce8a22bb89fcc8396bbcbf3d1e0d'))
      .catch(error => {
        this.setState({ toast: error.message });
      });
  }

  render() {
    return (
      <View style={styles.container}>

        <Button text={'Log in with Facebook'} onPress={()=>this.signIn()} />

        <Text style={styles.error}>
          {this.state.toast}
        </Text>

        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    alert(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("logout.")}/>

      </View>
    )
  }

}
