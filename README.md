 ###### Connecting Raspberry Pi to Arduino

![alt tag](https://raw.githubusercontent.com/username/projectname/branch/p

##### USb port detection

To know which port of the raspberry, Arduino is connected, add this code in server.js, which will log the necessary details

```javascript

require("serialport").list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.manufacturer);
  });
});

```
Once the port number is identified, replace the usbPort in properties.js file

#### Start app on raspberry boot runner

 Not using this
 sudo crontab -e
 @reboot sh /home/pi/Documenets/CTL/appLauncher.sh > /home/pi/Documents/CTL_Logs/cronlog 2>&1
 http://www.instructables.com/id/Raspberry-Pi-Launch-Python-script-on-startup/?ALLSTEPS

##### Using forever-service
 
###### Steps:
 
 ```
 sudo forever-service install kanjuice --script app/server.js
 sudo service kanjuice start
 https://github.com/zapty/forever-service
 sudo forever list
 ````