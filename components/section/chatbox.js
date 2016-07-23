var React = require('react');

var Chatbox = React.createClass({
	sendMessage() {
		var message = React.findDOMNode(this.refs.inputMessage).value;
		this.props.emitMessage('sendMessage', {name: this.props.singer.name, message : message});

		// Clears input field on submit
		React.findDOMNode(this.refs.inputMessage).value = '';
	},

	repeatMessage(message, i) {
		return (
			<li key={i}>{message.name}: {message.message}</li>
		)
	},

	render() {
		return(
			<div>
				<div>
					<ul>
						{this.props.messageList.map(this.repeatMessage)}
					</ul>
					<form action="javascript:void(0)" onSubmit={this.sendMessage}>
						<input ref="inputMessage" className="form-control"
									placeholder="Enter message"
									required />
						<button className="btn btn-primary">Send</button>
					</form>
				</div>
			</div>
		)
	}
});

module.exports = Chatbox;