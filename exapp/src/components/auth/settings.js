

import React, { Component } from 'react';

import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage,
  TouchableHighlight,
  StyleSheet,
  Switch,
  ScrollView,
  Slider
} from 'react-native';

import { firebaseAuth, rootRef } from './authentication';
// import styles from '../../styles';

import FBSDK from 'react-native-fbsdk';
const {
  LoginButton,
  LoginManager
} = FBSDK;

export class settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toast: '',
      uid: '',
      // propsUid: '',
      // authUid: '',
      displayName: '',
      birthYear: null,
      public: null,
      pushNots: null,
      distanceOn: null,
      cities: {},
      distance: null,
      ageMin: null,
      ageMax: null,
      seekingM: null,
      seekingW: null
    };
  }

  componentWillMount(){
    AsyncStorage.getItem('storedUser')
      .then(
        (res) => {
          let user = JSON.parse(res);
          // let propsUid = this.props.uid;
          // let authUid = firebaseAuth.currentUser.uid;
          this.setState({
            uid: user.uid,
            displayName: user.displayName
            // propsUid: propsUid,
            // authUid: authUid
          });
        }
      );
  }

  componentDidMount(){
    let uid = this.state.uid;
    if (!firebaseAuth.currentUser) {
      this.signOut();
    } else {
    // let authUser = firebaseAuth.currentUser;
    // console.log('settings screen - Authenticated User? ',authUser);
    let settingsRef = rootRef.child(`settings/${uid}`);
    settingsRef.once('value')
      .then(
        (snap) => {
          let settings = snap.val();
          let uid = this.state.uid.toString();
          this.setState({
            birthYear: settings[uid].birthYear,
            public: settings[uid].public,
            pushNots: settings[uid].pushNots,
            distanceOn: settings[uid].distanceOn,
            cities: settings[uid].cities,
            distance: settings[uid].distance,
            ageMin: settings[uid].ageMin,
            ageMax: settings[uid].ageMax,
            seekingM: settings[uid].seekingM,
            seekingW: settings[uid].seekingW
          });
          console.log('this.state.cities');
          console.log(this.state.cities);
        }
      )
      .catch(
        (e) => {
          console.log('Failed to Return Settings Data from DB');
          console.error(e);
        }
      );
    }
  }

  updateSettings(key,value){
    let uid = this.state.uid;
    let settingsRef = rootRef.child('settings/'+uid);
    settingsRef.update({
      [key]: value
    })
      .then(
        () => {
          this.setState({ [key]: value });
          this.setState({ toast: 'Updated' });
        },
        (e) => {
          this.setState({ toast: e.message });
        }
      );
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

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.headerView}>
          <Text style={styles.headerText}>
            Excited
          </Text>
        </View>

        <View style={styles.labelRowView}>
          <Text style={styles.labelRowText}>
            Settings for {this.state.displayName}
          </Text>
        </View>

        <ScrollView>

        <Text style={styles.wrapperHeaderText}>
          SEARCH SETTINGS
        </Text>
        <View style={styles.wrapperView}>

          <View style={styles.wrapperRowView}>
            <Text style={styles.wrapperRowText}>
              Limit Distance
            </Text>
            <Switch
              onValueChange={(value) => this.updateSettings('distanceOn',value)}
              value={this.state.distanceOn}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              this.props.navigator.push({
                screen: 'mapSelector',
                cities: this.state.cities
              });
            }}
            style={styles.wrapperRowView}
            >
            <Text style={styles.wrapperRowText}>
              Limit Distance To
            </Text>
            <Text style={styles.arrowText}>
              >
            </Text>
          </TouchableOpacity>

          <View style={styles.sliderRowView}>
            <Text style={styles.wrapperRowText}>
              Limit Distance to  by {this.state.distance} Miles
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={100}
              step={5}
              value={this.state.distance}
              onSlidingComplete={(value) => this.updateSettings('distance',value)}
            />
          </View>

          <View style={styles.sliderRowView}>
            <Text style={styles.wrapperRowText}>
              Minimum Age {this.state.ageMin}
            </Text>

            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={60}
              step={1}
              value={this.state.ageMin}
              onSlidingComplete={(value) => this.updateSettings('ageMin',value)}
            />

            <Slider
              style={styles.slider}
              minimumValue={21}
              maximumValue={80}
              step={1}
              value={this.state.ageMax}
              onSlidingComplete={(value) => this.updateSettings('ageMax',value)}
            />

            <Text style={styles.wrapperRowText}>
              Maximum Age {this.state.ageMax}
            </Text>
          </View>

          <View style={styles.wrapperRowView}>
            <Text style={styles.wrapperRowText}>
              Seeking Men
            </Text>
            <Switch
              onValueChange={(value) => this.updateSettings('seekingM',value)}
              value={this.state.seekingM}
            />
          </View>

          <View style={styles.wrapperRowView}>
            <Text style={styles.wrapperRowText}>
              Seeking Women
            </Text>
            <Switch
              onValueChange={(value) => this.updateSettings('seekingW',value)}
              value={this.state.seekingW}
            />
          </View>

        </View>


        <Text style={styles.wrapperHeaderText}>
          PROFILE SETTINGS
        </Text>
        <View style={styles.wrapperView}>

          <TouchableOpacity style={styles.wrapperRowView}>
            <Text style={styles.wrapperRowText}>
              My Video
            </Text>
            <Text style={[styles.wrapperRowText, styles.arrowText]}>
              >
            </Text>
          </TouchableOpacity>

          <View style={styles.wrapperRowView}>
            <Text style={styles.wrapperRowText}>
              Make My Profile Public
            </Text>
            <Switch
              onValueChange={(value) => this.updateSettings('public',value)}
              value={this.state.public}
            />
          </View>

          <View style={styles.wrapperRowView}>
            <Text style={styles.wrapperRowText}>
              Birth Year
            </Text>
            <Text style={styles.wrapperRowText}>
              {this.state.birthYear}
            </Text>
          </View>

          <View style={styles.wrapperRowView}>
            <Text style={styles.wrapperRowText}>
              Allow Push Notifications
            </Text>
            <Switch
              onValueChange={(value) => this.updateSettings('pushNots',value)}
              value={this.state.pushNots}
            />
          </View>

        </View>

        <TouchableHighlight
          onPress={() => this.signOut()}
          style={styles.labelRowView}>
          <Text>
            Log Out
          </Text>
        </TouchableHighlight>

        <Text style={styles.wrapperFooterText}>
          Excited, Copyright 2016
        </Text>

        </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  headerView: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#42bfc2'
  },
  headerText: {
    color: '#fff',
    paddingTop: 15,
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
