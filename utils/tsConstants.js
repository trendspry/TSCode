/**
 * Created with IntelliJ IDEA.
 * User: Rahul
 * Date: 10/3/14
 * Time: 7:59 PM
 * To change this template use File | Settings | File Templates.
 */
var request_json = require('request-json');
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

module.exports = {
	API_KEY: apiKey,
	PASSWORD: password,
	BASE_URL: baseUrl,
	HTTPS: https,
	PASS_KEY: passKey,
	POST_HOST: postHost,
	PAGE: page,
	LIMIT: limit,
	AMP: amp
};



