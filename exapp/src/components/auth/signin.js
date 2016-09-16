

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
import {
  facebookProvider,
  firebaseAuth,
  rootRef,
  firebaseTime
} from './authentication';

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

  componentDidMount(){
    firebaseAuth.onAuthStateChanged(firebaseUser=>{
      if(firebaseUser){
        console.log('signin screen - onAuthStateChanged has firebaseUser');
        AsyncStorage.setItem('storedUser', JSON.stringify(firebaseUser));
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

  checkIfUserExistsInObj(path,uid){
    let status = true;
    let childRef = rootRef.child(path+uid);
    childRef.once('value')
      .then(
        (snap) => {
          let userExists = snap.val();
          if (!userExists) {
            status = false;
          }
          console.log(path,status);
          return status;
        }
      )
      .catch( (e) => {
        self.setState({ toast: e.message });
        console.error(e);
      });
  }

  addUserToFacebookObj(uid,facebookUser,email,photo){
    let newFacebookUser = {};
    newFacebookUser[uid] = {
      id: facebookUser.id,
      email: email,
      name: facebookUser.name,
      first_name: facebookUser.first_name,
      last_name: facebookUser.last_name,
      age_range: facebookUser.age_range,
      link: facebookUser.link,
      gender: facebookUser.gender,
      locale: facebookUser.locale,
      picture: facebookUser.picture.data.url,
      photoURL: photo,
      timezone: facebookUser.timezone,
      verified: facebookUser.verified,
      signUpDate: firebaseTime
    };
    rootRef.child('facebook/').update(newFacebookUser);
  }

  addUserToSettingsObj(uid){
    let newUserSettings = {};
    newUserSettings[uid] = {
      birthYear: '',
      ageMax: 80,
      ageMin: 18,
      distance: 50,
      distanceOn: true,
      location: '',
      public: true,
      pushNots: true,
      seekingM: false,
      seekingW: false
    };
    rootRef.child('settings/').update(newUserSettings);
  }

  addUserToUsersObj(uid,displayName){
    let newUser = {};
    newUser[uid] = {
      age: '',
      displayName: displayName,
      videoURL: ''
    };
    rootRef.child('users/').update(newUser);
  }

  createFirebaseUser(token,result){

    let self = this;
    let facebookUser = result;
    let displayName = facebookUser.first_name;

    let provider = facebookProvider.credential(token);
    firebaseAuth.signInWithCredential(provider)
      .then((user) => {
        let uid = user.uid;
        let email = user.email;
        let photo = user.photoURL;


        let usersRef = rootRef.child('users/'+uid);
        usersRef.once('value')
          .then(
            (snap) => {
              let userExists = snap.val();
              if (!userExists) {
                self.addUserToUsersObj(uid,displayName);
              } else {
                console.log('signin screen - user in usersObj already exists');
              }
            }
          )
          .catch( (e) => {
            self.setState({ toast: e.message });
            console.error(e);
          });



        let settingsRef = rootRef.child('settings/'+uid);
        settingsRef.once('value')
          .then(
            (snap) => {
              let userExists = snap.val();
              if (!userExists) {
                self.addUserToSettingsObj(uid);
              } else {
                console.log('signin screen - user in settingsObj already exists');
              }
            }
          )
          .catch( (e) => {
            self.setState({ toast: e.message });
            console.error(e);
          });



          let facebookRef = rootRef.child('facebook/'+uid);
          facebookRef.once('value')
            .then(
              (snap) => {
                let userExists = snap.val();
                if (!userExists) {
                  self.addUserToFacebookObj(uid,facebookUser,email,photo);
                } else {
                  console.log('signin screen - user in facebookObj already exists');
                }
              }
            )
            .catch( (e) => {
              self.setState({ toast: e.message });
              console.error(e);
            });



            // let usersObjStatus = new Promise((resolve,reject) => {
            //   let usersPath = 'users/';
            //   self.checkIfUserExistsInObj(usersPath,uid);
            // });
            // usersObjStatus
            //   .then((result) => {
            //     console.log('signin screen - usersObjStatus',result);
            //     if (result === false){
            //       self.addUserToUsersObj(uid,displayName);
            //     } else {
            //       console.log('signin screen - user in usersObj already exists');
            //     }
            //   })
            //   .catch((e) => {
            //     console.error(e);
            //   });



      })
      .catch( (e) => {
        self.setState({ toast: e.message });
        console.error(e);
        console.log('signin screen - facebook provider token signInWithCredential failed');
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
                    console.log('signin screen - facebook token granted, ready to generate firebaseUser');
                    //start facebook graph request
                    const responseInfoCallback = (error, result) => {
                      if (error) {
                        console.error(error);
                        alert('Error fetching data: ' + error.toString());
                      } else {
                        // AsyncStorage.setItem('facebooker', JSON.stringify(result));
                        self.createFirebaseUser(token,result);
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

                  })
                  .catch( (e) => {
                    self.setState({ toast: e.message });
                    console.error(e);
                  });
        }
      })
      .catch( (e) => {
        self.setState({ toast: e.message });
        console.error(e);
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
