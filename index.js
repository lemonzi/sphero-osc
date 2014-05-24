var osc           = require('node-osc');
var spheroFactory = require('node-sphero');
var config        = require('./config');

var oscClient = new osc.Client('127.0.0.1', config['osc-send']);
var oscServer = new osc.Server(config['osc-receive'], '0.0.0.0');

var sphero = new spheroFactory.Sphero();

sphero.on('connected', function(ball) {
    console.log('Done!');

    // Control Sphero from OSC
    oscServer.on('message', function (msg, rinfo) {
        // Parse message and send it to Sphero
        ball.setRGBLED(0, 255, 0, false);
    });

    // Set up the sensor callbacks
    ball.setDataStreaming(
        Object.keys(sphero.sensors),    // Which sensors to read
        config.frameRate,               // Frame rate (def. 400)
        frames || 10,                   // What is this??
        count || 10                     // What is this??
    );

    ball.on('message', function(msg) {
        // Parse data and send it via OSC
        console.log(msg);
        oscClient.send('/oscAddress', msg.DATA);
    });

});

// Run!
console.log('Connecting to Sphero...');
sphero.connect();
