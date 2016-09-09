

import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDzFJoEU5ja37dCl8cEJ5wNk4uWiDr2_dU",
    authDomain: "exapp-7ab81.firebaseapp.com",
    databaseURL: "https://exapp-7ab81.firebaseio.com",
    storageBucket: "exapp-7ab81.appspot.com",
  };

export const firebaseApp = firebase.initializeApp(config);
export const rootRef = firebase.database().ref();
// export const topicsRef = firebase.database().ref();
export const provider = new firebase.auth.FacebookAuthProvider();
// const rootRef = firebase.database().ref();
// const itemsRef = rootRef.child('items');


// listenForItems(itemsRef) {
//     itemsRef.on('value', (snap) => {
//
//       // get children as an array
//       var items = [];
//       snap.forEach((child) => {
//         items.push({
//           title: child.val().title,
//           _key: child.key
//         });
//       });
//
//       this.setState({
//         dataSource: this.state.dataSource.cloneWithRows(items)
//       });
//
//     });
//   }
