import React from 'react';
import Expo from "expo";
import {StyleSheet} from 'react-native';
import {
  Body,
  CheckBox,
  Container,
  Content,
  Left,
  Title,
  Right,
  Header,
  List,
  ListItem,
  Button,
  Text
} from 'native-base';

const NoteView = ({txt, isDone}) => (
  <ListItem>
    <CheckBox checked={isDone}/>
    <Body>
      <Text style={isDone
        ? styles.doneText
        : {}}>{txt}</Text>
    </Body>
  </ListItem>
);

export default class App extends React.Component {
  state = {
    isAppLoading: true,
    showOnlyDone: false,
    notes: new Array(100)
      .fill(0)
      .map((zero, index) => index)
      .map((index) => ({
        key: `key-${index}`,
        txt: `Some custom note number ${index + 1}.`,
        isDone: Math.random() > 0.5
      }))
  }

  async componentWillMount() {
    await Expo
      .Font
      .loadAsync({'Roboto': require('native-base/Fonts/Roboto.ttf'), 'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')});
    this.setState({isAppLoading: false});
  }

  toggleOnlyDone = () => {
    this.setState((state) => ({
      showOnlyDone: !state.showOnlyDone
    }));
  }

  render() {
    if (this.state.isAppLoading) {
      return <Expo.AppLoading/>;
    }
    return (
      <Container>
        <Header>
          <Left>
            <Title>My notes</Title>
          </Left>
          <Right>
            <Button transparent onPress={this.toggleOnlyDone}>
              <Text>Show {this.state.showOnlyDone
                  ? 'all'
                  : 'only undone'}</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            {this
              .state
              .notes
              .filter(item => !this.state.showOnlyDone || !item.isDone)
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
  },
  doneText: {
    opacity: 0.5
  }
});
