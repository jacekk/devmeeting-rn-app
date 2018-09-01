import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';

const NoteView = ({item}) => (
  <View style={styles.item}>
    <Text>{item.txt}</Text>
  </View>
);

export default class App extends React.Component {
  state = {
    notes: new Array(100)
      .fill(0)
      .map((zero, index) => index)
      .map((index) => ({
        key: `key-${index}`,
        txt: `Some custom note number ${index + 1}.`
      }))
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.state.notes} renderItem={NoteView}/>
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
  },
  item: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  }
});
