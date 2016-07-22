import React, { Component } from 'react'

var Users = React.createClass({
  render () {
    let allUsers = this.props.singers.map(function(singer) {
      return <li>{singer.name}</li>
    })

    return (
      <ul>{allUsers} hello</ul>
    )
  }
})

module.exports = Users
