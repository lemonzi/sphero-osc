sphero-osc
==========

This is a NodeJS application that connects to one or more Sphero v2.0 balls via Bluetooth and sets up an OSC interface for recieving data from its sensors and sending control commands. 

Usage
-----

- Make sure that you have NodeJS installed.
- Clone the repo and `cd` to it.
- Run `npm install` (only the first time) to fetch the dependencies.
- Run `node indx`.
- Enjoy!

Configuration
-------------

The OSC ports can be specified in the `config.json` file. Defaults are 1042 for sending and 1043 for receiving.
