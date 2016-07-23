var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;

var APP = require('./components/APP');
var login = require('./components/login');
var karaokeRoom = require('./components/karaokeRoom');
var terriblesinger404 = require('./components/terriblesinger404');



var routes = (
	<Route handler={APP}>
		<DefaultRoute handler={karaokeRoom} />
		<Route name="login" path="login" handler={login}></Route>
		<NotFoundRoute handler = {terriblesinger404} />
	</Route>
);

// When run routes, callback gets appropriate routes, which represents
// DOM at top level
Router.run(routes, function(Handler) {
	React.render(<Handler />, document.getElementById('react-container'));
});
