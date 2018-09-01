import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const NoteView = ({txt}) => (
  <View>
    <Text>{txt}</Text>
  </View>
);

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <NoteView txt="This is my first static note :)"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
