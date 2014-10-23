/**
 * Created with IntelliJ IDEA.
 * User: Rahul
 * Date: 10/3/14
 * Time: 7:59 PM
 * To change this template use File | Settings | File Templates.
 */
var courierConstants = require("./courierConstants.js");



module.exports = {

	getAppropriateCodForZip: function (zip) {
		var codCourierTag = '';
		if (courierConstants.COD_DELHIVERY.indexOf(zip.trim()) != -1) {
			codCourierTag = courierConstants.COD_TAGS_PRIORITY[0];
		} else if (courierConstants.COD_BLUEDART.indexOf(zip.trim()) != -1) {
			codCourierTag = courierConstants.COD_TAGS_PRIORITY[1];
		} else if (courierConstants.COD_FEDEX.indexOf(zip.trim()) != -1) {
			codCourierTag = courierConstants.COD_TAGS_PRIORITY[2];
		} else if (courierConstants.COD_FIRSTFLIGHT.indexOf(zip.trim()) != -1) {
			codCourierTag = courierConstants.COD_TAGS_PRIORITY[3];
		} else if (courierConstants.COD_DTDC.indexOf(zip.trim()) != -1) {
			codCourierTag = courierConstants.COD_TAGS_PRIORITY[4];
		} else {
			codCourierTag = courierConstants.COD_NA;
		}
		return codCourierTag;
	}

};



