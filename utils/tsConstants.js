/**
 * Created with IntelliJ IDEA.
 * User: Rahul
 * Date: 10/3/14
 * Time: 7:59 PM
 * To change this template use File | Settings | File Templates.
 */
var PropertiesReader = require("properties-reader");
var properties = PropertiesReader("./properties/store.properties");


const apiKey = properties.get('store.apiKey');
const password = properties.get('store.password');
const baseUrl = properties.get('store.baseUrl');
const https = "https://";
const passKey = apiKey + ':' + password;
const postHost = https + passKey + '@' + baseUrl;
const page = "page=";
const limit = "limit=";
const amp = "&";
const cod = "Cash on Delivery (COD)";
const prepaid = "Prepaid";
const fulfillment_status_fulfilled = "fulfilled";
const fulfillment_status_pending = "pending";

module.exports = {
	API_KEY: apiKey,
	PASSWORD: password,
	BASE_URL: baseUrl,
	HTTPS: https,
	PASS_KEY: passKey,
	POST_HOST: postHost,
	PAGE: page,
	LIMIT: limit,
	AMP: amp,
	COD: cod,
	PREPAID: prepaid,
	FULFILLMENT_STATUS_FULFILLED: fulfillment_status_fulfilled,
	FULFILLMENT_STATUS_PENDING: fulfillment_status_pending

};



