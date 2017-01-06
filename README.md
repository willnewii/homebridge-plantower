# homebridge-plantower

Homebridge plugin for plantower sensors

Based on [node-plantower](https://github.com/perfectworks/node-plantower)

[![npm version](https://badge.fury.io/js/homebridge-smartthings.svg)](https://badge.fury.io/js/homebridge-smartthings)
Current version - 0.0.1

## Installation

### Homebridge Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-plantower
3. Update your configuration file. See sample config.json snippet below.

### Config.json example

    "accessories": [
        {
            "accessory": "plantower",
            "name": "PM2.5",
            "model":"PMS5003ST",
            "device":"/dev/ttyAMA0"
        }
    ]

    - model: device model eg: PMS5003/PMS3003
    - device: serial port eg: '/dev/ttyAMAO'
