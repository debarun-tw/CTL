var rp = require('request-promise');
var SerialPort = require("serialport").SerialPort;
var sp = require("serialport");
var PROP = require('../properties.js');
var ERROR = 'error';
var OPEN = 'open';
var DATA = 'data';
var SUCCESS = 'success';
var FAILURE = 'failure';
var crypto = require('crypto');

var serialPort = new SerialPort(PROP.usbPort, {
       baudrate: 9600
});

serialPort.on(ERROR, function(err) {
	console.log("Error opening serial port ", err);
});

serialPort.on(OPEN, function () {
  console.log("!!! Serial port opened !!! ");

  var serialData = "";
  serialPort.on(DATA, function(data) {

    serialData = serialData + data;
    if(serialData.indexOf("*") > 1) {

       var internalNumber = extractInternalNumber(serialData);
       serialData = "";
       getUserAndPostOrder(internalNumber);
    }
  });
});


var getUserAndPostOrder = function(internalNumber) {

    var bKey = new Buffer('abcd1234', 'utf-8');

    var bInput = new Buffer('admin:123abc123', 'utf-8');

    var cipher = crypto.createCipher('AES-128-ECB',bKey);

    var crypted = cipher.update(bInput,null,'base64');

    crypted+=cipher.final('base64');

    console.log("getUserAndPostOrder", internalNumber);

    var url =  PROP.server_url + '/api/users/internalNumber/' + internalNumber;
    var postOrderUrl = PROP.server_url + '/api/orders';
    var getOptions = { uri: url, headers: {'User-Agent': 'Request-Promise', 'Authorization': crypted}};
    rp(getOptions)
        .then(function (response) {
            console.log("res", response);
            var user = JSON.parse(response)
            var requestBody = {drinks: [{name: "CTL", quantity: 1}],
                               isSwipe: 'true',
                               employeeId: user.empId,
                               employeeName: user.employeeName};

            var postOptions = {
                            method: 'POST',
                            uri: postOrderUrl,
                            body: requestBody,
                            json: true,
                            headers: {'Authorization': crypted}
            };

            rp(postOptions).then(function(response) {
                 serialPort.write(SUCCESS, function(err, results) {
                     console.log('results ' + results);
                 });
            })
        })

        .catch(function (err) {
            serialPort.write(FAILURE, function(err, results) {
                   console.log('err ' + err);
                   console.log('results ' + results);
            });
    });
}


var extractInternalNumber = function(serialData) {
    var cardDecimalNumber = parseInt(serialData.substring(serialData.indexOf("$") + 1, serialData.indexOf("*")));
    var cardBinaryNumber = cardDecimalNumber.toString(2);

    var startIndex =  cardBinaryNumber.length -17;
    if (startIndex < 0) {
       startIndex = 0;
    }
    var cardInternalNumber = cardBinaryNumber.substring(cardBinaryNumber.length -17 , cardBinaryNumber.length -1)
    return parseInt(cardInternalNumber, 2)

}