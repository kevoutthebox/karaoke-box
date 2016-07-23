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
				<img className="logo-mini" src="./images/KBLogoNoWord.png" />
				<img className="logo-text" src="./images/KBLogoType.png" />
			</header>
		);
	}
});

module.exports = Header;