

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

      </View>
    )
  }

}
