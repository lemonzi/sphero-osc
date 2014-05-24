var osc           = require('node-osc');
var spheroFactory = require('node-sphero');

var oscClient = new osc.Client('127.0.0.1', 3333);
oscClient.send('/oscAddress', 200);

var oscServer = new osc.Server(3333, '0.0.0.0');
oscServer.on("message", function (msg, rinfo) {
    console.log("TUIO message:");
    console.log(msg);
});

var sphero = new spheroFactory.Sphero();

sphero.on('connected', function(ball) {
    ball.setRGBLED(0, 255, 0, false);
});

sphero.connect();