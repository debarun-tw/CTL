Connecting Raspberry Pi to Arduino


To know which port of the raspberry, Arduino is connected, add this code in server.js, which will log the neccesary details

require("serialport").list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.manufacturer);
  });
});



 Reference  script for running the app on boot
 Not using this because of issues
 sudo crontab -e
 @reboot sh /home/pi/Documenets/CTL/appLauncher.sh > /home/pi/Documents/CTL_Logs/cronlog 2>&1
 http://www.instructables.com/id/Raspberry-Pi-Launch-Python-script-on-startup/?ALLSTEPS

 Using forever-service
 Steps:
 sudo forever-service install kanjuice --script app/server.js
 sudo service kanjuice start
 https://github.com/zapty/forever-service
 sudo forever list