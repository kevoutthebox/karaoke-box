//Stretch goal is to incorporate this angular-like ng-show directive.
var React = require('react');

var Toggle = React.createClass({
	render() {
		// if the 'if' is true, then display all children nodes
		return (this.props.if) ? <div className='login-container'>{this.props.children}</div> : null;
	}
})

module.exports = Toggle;