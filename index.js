var Xray = require("x-ray");
var fs = require("fs");
var AWS = require('aws-sdk');
var sns = new AWS.SNS();
var docClient = new AWS.DynamoDB.DocumentClient();
var config = require("./config.js");

AWS.config.update({
    "region": config.aws.region,
    "accessKeyId": config.aws.accessKeyId,
    "secretAccessKey": config.aws.secretAccessKey
});

var msgOptions = {
    Message: "",
    PhoneNumber: config.phoneNumber,
    Subject: "Test Subj"
};

var x = Xray({
  filters: {
    trimToNumber: function (value) {
      return typeof value === "string" ? parseInt(value) : "?"
    }
  }
});

var readParams = { 
    TableName: config.db.tableName,
    Key: {
        "rating": "rating"
    }
};

exports.handler = (event, context, callback) => {

  docClient.get(readParams, function(err, data) {

    if (err) console.log(JSON.stringify(err, null, 2));
    
    else {

      console.log("Rating value in DynamoDB " + data.Item.ratingValue);

      x(config.usattProfileUrl, config.domSelector)(

        function (err, currentRating) {  

          if(err) { return err; }
          
          if(data.Item.ratingValue != currentRating) {

            msgOptions.Message += "Old Rating: " + data.Item.ratingValue;

            var updateParams = {
              TableName: "ratings",
              Key: {
                  "rating":"rating"
              },
              UpdateExpression: "SET ratingValue = :value",
              ExpressionAttributeValues: { 
                  ":value": currentRating
              },
              ReturnValues: "ALL_NEW"
            };

            docClient.update(updateParams, function(err, data) {

              if (err) console.log(JSON.stringify(err, null, 2));

              msgOptions.Message += " " + " New Rating: " + currentRating + "";
              
              sns.publish(msgOptions, function (err, data) {

                if (err) console.log(err);
                
                else console.log(data);
              });
            }); 
          }      
        }
      );
    }       
  });  
};



