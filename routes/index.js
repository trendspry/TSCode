var express = require('express');

var request = require("request");
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function (req, res) {

	req = reqeustForUrl("http://localhost:3000/helloworld");

	console.log("does this get printed immediately ie before got repsonse?")
	var test = "rahul";
	console.log(JSON.stringify(req));

	res.render('helloworld', { title: JSON.stringify(req) })

});

function reqeustForUrl(url) {
	console.log("about to hit thte url:" + url);

	var req = request({
		url: url,
		json: true
	})
	return req;
}


module.exports = router;
