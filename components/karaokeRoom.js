var React = require('react');
var Enter = require('./section/enter');
var Toggle = require('./section/toggle');
var Chatbox = require('./section/chatbox');

var karaokeRoom = React.createClass({
	lessThan4 (){
		if (this.props.singersInRoom.length>0){
			var allowed = this.props.singersInRoom.map((x)=>x.name)
			return allowed.indexOf(this.props.singer.name)<4
		}
		return true;
	},
	render() {
		// if provide singer name, navigate to karaoke room
		// else sign in
		return (
			<div className="toggle-container">

				<Toggle if={this.lessThan4()}>
											<Toggle if={this.props.singer.name}>
												<div className="welcome-message">
													<h1>Hello! {this.props.singer.name}</h1>
													<p>You are singer number {this.props.singersInRoom.length}</p>
													<p>Get your mic ready!</p>
												</div>
												<Chatbox {...this.props}></Chatbox>
											</Toggle>

											<Toggle if={!this.props.singer.name}>
												<img className="logo" src="./images/KBLogoNoWord.png" />
												<Enter emit={this.props.emit}/>
											</Toggle>
					</Toggle>

					<Toggle if={!this.lessThan4()}>
						<div> Sorry too many people </div>
					</Toggle>
			</div>
		)
	}
})

module.exports = karaokeRoom;
