"use strict";

var React = require("react");

var Home = React.createClass({
	render: function(){
		return (
			<div className="jumbotron">
				<h3>Admin</h3>
				<p>Working with node.</p>	
			</div>
		);
	}
});

module.exports = Home;