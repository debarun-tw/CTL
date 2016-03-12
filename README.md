Connecting Raspberry Pi to Arduino


To know which port of the raspberry, Arduino is connected, add this code in server.js, which will log the neccesary details

require("serialport").list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.manufacturer);
  });
});




