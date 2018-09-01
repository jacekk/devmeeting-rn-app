import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text
} from 'native-base';

const NoteView = ({txt}) => (
  <ListItem>
    <Text>{txt}</Text>
  </ListItem>
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
      <Container>
        <Header />
        <Content>
          <List>
            {this
              .state
              .notes
              .map(item => (<NoteView {...item}/>))}
          </List>
        </Content>
      </Container>
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
