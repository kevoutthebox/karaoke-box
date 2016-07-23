var React = require('react');

var Enter = React.createClass({
	enter() {
		// using this.refs.name.value did not work
		// fell back to findDOMNode method
		var singerName = React.findDOMNode(this.refs.name).value;
		this.props.emit('enter', {name : singerName});
	},

	render() {
		// javascript void to prevent posting to
		// server because we want to communicate via sockets
		return (
			<form action="javascript:void(0)" onSubmit={this.enter}>

				<label> Full Name </label>
				<input ref="name" className="form-control"
							placeholder="enter your name"
							required />
				<button className="btn btn-primary">Enter</button>
			</form>
		)
	}
})

module.exports = Enter;