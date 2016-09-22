

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  WebView
} from 'react-native';

// import styles from '../styles.js';
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

  componentDidMount() {
    if (!firebaseAuth.currentUser) {
      this.signOut();
    } else {
    let authUser = firebaseAuth.currentUser;
    let uid = authUser.uid;
    // let hasLocation = rootRef.child(`settings/${uid}/location`);
    // hasLocation.once('value')
    //   .then(
    //     (snap) => {
    //       let location = snap.val();
    //       if (location === 'done') {
    //         this.props.navigator.push({
    //           screen: 'settings',
    //           uid: uid
    //         });
    //       }
    //     }
    //   );
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
      <View style={styles.container}>

        <ScrollView>

        <WebView
          source={{uri: 'https://player.vimeo.com/video/141140711?autoplay=1&loop=1&autopause=0'}}
          style={{height:680}}
        />

        </ScrollView>

        <View style={styles.footerView}>
          <TouchableHighlight
            onPress={() => {
              this.props.navigator.push({
                screen: 'settings'
              })
            }}
          >
            <Text style={styles.footerText}>
              Settings
            </Text>
          </TouchableHighlight>
        </View>

      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  videeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    marginLeft: 15,
    marginRight: 15
  },
  videe: {
    height: 200,
    width: 150,
    backgroundColor: '#fff'
  },
  headerView: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#42bfc2'
  },
  footerView: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#42bfc2',
    bottom: 0
  },
  headerText: {
    color: '#fff',
    paddingTop: 15,
    fontSize: 20
  },
  footerText: {
    color: '#fff',
    fontSize: 20
  },
  labelRowView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    marginTop: 25,
    height: 50
  },
  labelRowText: {
    fontSize: 16,
    color: '#EC5097'
  },
  wrapperHeaderText: {
    color: '#939393',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 5,
    marginLeft: 15
  },
  wrapperFooterText: {
    color: '#939393',
    fontSize: 16,
    marginTop: 25,
    marginBottom: 25,
    alignSelf: 'center'
  },
  wrapperView: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3'
  },
  wrapperRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    height: 65,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3'
  },
  wrapperRowText: {
    fontSize: 16,
    color: '#939393'
  },
  sliderRowView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3'
  },
  arrowText: {
    fontSize: 30,
    color: '#d3d3d3'
  },
  slider: {
    width: 350,
    height: 10,
    margin: 10,
    padding: 10
  }
});
