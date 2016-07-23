var React = require('react');
var Enter = require('./section/enter');
var Toggle = require('./section/toggle');
var Chatbox = require('./section/chatbox');

var karaokeRoom = React.createClass({
	render() {
		// if provide singer name, navigate to karaoke room
		// else continue sign in
		return (
			<div className="toggle-container">
				<Toggle if={this.props.singer.name}>
					<div className="welcome-message">
						<h1>Hello! {this.props.singer.name}</h1>
						<p>Singer(s) in room: {this.props.singersInRoom.length}</p>
						<p>Get your mic ready!</p>
					</div>
					<Chatbox {...this.props}></Chatbox>
				</Toggle>

				<Toggle if={!this.props.singer.name}>
					<img className="logo" src="./images/KBLogoNoWord.png" />
					<Enter emit={this.props.emit}/>
				</Toggle>
			</div>
		)
	}
})

module.exports = karaokeRoom;