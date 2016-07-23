var React = require('react');

var Enter = React.createClass({
	enter() {
		// using this.refs.name.value did not work
		// fell back to findDOMNode method
		var singerName = React.findDOMNode(this.refs.name).value;
		this.props.emit('enter', {name : singerName});

		document.querySelector('.no-show').style.display = 'block';
	},

	render() {
		// javascript void to prevent posting to
		// server because we want to communicate via sockets
		return (
			<form className="enter-form" action="javascript:void(0)" onSubmit={this.enter}>
				<input ref="name" className="form-control"
							placeholder="Please enter name"
							required />
				<button className="btn btn-primary">Enter</button>
			</form>
		)
	}
})

module.exports = Enter;