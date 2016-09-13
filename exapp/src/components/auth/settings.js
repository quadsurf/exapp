

import React, { Component } from 'react';
import t from 'tcomb-form-native';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';

import { firebaseApp, rootRef } from './authentication';
import styles from '../../styles';

const Form = t.form.Form;

const Person = t.struct({
  name: t.String,              // a required string
  surname: t.maybe(t.String),  // an optional string
  age: t.Number,               // a required number
  rememberMe: t.Boolean        // a boolean
});

const SettingsModel = t.struct({
  birthYear: t.Number,
  ageMin: t.Number,
  ageMax: t.Number,
  distanceOn: t.Boolean,
  distance: t.Number,
  location: t.String,
  public: t.Boolean,
  pushNots: t.Boolean,
  seekingM: t.Boolean,
  seekingW: t.Boolean
});

// birthYear={this.state.settings.birthYear},
// ageMax={this.state.settings.ageMax},
// ageMin={this.state.settings.ageMin},
// distance={this.state.settings.distance},
// distanceOn={this.state.settings.distanceOn},
// location={this.state.settings.location},
// public={this.state.settings.public},
// pushNots={this.state.settings.pushNots},
// seekingM={this.state.settings.seekingM},
// seekingW={this.state.settings.seekingW}

const options = {
  auto: 'placeholders'
};

export class settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      toast: '',
      uid: '',
      settings: {},
      displayName: '',
      value: {
        name: 'Yo Yo',
        surname: 'Man',
        age: 23,
        rememberMe: true
      }
    };
  }

  componentWillMount(){
    AsyncStorage.getItem('storedUser')
      .then(
        (res) => {
          let user = JSON.parse(res);
          this.setState({
            uid: user.uid
          });
        }
      );
    AsyncStorage.getItem('displayName')
      .then(
        (res) => {
          let displayName = JSON.parse(res);
          this.setState({
            displayName: displayName
          });
        }
      );
  }

  componentDidMount(){
    let uid = this.state.uid;
    let settingsRef = rootRef.child('settings/'+uid);
    settingsRef.once('value')
      .then(
        (snap) => {
          let settings = snap.val();
          let uid = this.state.uid.toString();
          this.setState({
            settings: settings[uid]
          });
        }
      );
  }

  componentDidUpdate(){
    console.log(this.state.uid);
    console.log(this.state.settings);
    console.log(this.state.displayName);
  }

  updateSettings(key,value){
    let settingsRef = rootRef.child('settings/'+uid+'/'+key);
    settingsRef.update(value)
      .then(
        () => {
          this.setState({ toast: 'Updated' });
        },
        (e) => {
          this.setState({ toast: e.message });
        }
      );
  }

  onPress() {
    // call getValue() to get the values of the form
    let settings = this.refs.form.getValue();
    if (settings) { // if validation fails, value will be null
      console.log(settings); // value here is an instance of Person
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Search Settings for {this.state.displayName}
        </Text>
        <Text>
         birthYear={this.state.settings.birthYear},
         ageMax={this.state.settings.ageMax},
         ageMin={this.state.settings.ageMin},
         distance={this.state.settings.distance},
         distanceOn={this.state.settings.distanceOn},
         location={this.state.settings.location},
         public={this.state.settings.public},
         pushNots={this.state.settings.pushNots},
         seekingM={this.state.settings.seekingM},
         seekingW={this.state.settings.seekingW}
       </Text>
       <View style={styles.container}>
        {/* display */}
        <Form
          ref="form"
          type={SettingsModel}
          options={options}
          value={this.state.settings}
        />
        <TouchableHighlight style={styles.button} onPress={()=>this.onPress()} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
      </View>
    )
  }

}
