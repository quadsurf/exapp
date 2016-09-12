

import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage
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
  LoginManager,
  GraphRequest,
  GraphRequestManager
} = FBSDK;

export class signIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toast: '',
      authUser: {}
    };
  }

  componentDidUpdate(){
    this.setStorage();
  }

  setStorage(){
    AsyncStorage.setItem('storedUser', JSON.stringify(this.state.authUser));
  }

  componentDidMount(){
    firebaseApp.auth().onAuthStateChanged(firebaseUser=>{
      if(firebaseUser){
        this.setState({ authUser: firebaseUser });
        this.setState({ toast: this.state.authUser.email });
        this.props.navigator.push({
          screen: 'home'
        });
      } else {
        this.setState({ toast: 'Logged Out' });
      }
    });
  }

  signIn() {

    let self = this;
    LoginManager.logInWithReadPermissions(['public_profile','email']).then(
      function(result) {
        if (result.isCancelled) {
          alert('Facebook Login is Required!');
        } else {
          AccessToken.getCurrentAccessToken()
                .then(
                  (data) => {
                    let token = data.accessToken.toString();

                    //start facebook graph request
                    const responseInfoCallback = (error, result) => {
                      if (error) {
                        console.log(error)
                        alert('Error fetching data: ' + error.toString());
                      } else {
                        AsyncStorage.setItem('facebooker', JSON.stringify(result));
                      }
                    }

                    const infoRequest = new GraphRequest(
                      '/me',
                      {
                        accessToken: token,
                        parameters: {
                          fields: {
                            string: 'id,name,first_name,last_name,age_range,link,gender,locale,picture,timezone,updated_time,verified'
                          }
                        }
                      },
                      responseInfoCallback
                    );

                    new GraphRequestManager().addRequest(infoRequest).start();
                    //end facebook graph request

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
                                AsyncStorage.getItem('facebooker')
                                .then(
                                  (res) => {
                                    let facebookUser = JSON.parse(res)
                                    let newUser = {};
                                    newUser[uid] = {
                                      age: '',
                                      displayName: facebookUser.first_name,
                                      videoURL: ''
                                    };
                                    rootRef.child('users/').update(newUser);

                                    let newUserSettings = {};
                                    newUserSettings[uid] = {
                                      ageMax: '',
                                      ageMin: 18,
                                      distance: '',
                                      distanceOn: true,
                                      location: '',
                                      public: true,
                                      pushNots: true,
                                      seekingM: false,
                                      seekingW: false
                                    };
                                    rootRef.child('usersSettings/').update(newUserSettings);

                                    let newFacebookUser = {};
                                    newFacebookUser[uid] = {
                                      id: facebookUser.id,
                                      email: user.email,
                                      name: facebookUser.name,
                                      first_name: facebookUser.first_name,
                                      last_name: facebookUser.last_name,
                                      age_range: facebookUser.age_range,
                                      link: facebookUser.link,
                                      gender: facebookUser.gender,
                                      locale: facebookUser.locale,
                                      picture: facebookUser.picture.data.url,
                                      photoURL: user.photoURL,
                                      timezone: facebookUser.timezone,
                                      verified: facebookUser.verified,
                                      signUpDate: firebase.database.ServerValue.TIMESTAMP
                                    };
                                    rootRef.child('facebookUsers/').update(newFacebookUser);
                                  }
                                );
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
