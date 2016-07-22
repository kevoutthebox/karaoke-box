import React, { Component } from 'react'
import Users from './users'
var io = require('socket.io-client');

var APP = React.createClass({

    getInitialState() {
        return {
          users: [{name:'binh'},{name:'blake'},{name:'kevin'},{name:'zhiwen'}]
        }
    },

    componentWillMount() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.connect);
    },

    connect() {
        console.log("Connected: " +  this.socket.id);
    },

    render() {
        return (<div className = 'MainComponent'>
                  hello
                  <Users singers={this.state.users}/>
                </div>


      );
    }

});

module.exports = APP;
