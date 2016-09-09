

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
import { rootRef } from './authentication';

import FBSDK from 'react-native-fbsdk';
const {
  LoginButton,
  AccessToken,
  LoginManager
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

    LoginManager.logInWithReadPermissions(['public_profile','email']).then(
      function(result) {
        if (result.isCancelled) {
          alert('Facebook Login is Required!');
        } else {
          AccessToken.getCurrentAccessToken()
                .then(
                  (data) => {
                    let token = data.accessToken.toString();
                    let provider = firebase.auth.FacebookAuthProvider.credential(token);
                    firebase.auth().signInWithCredential(provider)
                      .then((user) => {
                        let uid = user.uid;
                        let childRef = rootRef.child('users/'+uid);
                        childRef.once('value')
                          .then(
                            (snap) => {
                              let userExists = snap.val();
                              if (userExists) {
                                console.log('already exists');
                              } else {
                                let newUser = {};
                                newUser[uid] = {
                                  age: '',
                                  displayName: user.displayName,
                                  videoURL: ''
                                };
                                rootRef.child('users/').update(newUser);

                                let newUserSettings = {};
                                newUserSettings[uid] = {
                                  ageMax: '',
                                  ageMin: '',
                                  distance: '',
                                  distanceOn: true,
                                  email: user.email,
                                  location: '',
                                  photoURL: user.photoURL,
                                  public: true,
                                  pushNots: true,
                                  seekingM: false,
                                  seekingW: false,
                                  signUpDate: firebase.database.ServerValue.TIMESTAMP
                                };
                                rootRef.child('usersSettings/').update(newUserSettings);
                              }
                            }
                          )
                          .catch((e) => { this.setState({ toast: e.message }) });
                      })
                      .catch( (e) => {
                        this.setState({ toast: e.message });
                      });
                  }, (e) => { this.setState({ toast: e.message }) }
                );
        }
      },
      function(error) {
        this.setState({ toast: error })
      }
    );

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
