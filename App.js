import React from 'react';
import Expo from 'expo';
import {createStackNavigator} from 'react-navigation';
import {StyleSheet, AsyncStorage, View} from 'react-native';
import {
  Body,
  Button,
  CheckBox,
  Container,
  Content,
  Footer,
  Header,
  Input,
  Item,
  Left,
  List,
  ListItem,
  Right,
  Text,
  Title
} from 'native-base';

const NoteView = ({
  txt,
  isDone,
  onCheck,
  id,
  onItemView,
  onItemEdit
}) => (
  <ListItem>
    <View style={styles.itemContent}>
      <View style={styles.checkedCol}>
        <CheckBox checked={isDone} onPress={() => onCheck(id)}/>
      </View>
      <View style={styles.textCol}>
        <Text style={isDone
          ? styles.doneText
          : {}}>{txt}</Text>
      </View>
      <View style={styles.buttonCol}>
        <Button onPress={() => onItemView(id)}>
          <Text>View</Text>
        </Button>
      </View>
      <View style={styles.buttonCol}>
        <Button onPress={() => onItemEdit(id)}>
          <Text>Edit</Text>
        </Button>
      </View>
    </View>
  </ListItem>
);
const KEY_NOTES = 'devmeeting:notes';
class HomeScreen extends
React.Component {
  state = {
    newNoteValue: '',
    showOnlyDone: false,
    notes: []
  }

  static navigationOptions = {
    title: 'My notes'
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

  onItemEdit = (id) => {
    const note = this
      .state
      .notes
      .find((i) => i.id === id);
    this
      .props
      .navigation
      .navigate('EditItem', note);
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
            <Title>List of notes</Title>
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
              .map(item => (<NoteView
                {...item}
                onCheck={this.onItemCheck}
                onItemEdit={this.onItemEdit}
                onItemView={this.onItemView}/>))}
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

const EditItemScreen = ({navigation}) => (
  <Container>
    <Header>
      <Body>
        <Title>ID: {navigation.getParam('id')}</Title>
      </Body>
    </Header>
    <Content>
      <Text style={styles.noteText}>TBD</Text>
    </Content>
  </Container>
)

EditItemScreen.navigationOptions = ({navigation}) => ({title: 'Edit note'})

const ItemScreen = ({navigation}) => (
  <Container>
    <Header>
      <Left>
        <Title>ID: {navigation.getParam('id')}</Title>
      </Left>
      <Right>
        <Title>
          {navigation.getParam('isDone')
            ? '[done]'
            : '[undone]'}
        </Title>
      </Right>
    </Header>
    <Content>
      <Text style={styles.noteText}>{navigation.getParam('txt')}</Text>
    </Content>
  </Container>
)

ItemScreen.navigationOptions = () => ({title: `Note details`})

const Navigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  EditItem: {
    screen: EditItemScreen
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
  },
  checkedCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40
  },
  textCol: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row'
  },
  buttonCol: {
    width: 80
  },
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  noteText: {
    padding: 20
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
