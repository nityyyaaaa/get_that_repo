import React, { Component } from 'react';

class User extends Component {


	render() {
		const { repos } = this.props
		return (
			<div>
				<h4> User Details </h4 >
				<h4> {props.repos}</h4>
				
			</div>
			)
	}
}

export default User;