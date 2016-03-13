 ###### Connecting Raspberry Pi to Arduino

![alt tag](https://raw.githubusercontent.com/tw-blr-iot-ants/CTL/master/circuit_connections.jpeg)

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
Once the Usb  port is identified, replace the usbPort in properties.js file

#### Starting the node app using forever on raspberry boot runner

we can use either cron or starting the node app as service on boot. We preferred starting app as service 
 
##### Using cron
###### Steps:
 
 ```
 sudo crontab -e
 
 @reboot sh /home/pi/Documents/CTL/appLauncher.sh > path/for/Logs/cron_logs 2>&1
```
Use this link as reference - [Inscrutable Reference] (http://www.instructables.com/id/Raspberry-Pi-Launch-Python-script-on-startup/?ALLSTEPS)

##### Using forever-service
###### Steps:
 
 ```
 sudo forever-service install kanjuice --script app/server.js
 sudo service kanjuice start
 https://github.com/zapty/forever-service
 sudo forever list
 ````
 
 
 TechStack:
 
 * Arduino
 * Raspberry
 * RFID
 * Nodejs
 