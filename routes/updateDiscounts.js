var express = require('express');
var request_json = require('request-json');
var request = require("request");
var router = express.Router();


var apiKey = '3a61d090139b47e036020ac61c80b8e2';
var password = 'deb4069f2ffd14a1d0185b60de155e93';
var passKey = apiKey + ':' + password;
var baseUrl = 'trendspry-2.myshopify.com';
var HTTPS = "https://";
var postHost = HTTPS + passKey + '@' + baseUrl;
var PAGE = "page="
var pageNum = 1;


/* GET UpdateDiscounts. */
router.get('/', function (req, res) {


	var url = HTTPS + passKey + "@" + baseUrl + "/admin/products.json?" + PAGE + pageNum;
	console.log(url)
	reqeustForUrl(url);


	var fullname = "rahul agarwal";

	res.render('helloworld', { title: fullname })
});

function printAtConsole(body) {
	console.log(body);
}


function reqeustForUrl(url) {

	var continueParsing;
	request({
		url: url,
		json: true
	}, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			continueParsing = parseResponseForDiscount(body);
			// Uncomment the below to let is work in a loop
			if(continueParsing){
			 pageNum++;
			 nextUrl = HTTPS + passKey + "@" + baseUrl + "/admin/products.json?" + PAGE + pageNum;
			 console.log("next url " + nextUrl);
			 reqeustForUrl(nextUrl);
			 }
			console.log("continue parsing in func " + continueParsing);
		}
		else {
			console.log('ERROR');
		}
	})

}

function parseResponseForDiscount(body) {

	var productsJson = body;
	var compare_at_price = 0;
	var price = 0;
	var discount = 0;
	var variantId = '';
	var productId = '';
	//print 'hel';
	var productsFound = productsJson.products.length;


	console.log("productsFound ==> " + productsFound);

	if (productsFound > 0) {

		var options;
		var createDiscMetaString;
		var headers;
		var tags;
		//console.log(productsJson.products[0].price);
		//for (i = 0; i < 4; i++) {
		for (i = 0; i < productsFound; i++) {
			console.log("req no: " + (50*(pageNum-1)+i))
			productId = productsJson.products[i].id;
			compare_at_price = productsJson.products[i].variants[0].compare_at_price;
			price = productsJson.products[i].variants[0].price;
			tags = productsJson.products[i].tags;
			if (compare_at_price > 0 && price > 0 && compare_at_price >= price) {
				discount = (compare_at_price - price) * 100 / compare_at_price;
				//discount = discount.toFixed(2);
			}

			// Json to create metadata field discount
			createDiscMeta = { metafield: {
				namespace: 'product',
				key: 'discount',
				value: discount.toFixed(2),
				value_type: 'string'
			}};

			//createDiscMetaString = JSON.stringify(createDiscMeta);


			var postUrl = '/admin/products/' + productId + '/metafields.json';
			console.log(postHost + postUrl);

			setTimeout(function(){

				postDataToShopify(postHost, postUrl, createDiscMeta);
			    },5000);


			console.log("price:" + price + " compare_at_price:" + compare_at_price
					+ " discount:" + discount.toFixed(2) + " pId:" + productId + " tags:" + tags);
		}


		return true;
	}
	return false;
}

function postDataToShopify(postHost, postUrl, postData) {

	var client = request_json.newClient(postHost);

	client.post(postUrl, postData, function (err, res, body) {
		console.log("inside post function");
		return console.log(res.statusCode + JSON.stringify(body));
	});

}


module.exports = router;
