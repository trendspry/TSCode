/**
 * Created with IntelliJ IDEA.
 * User: Rahul
 * Date: 10/3/14
 * Time: 7:59 PM
 * To change this template use File | Settings | File Templates.
 */
var courierConstants = require("./courierConstants.js");
var tsConstants = require("../tsConstants.js");


module.exports = {

	getCODCourierForZip: function (zip, payment_method) {
		var courierTag = '';
		console.log("courier tag ----------------------------> " + courierTag);
		if (payment_method == tsConstants.COD) {
			if (courierConstants.COD_DELHIVERY.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.COD_TAGS_PRIORITY[0];
			/*} else if (courierConstants.COD_BLUEDART.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.COD_TAGS_PRIORITY[1];*/
			} else if (courierConstants.COD_FEDEX.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.COD_TAGS_PRIORITY[2];
			} else if (courierConstants.COD_FIRSTFLIGHT.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.COD_TAGS_PRIORITY[3];
			} else if (courierConstants.COD_DTDC.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.COD_TAGS_PRIORITY[4];
			} else {
				courierTag = courierConstants.COD_NA;
			}
		}
		console.log("courier tag is ---------> " + courierTag);
		return courierTag;
	},

	getPrepaidCourierZip: function (zip, payment_method) {
		var courierTag = '';
		if (payment_method == tsConstants.PREPAID) {
			if (courierConstants.PREPAID_DELHIVERY.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.PREPAID_TAGS_PRIORITY[0];
			/*} else if (courierConstants.PREPAID_BLUEDART.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.PREPAID_TAGS_PRIORITY[1];*/
			} else if (courierConstants.PREPAID_FEDEX.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.PREPAID_TAGS_PRIORITY[2];
			} else if (courierConstants.PREPAID_FIRSTFLIGHT.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.PREPAID_TAGS_PRIORITY[3];
			} else if (courierConstants.PREPAID_DTDC.indexOf(zip.trim()) != -1) {
				courierTag = courierConstants.PREPAID_TAGS_PRIORITY[4];
			} else {
				courierTag = courierConstants.COURIER_SERVICE_NA;
			}
		}
		return courierTag;
	}


}
;



