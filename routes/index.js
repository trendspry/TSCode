var express = require('express');

var router = express.Router();


/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function (req, res) {



	var text = '{"employees":[' +
			'{"firstName":"John","lastName":"Doe" },' +
			'{"firstName":"Anna","lastName":"Smith" },' +
			'{"firstName":"Peter","lastName":"Jones" }]}';

	obj = JSON.parse(text);

	var categories = [
	            'Jan',
	            'Feb',
	            'Mar',
	            'Apr',
	            'May',
	            'Jun',
	            'Jul',
	            'Aug',
	            'Sep',
	            'Oct',
	            'Nov',
	            'Dec'
	        ];
	var json = JSON.stringify(categories);


	//var fullname = obj.employees[1].firstName + " " + text;

	var test = "rahul";


	sleep(5000, function() {
		res.render('helloworld', { title: test })
		});
});

function reqeustForUrl(url) {
	console.log("about to hit thte url:" + url);
	var continueParsing;
	var req = request({
		url: url,
		json: true
	}, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			console.log("got the response");
		}
		else {
			console.log('ERROR====>' + JSON.stringify(error));
		}
	})
	return req;
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

module.exports = router;
