var React = require('react');
var Router = require('react-router');
// This will be the URL route the user has selected
var RouteHandler = Router.RouteHandler;
var io = require('socket.io-client');
var Header = require('./section/title');

var APP = React.createClass({

  getInitialState() {
    return {
      roomTitle: '',
      status: 'Disconnected',
      singer: {},
      singersInRoom: [],
      messageList: [],
      startConnection: ''
    }
  },

  //all incoming data from server will flow through these functions
  componentWillMount() {

    this.socket = io();
    this.socket.on('connect', this.connect);
    this.socket.on('disconnect', this.disconnect);
    this.socket.on('welcome', this.welcome);
    this.socket.on('entered', this.entered);
    this.socket.on('updateSingers', this.updateSingers);
    this.socket.on('updateMessages', this.updateMessages);
  },

  connect() {
    var member = (sessionStorage.singer) ? JSON.parse(sessionStorage.singer) : null;

    console.log(member);
    if (member) {
      this.emit('enter', member);
    }

    this.setState({status: "Connected",
                  startConnection: new Date()});
  },

  //all outgoing data to server will flow through this emit function
  emit(eventName, payload) {
    this.socket.emit(eventName, payload);
  },

  emitMessage(eventName, payload) {
    this.socket.emit(eventName, payload);
  },

  disconnect() {
    this.setState({status: "Disconnected"});
  },

  welcome(serverState) {
    this.setState({roomTitle: serverState.roomTitle});
  },

  entered(singer) {
    // add member node to session storage to save current state
    // until browser closes
    sessionStorage.singer = JSON.stringify(singer);

    this.setState({singer: singer});

    // if user session is still available, display play button
    if (sessionStorage.singer) {
      document.querySelector('.toggle-view').style.display = 'block';
      document.querySelector('.logo-mini').style.display = 'block';
    }
  },

  updateSingers(newSingers) {
    this.setState({singersInRoom: newSingers})
  },

  updateMessages(newMessages) {
    var that = this;
    var messageListDisplay = newMessages.filter(function(msg){
  			return new Date(msg.createdAt) >= that.state.startConnection;
  });

    this.setState({messageList: messageListDisplay});
  },

  render() {
    // 1. spread operator for state passes down ALL state properties
    // 2. Header will never change state
    // 3. RouteHandler represents the component URL (ng-view/directive)
    return (
      <div>
        <Header {...this.state} />
        <RouteHandler emit={this.emit} emitMessage={this.emitMessage} {...this.state} />
      </div>
    );
  }
});

module.exports = APP;
