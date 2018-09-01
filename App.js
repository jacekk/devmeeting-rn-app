import React from 'react';
import Expo from "expo";
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

const NoteView = ({txt, isDone, onCheck, id}) => (
  <ListItem>
    <CheckBox checked={isDone} onPress={() => onCheck(id)}/>
    <Body>
      <Text style={isDone
        ? styles.doneText
        : {}}>{txt}</Text>
    </Body>
  </ListItem>
);

const KEY_NOTES = 'devmeeting:notes';

class App extends React.Component {
  state = {
    newNoteValue: '',
    isAppLoading: true,
    showOnlyDone: false,
    notes: []
  }

  async componentWillMount() {
    await Expo
      .Font
      .loadAsync({'Roboto': require('native-base/Fonts/Roboto.ttf'), 'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')});

    const storedNotes = await this.getStoredNotes();

    this.setState({isAppLoading: false});

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
              .map(item => (<NoteView {...item} onCheck={this.onItemCheck}/>))}
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

export default App;
