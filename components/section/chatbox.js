var React = require('react');

var Chatbox = React.createClass({
	sendMessage() {
		var message = React.findDOMNode(this.refs.inputMessage).value;
		this.props.emitMessage('sendMessage', {name: this.props.singer.name, message : message, startConnection: this.props.startConnection});

		// Clears input field on submit
		React.findDOMNode(this.refs.inputMessage).value = '';
	},

	repeatMessage(message, i) {
		return (
			<li className="message" key={i}>{message.name}: {message.message}</li>
		)
	},

	render() {
		return(
			<div className="chatbox">
				<ul className="message-list" id="test">
					{this.props.messageList.map(this.repeatMessage)}
				</ul>
				<form action="javascript:void(0)" onSubmit={this.sendMessage}>
					<input ref="inputMessage" className="form-control"
								placeholder="Enter message"
								required />
					<button className="btn btn-primary">Send</button>
				</form>
			</div>
		)
	}
});

module.exports = Chatbox;
