/**
 * Created with IntelliJ IDEA.
 * User: Rahul
 * Date: 10/3/14
 * Time: 7:59 PM
 * To change this template use File | Settings | File Templates.
 */
var request_json = require('request-json');

module.exports = {
	putDataToShopify: function (postHost, postUrl, postData) {
		var client = request_json.newClient(postHost);

		client.put(postUrl, postData, function (err, res, body) {
			//sleep(400);
			return console.log(JSON.stringify(err) + "====================put========> " + res.statusCode /*+ JSON.stringify(body)*/);
		});

		},
	postDataToShopify: function (postHost, postUrl, postData) {

		var client = request_json.newClient(postHost);

		console.log("posting -->" + JSON.stringify(postData) + " URL:" + postUrl);
		client.post(postUrl, postData, function (err, res, body) {
			//sleep(400);
			return console.log("======post========> " + res.statusCode /*+ JSON.stringify(body)*/);
		});

		// whatever
	},
	foo: function () {

	}
};



