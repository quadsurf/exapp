

import { StyleSheet } from 'react-native';

const blue = '#42bfc2';
const navy = '#1a237e';
const white = '#fff';
const black = '#000';
const red = '#FF0000';

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: blue
  },
  flexContainer: {
    flex: 1,
    backgroundColor: blue
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    width: 250,
    borderColor: 'gray',
    marginTop: 10
  },
  buttonText: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 20,
    flexWrap: 'nowrap'
  },
  header: {
    padding: 10,
    height: 65,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: white
  },
  body: {
    flex: 24,
    paddingRight: 20,
    paddingLeft: 20
  },
  displayName: {
    textAlign: 'right'
  },
  input: {
    padding: 4,
    paddingLeft: 10,
    height: 40,
    borderColor: black,
    borderWidth: 1,
    borderRadius: 6,
    margin: 5,
    width: 250,
    alignSelf: 'center',
    backgroundColor: white
  },
  label: {
    fontSize: 18
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  link: {
    color: navy
  },
  linkPadding: {
    paddingRight: 70
  },
  error: {
    color: red
  }
});
