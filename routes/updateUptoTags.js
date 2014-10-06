var express = require('express');
var request_json = require('request-json');
var request = require("request");
var router = express.Router();

//Stag variables

//var apiKey = '3a61d090139b47e036020ac61c80b8e2';
//var password = 'deb4069f2ffd14a1d0185b60de155e93';
//var baseUrl = 'trendspry-2.myshopify.com';

//Prod variables
var apiKey = '6789fc800976ac6b8cf1b9db5106d49e';
var password = '16f899a111d98b3d4a584aac96549597';
var baseUrl = 'trendspry.myshopify.com';



var passKey = apiKey + ':' + password;
var HTTPS = "https://";
var postHost = HTTPS + passKey + '@' + baseUrl;
var PAGE = "page=";
var AMP = "&";
var LIMIT = 20;
var LIMIT_EXPRESSION = "limit=" + LIMIT + AMP;
var pageNum;
var uptoTags = ['Upto10', 'Upto20', 'Upto30', 'Upto40', 'Upto50', 'Upto60', 'Upto70', 'Upto80', 'Upto90'];


/* GET UpdateDiscounts. */
router.get('/', function (req, res) {
	pageNum = 1;
	var url = HTTPS + passKey + "@" + baseUrl + "/admin/products.json?" + LIMIT_EXPRESSION + PAGE + pageNum;
	//var url = HTTPS + passKey + "@" + baseUrl + "/admin/products/340474147.json";
	reqeustForUrl(url);

	var fullname = "rahul agarwal";
	res.render('helloworld', { title: fullname })

});

function printAtConsole(comment, data) {
	console.log(comment + "::" + JSON.stringify(data));
}


function reqeustForUrl(url) {

	sleep(2000);
	console.log("about to hit thte url:" + url);
	var continueParsing;
	request({
		url: url,
		json: true
	}, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			continueParsing = parseResponseForDiscount(body);
			// Uncomment the below to let is work in a loop
			if (continueParsing) {
				pageNum++;
				nextUrl = HTTPS + passKey + "@" + baseUrl + "/admin/products.json?" + LIMIT_EXPRESSION + PAGE + pageNum;
				console.log("next url " + nextUrl);
				reqeustForUrl(nextUrl);
			}

			//console.log("continue parsing in func " + continueParsing);
		}
		else {
			console.log('ERROR====>' + JSON.stringify(error) );
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
	var discTag = '';
	var createDiscMetaString = '';
	var productTitle = '';
	var productsFound = productsJson.products.length;


	if (productsFound > 0) {


		printAtConsole("products found", productsFound);
		//for (i = 0; i < 2; i++) {
		for (i = 0; i < productsFound; i++) {
			console.log("i=------------------->" + i);
			var tags;
			var updatedTags = [''];

			//for (i = 0; i < productsFound; i++) {
			console.log("req no::::::::: " + (LIMIT * (pageNum - 1) + i))
			productId = productsJson.products[i].id;
			console.log("pid::::" + productId);
			productTitle = productsJson.products[i].title;
			compare_at_price = productsJson.products[i].variants[0].compare_at_price;
			price = productsJson.products[i].variants[0].price;
			tags = productsJson.products[i].tags;

			//Calculate Discount
			if (compare_at_price > 0 && price > 0 && compare_at_price >= price) {
				discount = (compare_at_price - price) * 100 / compare_at_price;
			}

			discTag = getAppropriateTag(discount);

			//Create Tags excluding DiscountTag
			updatedTags = getUpdatedTags(tags, discTag);
			console.log("for product:" + productId + ":" + productTitle + " updatedTags:" + updatedTags.toString());

			// Json to update tags
			updateTagsJson = { product: {
				id: productId,
				tags: updatedTags.toString()
			}};

			//Put for tag
			var putTagUrl = '/admin/products/' + productId + '.json';
			//console.log(postHost + putTagUrl);

			putDataToShopify(postHost, putTagUrl, updateTagsJson);


		}

		return true;
	}   else {
	return false;
	}
}

function postDataToShopify(postHost, postUrl, postData) {

	var client = request_json.newClient(postHost);
	sleep(400);
	console.log("posting -->" + JSON.stringify(postData) + " URL:" + postUrl);
	client.post(postUrl, postData, function (err, res, body) {
		return console.log("======post========> " + res.statusCode /*+ JSON.stringify(body)*/);
	});

}

function putDataToShopify(postHost, postUrl, postData) {

	var client = request_json.newClient(postHost);
	sleep(400);

	client.put(postUrl, postData, function (err, res, body) {
		return console.log(JSON.stringify(err) +  "======put========> " + res.statusCode /*+ JSON.stringify(body)*/);
	});

}

function getUpdatedTags(tags, discTag) {
	var updatedTags = [''];
	var tagsStr = tags.split(",");
	var tagLength = tagsStr.length;
	var x = 0;
	for (j = 0; j < tagLength; j++) {
		//console.log("tagsStr:" + tagsStr[i] + " indexof:" + discountTags.indexOf(tagsStr[i].trim()));
		if (uptoTags.indexOf(tagsStr[j].trim()) > -1) {
			console.log("not found");
		} else {
			updatedTags[x] = tagsStr[j].trim();
			x++;
		}
	}
	updatedTags[x] = discTag;
	return updatedTags;
}


function getAppropriateTag(discount) {
	var discTag = '';
	if (discount >= 90) {
		discTag = uptoTags[9];
	} else if (discount >= 80 && discount <= 90) {
		discTag = uptoTags[8];
	} else if (discount >= 70 && discount <= 80) {
		discTag = uptoTags[7];
	} else if (discount >= 60 && discount <= 70) {
		discTag = uptoTags[6];
	} else if (discount >= 50 && discount <= 60) {
		discTag = uptoTags[5];
	} else if (discount >= 40 && discount <= 50) {
		discTag = uptoTags[4];
	} else if (discount >= 30 && discount <= 40) {
		discTag = uptoTags[3];
	} else if (discount >= 20 && discount <= 30) {
		discTag = uptoTags[2];
	} else if (discount >= 10 && discount <= 20) {
		discTag = uptoTags[1];
	} else if (discount > 0 && discount < 10) {
		discTag = uptoTags[0];
	}
	return discTag;
}

function sleep(miliseconds) {
	var currentTime = new Date().getTime();

	while (currentTime + miliseconds >= new Date().getTime()) {
	}
}

module.exports = router;
