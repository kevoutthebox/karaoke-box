var React = require('react');
var Header = React.createClass({

	propTypes: {
		// Need this prop and as string or else error
		title: React.PropTypes.string.isRequired
	},

	getDefaultProps() {
		return {
			status: 'Disconnected'
		}
	},

	render() {
		return (
			<header>
				<h1>{this.props.title}</h1>
			</header>
		);
	}
});

module.exports = Header;