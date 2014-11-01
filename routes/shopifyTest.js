var express = require('express');
var request = require("request");
var shopifyObj = require('shopify-node');
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

		var createDiscMeta;
		var options;
		var createDiscMetaString;
		console.log(variantsJson.variants[0].price);
		for (i = 0; i < 1; i++) {
			//for (i = 0; i < variantsFound; i++) {

			variantId = variantsJson.variants[i].id;
			productId = variantsJson.variants[i].product_id;
			compare_at_price = variantsJson.variants[i].compare_at_price;
			price = variantsJson.variants[i].price;
			if (compare_at_price > 0 && price > 0 && compare_at_price >= price) {
				discount = (compare_at_price - price) * 100 / compare_at_price;
				//discount = discount.toFixed(2);
			}

			/*
			 var createDiscMeta = '{"metafield":{' +
			 '"namespace":"product",' +
			 '"key":"discount",' +
			 '"value":"' + discount.toFixed(2) + '",' +
			 '"value_type":"string" }}';
			 */

			// Json to create metadata field discount
			createDiscMeta = { metafield: {
				namespace: 'product',
				key: 'discount',
				value: discount.toFixed(2),
				value_type: 'string'
			}};

			createDiscMetaString = JSON.stringify(createDiscMeta);

			var headers = {
				'Content-Type': 'application/json',
				'Content-Length': createDiscMetaString.length
			};

			options = {
			  host: 'myServer.example.com',
			  port: 80,
			  path: '/user/TheReddest',
			  method: 'POST',
			  headers: headers
			};





			console.log("price:" + price + " compare_at_price:" + compare_at_price
					+ " discount:" + discount.toFixed(2) + " pId:" + productId + " vId:" + variantId);
		}


		return true;
	}
	return false;
}


module.exports = router;
