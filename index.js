var osc    = require('node-osc');
var sphero = require('spheron').sphero();
var config = require('./config');

var oscClient = new osc.Client('127.0.0.1', config['osc-send']);
var oscServer = new osc.Server(config['osc-receive'], '0.0.0.0');

sphero.on('open', function() {
    console.log('Connected!');

    // Start streaming sensors
    var mask = 0x000007FE7;
    var rate = 400 / config.rate;
    sphero.setDataStreaming(rate, 1, mask, 0);

});

// Control Sphero from OSC
oscServer.on('message', function (msg, rinfo) {
    // Parse message and send it to Sphero
    sphero.setRGBLED(0, 255, 0, false);
});

sphero.on('packet', function(packet) {
    // Parse data and send it via OSC
    console.log(packet);
    if (packet.ID_CODE === 0x03) {
        console.log({
            x: packet.DATA.readInt16BE(0),
            y: packet.DATA.readInt16BE(2),
            z: packet.DATA.readInt16BE(4),
        });
    }
    oscClient.send('/oscAddress', packet.DATA);
});

// Run!
console.log('Connecting to Sphero...');
sphero.open(config.serialPort);
