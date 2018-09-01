import React from 'react';
import Expo from 'expo';
import {createStackNavigator} from 'react-navigation';
import {StyleSheet, AsyncStorage} from 'react-native';
import {
  Body,
  Button,
  CheckBox,
  Container,
  Item,
  Content,
  Footer,
  Header,
  Input,
  Left,
  List,
  ListItem,
  Right,
  Text,
  Title
} from 'native-base';

const NoteView = ({txt, isDone, onCheck, id, onItemView}) => (
  <ListItem>
    <Left>
      <Left>
        <CheckBox checked={isDone} onPress={() => onCheck(id)}/>
      </Left>
      <Body>
        <Text style={isDone
          ? styles.doneText
          : {}}>{txt}</Text>
      </Body>
    </Left>
    <Right>
      <Button onPress={() => onItemView(id)}>
        <Text>View</Text>
      </Button>
    </Right>
  </ListItem>
);

const KEY_NOTES = 'devmeeting:notes';

class HomeScreen extends React.Component {
  state = {
    newNoteValue: '',
    showOnlyDone: false,
    notes: []
  }

  static navigationOptions = {
    title: 'Home'
  };

  async componentWillMount() {
    const storedNotes = await this.getStoredNotes();

    if (storedNotes.length) {
      this.setState({notes: storedNotes})
    } else {
      this.generateRandomNotes();
    }

  }

  getStoredNotes = async() => {
    const content = await AsyncStorage.getItem(KEY_NOTES);
    let notes = [];

    try {
      notes = JSON.parse(content);
    } catch (ignore) {}

    if (Array.isArray(notes) && notes.length) {
      return notes;
    }

    return [];
  }

  generateRandomNotes = () => {
    this.setState({
      notes: new Array(6)
        .fill(0)
        .map((zero, index) => index)
        .map((index) => ({
          key: `key-${index}`,
          id: `id-${index}`,
          txt: `Some custom note number ${index + 1}.`,
          isDone: Math.random() > 0.5
        }))
    })

  }

  toggleOnlyDone = () => {
    this.setState((state) => ({
      showOnlyDone: !state.showOnlyDone
    }));
  }

  onNewNoteChange = (text) => {
    this.setState((state) => ({newNoteValue: text}));
  }

  submitNewNote = () => {
    this.setState((state) => {
      const {notes, newNoteValue} = state;

      const newNote = {
        key: `key-${notes.length}`,
        id: `id-${notes.length}`,
        txt: newNoteValue,
        isDone: false
      };

      return {
        notes: notes.concat(newNote),
        newNoteValue: ''
      }
    }, this.storeNotes);
  }

  onItemView = (id) => {
    const note = this
      .state
      .notes
      .find((i) => i.id === id);
    this
      .props
      .navigation
      .navigate('Item', note);
  }

  onItemCheck = (id) => {
    const toggleNoteState = (note) => {
      if (note.id !== id) {
        return note;
      }
      return {
        ...note,
        isDone: !note.isDone
      }
    }
    this.setState((state) => ({
      notes: state
        .notes
        .map(toggleNoteState)
    }), this.storeNotes)
  }

  storeNotes = () => {
    AsyncStorage.setItem(KEY_NOTES, JSON.stringify(this.state.notes));
  }

  render() {
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
              .map(item => (<NoteView {...item} onCheck={this.onItemCheck} onItemView={this.onItemView}/>))}
          </List>
        </Content>
        <Footer>
          <Left>
            <Item rounded>
              <Input
                value={this.state.newNoteValue}
                placeholder="New note"
                onChangeText={this.onNewNoteChange}
                style={styles.newNoteInput}/>
            </Item>
          </Left>
          <Right>
            <Button success onPress={this.submitNewNote}>
              <Text>Add note</Text>
            </Button>
          </Right>
        </Footer>
      </Container>
    );
  }
}

const ItemScreen = ({navigation}) => (
  <Container>
    <Content>
      <Text>ID: {navigation.getParam('id')}</Text>
      <Text>Text: {navigation.getParam('txt')}</Text>
      <Text>Is done?: {String(navigation.getParam('isDone'))}</Text>
    </Content>
  </Container>
)

ItemScreen.navigationOptions = ({navigation}) => ({
  title: `Item "${navigation.getParam('id')}"`
})

const Navigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  Item: {
    screen: ItemScreen
  }
}, {initialRouteName: 'Home'});

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
  },
  newNoteInput: {
    color: 'white'
  }
});

export default class App extends React.Component {
  state = {
    isAppLoading: true
  };

  async componentWillMount() {
    await Expo
      .Font
      .loadAsync({'Roboto': require('native-base/Fonts/Roboto.ttf'), 'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')});

    this.setState({isAppLoading: false});

  }
  render() {
    if (this.state.isAppLoading) {
      return <Expo.AppLoading/>;
    }
    return <Navigator/>;
  }
}
