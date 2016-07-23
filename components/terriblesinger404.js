var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var terriblesinger404 = React.createClass ({
	//this is to handle bad routes. The Link component is an anchor tag
	//in react router and we want to notify user of a valid link
	render() {
		return (
			<div id = "bad-link">
				<h1> Sorry there's no music in karaoke room # 404 </h1>
				<p> Did you mean this room : </p>

				<Link to="/"> Karaoke Room </Link>
			</div>
		);
	}
});

module.exports = terriblesinger404;