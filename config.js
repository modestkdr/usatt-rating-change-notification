require('dotenv').config({silent: true});

module.exports = {
	"aws": {
		"region": process.env.MY_AWS_REGION,
	    "accessKeyId": process.env.MY_AWS_ACCESS_KEY_ID,
    	"secretAccessKey": process.env.MY_AWS_SECRET_ACCESS_KEY
	},
	"phoneNumber": process.env.MY_PHONE_NUMBER,
	"db": {
		"tableName": process.env.DB_TABLE_NAME
	},
	"usattProfileUrl": process.env.USATT_PROFILE_URL,
	"domSelector": process.env.DOM_SELECTOR
}