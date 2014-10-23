var express = require('express');
var request = require("request");
var router = express.Router();
var PropertiesReader = require("properties-reader");
var properties = PropertiesReader("./properties/store.properties");

var logger = require("../utils/logger.js");
var stringUtils = require("../utils/stringUtils.js");
var tsReqRes = require("../utils/tsReqRes.js");
var tsConstants = require("../utils/tsConstants.js");

var courierConstants = require("../utils/courier/courierConstants.js");
var courierUtil = require("../utils/courier/courierUtil.js");

var pageNum = 1;
var limitNum = 1;
var dt = "2020-10-23";

var LIMIT_EXPRESSION = tsConstants.LIMIT + limitNum + tsConstants.AMP;


/* GET UpdateDiscounts. */
router.get('/', function (req, res) {
	pageNum = 1;
	logger.info("hello");
	if(req.param("fromDate") === undefined){
		console.log("this is what i got in dateFrom-->" + req.param("fromDate") + " nothing will happen now");
	} else {
		dt = req.param("fromDate");
	}

	var url = tsConstants.HTTPS + tsConstants.PASS_KEY + "@" + tsConstants.BASE_URL
			+ "/admin/orders.json?created_at_min=" + dt + tsConstants.AMP + LIMIT_EXPRESSION + tsConstants.PAGE + pageNum;
	var orderCount = req.param("orderCount");
	logger.info("orderCount->" + orderCount);
	if (orderCount > 0) {
		pageNum = orderCount
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
				nextUrl = tsConstants.HTTPS + tsConstants.PASS_KEY + "@" + tsConstants.BASE_URL + "/admin/orders.json?created_at_min=" + dt + tsConstants.AMP + LIMIT_EXPRESSION + tsConstants.PAGE + pageNum;
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

	var ordersJson = body;
	//ordersJson = {"orders":[{"name":"#1395"},{"name":"#1394"}]};
	var compare_at_price = 0;
	var price = 0;
	var discount = 0;
	var variantId = '';
	var orderId = '';
	var name = '';
	var email = '';
	var gateway = '';
	var fulfillment_status = '';
	var zip = '';
	var createDt = '';
	var codCourierTag = '';
	var createDiscMetaString = '';
	var productTitle = '';
	var ordersFound = ordersJson.orders.length;


	if (ordersFound > 0) {


		printAtConsole("orders found", ordersFound);
		//for (i = 0; i < 2; i++) {
		for (i = 0; i < ordersFound; i++) {
			console.log("i=------------------->" + i);
			var orderTags;
			var updatedTags = [''];

			//for (i = 0; i < ordersFound; i++) {
			console.log("req no::::::::: " + (limitNum * (pageNum - 1) + i))
			orderId = ordersJson.orders[i].id;
			console.log("oid::::" + orderId);
			name = ordersJson.orders[i].name;
			console.log("name:::" + name);
			gateway = ordersJson.orders[i].gateway;
			console.log("gateway::::::" + gateway);
			email = ordersJson.orders[i].email;
			console.log("email::::::" + email);
			logger.info("email:::::" + email);
			fulfillment_status = ordersJson.orders[i].fulfillment_status;
			console.log("fulfillment_status::::::" + fulfillment_status);
			logger.info("fulfillment_status:::::" + fulfillment_status);
			zip = ordersJson.orders[i].shipping_address.zip;
			console.log("zip::::::" + zip);
			logger.info("zip:::::" + zip);
			createDt = ordersJson.orders[i].created_at;
			console.log("createDt::::::" + createDt);
			logger.info("createDt:::::" + createDt);
			orderTags = ordersJson.orders[i].tags;
			console.log("orderTags::::::" + orderTags);
			logger.info("orderTags:::::" + orderTags);



			if (gateway == tsConstants.COD && fulfillment_status != tsConstants.FULFILLMENT_STATUS_FULFILLED) {
				console.log("This is a COD order lets check for fulfilment");
				codCourierTag = courierUtil.getAppropriateCodForZip(zip);
				console.log("codCourierTag:" + codCourierTag);
			}

			//sleep(200);

			//Create Tags excluding DiscountTag
			updatedTags = getUpdatedTags(orderTags, codCourierTag);
			console.log("for order:" + orderId + ":" + name + ":" + email + " updatedTags:" + updatedTags.toString());
			logger.info("for order:" + orderId + ":" + name + ":" + email + " updatedTags:" + updatedTags.toString());
			// Json to update orderTags
			updateTagsJson = { order: {
				id: orderId,
				tags: updatedTags.toString()
			}};

			//Put for tag
			var putTagUrl = '/admin/orders/' + orderId + '.json';

			tsReqRes.putDataToShopify(tsConstants.POST_HOST, putTagUrl, updateTagsJson);

		}

		return true;
	} else {
		return false;
	}
}


function getUpdatedTags(tags, targetTag) {
	var updatedTags = [''];
	var splitTagArray = [];
	if(tags.length > 0){
		splitTagArray = tags.split(",");
	}
	var tagLength = splitTagArray.length;
	var x = 0;
	for (j = 0; j < tagLength; j++) {
		if (courierConstants.COD_TAGS_PRIORITY.indexOf(splitTagArray[j].trim()) > -1 || courierConstants.COD_NA === splitTagArray[j].trim()) {
			console.log("found a tag in existing tags, skipping it");
		} else {
			updatedTags[x] = splitTagArray[j].trim();
			x++;
		}
	}
	updatedTags[x] = targetTag.toLowerCase();
	return updatedTags;
}


function sleep(miliseconds) {
	var currentTime = new Date().getTime();

	while (currentTime + miliseconds >= new Date().getTime()) {
	}
}


module.exports = router;
