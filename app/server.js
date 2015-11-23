var rp = require('request-promise');
var SerialPort = require("serialport").SerialPort;
var sp = require("serialport");

var serialPort = new SerialPort("/dev/tty.usbmodem1411", {
       baudrate: 9600
});


serialPort.on("error", function(err) {
	console.log("Error opening serial port ", err);
});


serialPort.on("open", function () {
  console.log("!!! Serial port opened !!! ");

  var serialData = "";
  serialPort.on("data", function(data) {

    serialData = serialData + data;
    if(serialData.indexOf("*") > 1) {

       var internalNumber = extractInternalNumber(serialData);
       serialData = "";
       getUserAndPostOrder(internalNumber);
    }
  });
});


var getUserAndPostOrder = function(internalNumber) {
    console.log("getUserAndPostOrder", internalNumber);
    var url =  'http://10.132.127.212:8083/api/users/internalNumber/' + internalNumber;
    var getOptions = { uri: url, headers: {'User-Agent': 'Request-Promise'}};
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
                            uri: 'http://10.132.127.212:8083/api/orders',
                            body: requestBody,
                            json: true
            };

            rp(postOptions).then(function(response) {
                 serialPort.write("success", function(err, results) {
                     console.log('err ' + err);
                     console.log('results ' + results);
                 });
            })
        })

        .catch(function (err) {
            serialPort.write("failure", function(err, results) {
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