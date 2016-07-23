var React = require('react');
var Enter = require('./section/enter');
var Toggle = require('./section/toggle');
var Chatbox = require('./section/chatbox');

var karaokeRoom = React.createClass({
	render() {
		// if provide singer name, navigate to karaoke room
		// else sign in
		return (
			<div>
				<Toggle if={this.props.singer.name}>
					<h1>Hello {this.props.singer.name}</h1>
					<p>You are singer number {this.props.singersInRoom.length}</p>
					<p>Get your mic ready!</p>
				</Toggle>

				<Toggle if={!this.props.singer.name}>
					<h1>Join the room</h1>
					<Enter emit={this.props.emit}/>
				</Toggle>

				<Chatbox {...this.props}></Chatbox>
			</div>
		)
	}
})

module.exports = karaokeRoom