var AWS = require('aws-sdk');
var request = require ("request");


//The URL you get from SLACK for the webhook
//Production URL
//var urlWebHook = "https://hooks.slack.com/services/T03115JSJTE/B3SsRE54SLA/dv6Vafsddfsfbjy7sjL5MJSd";

//TEST URL
var urlWebHook = "https://hooks.slack.com/services/T0311dJJTE/B4MJYGSDBULB/Mu08udkVTafsddsfaOamB7ta5mY5Y4qp";


exports.handler = (event, context, callback) => {
    // TODO implement
    
    
    var iot = new AWS.Iot();
    
    var params = {
         thingName: 'iotbutton_'+event.serialNumber
        };
        
        
    iot.describeThing(params, function(err, data) {
         if (err){
            console.log(err, err.stack); // an error occurred 
         } 
         else {  
             
             if(data.thingTypeName == 'outageButton'){
                 
                  if(event.clickType == 'SINGLE'){
                         sendToSlack("<!here> Coffee is out in the "+ data.attributes["roomLongDescription"]+" (Room "+data.attributes["roomNumber"]+")");
                   }
            
                  if(event.clickType == 'DOUBLE'){
                        sendToSlack("<!here> Fresh DeCaf Coffee in the "+ data.attributes["roomLongDescription"]+" (Room "+data.attributes["roomNumber"]+")");
                     }
                     
                   if(event.clickType == 'LONG'){
                        sendToSlack("<!here> Fresh Black Coffee in the "+ data.attributes["roomLongDescription"]+" (Room "+data.attributes["roomNumber"]+")");
                     }
             }
         } 
         
  
  
  function sendToSlack (s, theUsername, theIconUrl, theIconEmoji, theChannel) {
    	var payload = {
    		text: s
    		};
    	if (theUsername !== undefined) {
    		payload.username = theUsername;
    		}
    	if (theIconUrl !== undefined) {
    		payload.icon_url = theIconUrl;
    		}
    	if (theIconEmoji !== undefined) {
    		payload.icon_emoji = theIconEmoji;
    		}
    	if (theChannel !== undefined) {
    		payload.channel = theChannel;
    		}
    	var theRequest = {
    		url: urlWebHook,
    		method: "POST",
    		json: payload
    		};
    	request (theRequest, function (error, response, body) {
    		if (!error && (response.statusCode == 200)) {
    			console.log ("sendToSlack: " + s);
    			}
    		else {
    			console.log ("sendToSlack: error, code == " + response.statusCode + ", " + response.body + ".\n");
    			}
		});
}
  
});
    
    callback(null, 'Hello from Lambda.');
    
};