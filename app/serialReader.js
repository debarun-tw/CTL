var rp = require('request-promise');
var SerialPort = require("serialport").SerialPort;


var serialport = new SerialPort("/dev/tty.usbmodem1411", {
       baudrate: 9600,
       parser: require("serialport").parsers.readline("\n")
});


serialport.on("error", function(err) {
	console.log("Error opening serial port ", err);
});

serialport.on('open', function(){
	console.log('Serial Port Opened');
	serialport.on('data', function(data){
	       var internalNumber =  extractInternalNumber(data);
	       getUserAndPostOrder(internalNumber);
    });
});


var getUserAndPostOrder = function(internalNumber) {
    var url =  'http://localhost:8083/api/users/internalNumber/' + internalNumber;
    var getOptions = { uri: url, headers: {'User-Agent': 'Request-Promise'}};
    rp(getOptions)
        .then(function (response) {
            var user = JSON.parse(response)
            var requestBody = {drinks: [{name: "CTL", quantity: 7}],
                               isSwipe: 'true',
                               employeeId: user.employeeId,
                               employeeName: user.employeeName};

            var postOptions = {
                method: 'POST',
                uri: 'http://localhost:8083/api/orders',
                body: requestBody,
                json: true
            };

            rp(postOptions).then(function(response) {
                                        console.log(response);

                 serialport.write("success", function(err, results) {
                     console.log('err ' + err);
                     console.log('results ' + results);
                 });
            })
        })

        .catch(function (err) {
            console.log(err);
            serialport.write("failure", function(err, results) {
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