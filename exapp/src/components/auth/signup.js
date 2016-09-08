

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

export class signUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',//props.email
      password: '',//props.password
      toast: '',
      authUser: {}
    };
  }

  signUp() {
    let { email,password } = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(email,password)
      .catch(error => {
        this.setState({ toast: error.message });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>

        <Text style={styles.label}>Username:</Text>
        <TextInput
        style={styles.input}
        value={this.state.email}
        onChangeText={ (text) => this.setState({email: text}) }
        placeholder="Email"
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
        style={styles.input}
        secureTextEntry={true}
        value={this.state.password}
        onChangeText={(text) => this.setState({password: text})}
        placeholder="Password"
        />

        <Button text={'Sign Up'} onPress={()=>this.signUp()} />

        <View style={styles.links}>
          <TouchableOpacity onPress={() => this.props.navigator.pop()}>
            <Text style={[styles.link,styles.linkPadding]}>
              Already Signed Up? Sign In.
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.error}>
          {this.state.toast}
        </Text>

      </View>
    )
  }

}
