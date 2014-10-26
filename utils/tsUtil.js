/**
 * Created with IntelliJ IDEA.
 * User: Rahul
 * Date: 10/3/14
 * Time: 7:59 PM
 * To change this template use File | Settings | File Templates.
 */
var request_json = require('request-json');

module.exports = {

	sleep: function (miliseconds) {
		var currentTime = new Date().getTime();

		while (currentTime + miliseconds >= new Date().getTime()) {
		}
	},
	foo: function () {

	}
};



