import React, { Component } from 'react'
var io = require('socket.io-client');

var APP = React.createClass({


    componentWillMount() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.connect);
    },

    connect() {
        alert("Connected: " +  this.socket.id);
    },

    render() {
        return (<div className = 'MainComponent'>
hellodoes this work
                </div>


      );
    }

});

module.exports = APP;
