var osc     = require('node-osc');
var spheron = require('spheron');
var config  = require('./config');

var sphero   = spheron.sphero();
var commands = spheron.commands;

var oscClient = new osc.Client('127.0.0.1', config['osc-send']);
var oscServer = new osc.Server(config['osc-receive'], '0.0.0.0');

sphero.on('open', function() {
    console.log('Connected!');

    // Turn off the motors
    sphero.write(commands.api.setStabilisation(false));

    // Start streaming sensors
    var mask = 0x0007FC00;
    var rate = Math.round(400 / config.frameRate);
    sphero.setDataStreaming(rate, 1, mask, 0);

});

// Control Sphero from OSC
oscServer.on('message', function (msg, rinfo) {
    // Parse message and send it to Sphero
    sphero.setRGBLED(0, 255, 0, false);
});

sphero.on('packet', function(packet) {
    // Parse data and send it via OSC
    // console.log(packet);
    if (packet.ID_CODE === 0x03) {
        var data = [
            packet.DATA.readInt16BE(0),
            packet.DATA.readInt16BE(2),
            packet.DATA.readInt16BE(4),
            packet.DATA.readInt16BE(6),
            packet.DATA.readInt16BE(8),
            packet.DATA.readInt16BE(10),
            packet.DATA.readInt16BE(12),
            packet.DATA.readInt16BE(14),
            packet.DATA.readInt16BE(16),
        ];
        console.log(data);
        // oscClient.send('/sphero/1/raw', data);
        oscClient.send('/sphero/1/accel/x',      +(data[0]));
        oscClient.send('/sphero/1/accel/y',      +(data[1]));
        oscClient.send('/sphero/1/accel/z',      +(data[2]));
        oscClient.send('/sphero/1/angles/pitch', +(data[3]));
        oscClient.send('/sphero/1/angles/roll',  +(data[4]));
        oscClient.send('/sphero/1/angles/yaw',   +(data[5]));
        oscClient.send('/sphero/1/gyro/x',       +(data[6]));
        oscClient.send('/sphero/1/gyro/y',       +(data[7]));
        oscClient.send('/sphero/1/gyro/z',       +(data[8]));
    }
});

// Run!
console.log('Connecting to Sphero...');
sphero.open(config.serialPort);
