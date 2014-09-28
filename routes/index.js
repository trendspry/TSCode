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

	var fullname = obj.employees[1].firstName + " " + text;


	res.render('helloworld', { title: fullname })
});

module.exports = router;
