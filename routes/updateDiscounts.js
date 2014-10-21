var express = require('express');
var request = require("request");
var router = express.Router();
var logger = require("../utils/logger.js");
var stringUtils = require("../utils/stringUtils.js");
var tsReqRes = require("../utils/tsReqRes.js");
var tsConstants = require("../utils/tsConstants.js");
var PropertiesReader = require("properties-reader");
var properties = PropertiesReader("./properties/store.properties");


var pageNum = 1;
var limitNum = 1;
var LIMIT_EXPRESSION = tsConstants.LIMIT + limitNum + tsConstants.AMP;

var discountTags = ['Dis_0-10', 'Dis_10-20', 'Dis_20-30', 'Dis_30-40',
	'Dis_40-50', 'Dis_50-60', 'Dis_60-70', 'Dis_70-80', 'Dis_80-90', 'Dis_90-100'];


/* GET UpdateDiscounts. */
router.get('/', function (req, res) {
	pageNum = 1;
	logger.info("hello");
	var url = tsConstants.HTTPS + tsConstants.PASS_KEY + "@" + tsConstants.BASE_URL + "/admin/products.json?" + LIMIT_EXPRESSION + tsConstants.PAGE + pageNum;
	var prdCount = req.param("prdCount");
	logger.info("prdCount->" + prdCount);
	if (prdCount > 0) {
		pageNum = prdCount
	}
	//var url = tsConstants.HTTPS + tsConstants.PASS_KEY + "@" + tsConstants.BASE_URL + "/admin/products/340474147.json";
	reqeustForUrl(url);

	var fullname = "rahul agarwal";
	res.render('helloworld', { title: fullname })

});

function printAtConsole(comment, data) {
	console.log(comment + "::" + JSON.stringify(data));
}


function reqeustForUrl(url) {

	//sleep(1000);
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
				nextUrl = tsConstants.HTTPS + tsConstants.PASS_KEY + "@" + tsConstants.BASE_URL + "/admin/products.json?" + LIMIT_EXPRESSION + tsConstants.PAGE + pageNum;
				console.log("next url " + nextUrl);
				reqeustForUrl(nextUrl);
			}

			//console.log("continue parsing in func " + continueParsing);
		}
		else {
			console.log('ERROR====>' + JSON.stringify(error));
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
			console.log("req no::::::::: " + (limitNum * (pageNum - 1) + i))
			productId = productsJson.products[i].id;
			console.log("pid::::" + productId);
			productTitle = productsJson.products[i].title;
			compare_at_price = parseFloat(productsJson.products[i].variants[0].compare_at_price);
			price = parseFloat(productsJson.products[i].variants[0].price);
			tags = productsJson.products[i].tags;

			//Calculate Discount

			if (compare_at_price > 0 && price > 0 && compare_at_price >= price) {
				discount = (compare_at_price - price) * 100 / compare_at_price;
			}
			//console.log("compare_at_price=" + compare_at_price + " price=" + price + " discount=" + discount);
			// Json to create metadata field discount
			createDiscMeta = { metafield: {
				namespace: 'product',
				key: 'discount',
				value: discount.toFixed(2),
				value_type: 'string'
			}};

			var postMetafieldUrl = '/admin/products/' + productId + '/metafields.json';

			console.log("going to post discount field for " + productTitle + " dis " + discount.toFixed(2));


			//console.log("metafiled url:" + postMetafieldUrl);
			tsReqRes.postDataToShopify(tsConstants.POST_HOST, postMetafieldUrl, createDiscMeta);


			discTag = getAppropriateTag(discount);
			console.log("for product:" + productId + ":" + productTitle + " disTag:" + discTag + " discount:" + discount);

			//sleep(200);

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


			tsReqRes.putDataToShopify(tsConstants.POST_HOST, putTagUrl, updateTagsJson);


		}

		return true;
	} else {
		return false;
	}
}


function getUpdatedTags(tags, discTag) {
	var updatedTags = [''];
	var tagsStr = tags.split(",");
	var tagLength = tagsStr.length;
	var x = 0;
	for (j = 0; j < tagLength; j++) {
		//console.log("tagsStr:" + tagsStr[i] + " indexof:" + discountTags.indexOf(tagsStr[i].trim()));
		if (discountTags.indexOf(stringUtils.capitaliseFirstLetter(tagsStr[j].trim())) > -1) {
			console.log("not found");
		} else {
			updatedTags[x] = tagsStr[j].trim();
			x++;
		}
	}
	updatedTags[x] = discTag.toLowerCase();
	return updatedTags;
}


function getAppropriateTag(discount) {
	var discTag = '';
	if (discount >= 90) {
		discTag = discountTags[9];
	} else if (discount >= 80 && discount <= 90) {
		discTag = discountTags[8];
	} else if (discount >= 70 && discount <= 80) {
		discTag = discountTags[7];
	} else if (discount >= 60 && discount <= 70) {
		discTag = discountTags[6];
	} else if (discount >= 50 && discount <= 60) {
		discTag = discountTags[5];
	} else if (discount >= 40 && discount <= 50) {
		discTag = discountTags[4];
	} else if (discount >= 30 && discount <= 40) {
		discTag = discountTags[3];
	} else if (discount >= 20 && discount <= 30) {
		discTag = discountTags[2];
	} else if (discount >= 10 && discount <= 20) {
		discTag = discountTags[1];
	} else if (discount > 0 && discount < 10) {
		discTag = discountTags[0];
	}
	return discTag;
}

function sleep(miliseconds) {
	var currentTime = new Date().getTime();

	while (currentTime + miliseconds >= new Date().getTime()) {
	}
}


module.exports = router;
