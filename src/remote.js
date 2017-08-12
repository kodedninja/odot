const axios = require('axios');
const colors = require('colors');

var remote = {};

remote.push = function(data) {
	if (!checkRemote(data)) return null;

	var secret = data.remote.secret;
	console.log(secret)
}

remote.pull = function(data, cb) {
	if (!checkRemote(data)) return null;

	var secret = data.remote.secret;
	axios.get('http://localhost:8080/api/l/' + secret).then(cb).catch(function(err) {
		console.log(colors.red(err));
	})
}

function checkRemote(data) {
	if (!data.remote || !data.remote.secret) {
		console.log(colors.red("The list is not connected to any remotes. Try odot c <secret> "));
		return false;
	}
	return true;
}

module.exports = remote;
