
var express = require('express');
var http = require('http');
var request = require("request");
var router = express.Router();


var apiKey = '3a61d090139b47e036020ac61c80b8e2';
var password = 'deb4069f2ffd14a1d0185b60de155e93';
var passKey = apiKey + ':' + password;
var baseUrl = 'trendspry-2.myshopify.com';
var HTTPS = "https://";
var PAGE = "page="
var pageNum = 1;


/* GET UpdateDiscounts. */
router.get('/', function (req, res) {


	var url = HTTPS + passKey + "@" + baseUrl + "/admin/variants.json?" + PAGE + pageNum;
	reqeustForUrl(url);


//	} while (continueParsing)

	var text = '{"employees":[' +
			'{"firstName":"John","lastName":"Doe" },' +
			'{"firstName":"Rahul","lastName":"Smith" },' +
			'{"firstName":"Peter","lastName":"Jones" }]}';

	obj = JSON.parse(text);
	console.log("after json parsing ");
	var fullname = obj.employees[1].firstName + " " + obj.employees[1].lastName;


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
			/*if(continueParsing){
			 pageNum++;
			 nextUrl = HTTPS + passKey + "@" + baseUrl + "/admin/variants.json?" + PAGE + pageNum;
			 console.log("next url " + nextUrl);
			 reqeustForUrl(nextUrl);
			 }*/
			console.log("continue parsing in func " + continueParsing);
		}
		else {
			console.log('ERROR');
		}
	})

}

function parseResponseForDiscount(body) {

	var variantsJson = body;
	var compare_at_price = 0;
	var price = 0;
	var discount = 0;
	var variantId = '';
	var productId = '';
	//print 'hel';
	var variantsFound = variantsJson.variants.length;


	console.log("variantsFound ==> " + variantsFound);

	if (variantsFound > 0) {

		console.log(variantsJson.variants[0].price);
		for (i = 0; i < variantsFound; i++) {

			variantId = variantsJson.variants[i].id;
			productId = variantsJson.variants[i].product_id;
			compare_at_price = variantsJson.variants[i].compare_at_price;
			price = variantsJson.variants[i].price;
			if(compare_at_price > 0 && price > 0 && compare_at_price >= price){
				discount = (compare_at_price - price) * 100 / compare_at_price;
			}

			console.log("price:" + price + " compare_at_price:" + compare_at_price
					+ " discount:" + discount.toFixed(2) + " pId:" + productId + " vId:" + variantId);
		}


		return true;
	}
	return false;
}


module.exports = router;
