var http = require('http');
var Plantower = require('plantower');
var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
    console.log("homebridge API version: " + homebridge.version);
    // Accessory must be created from PlatformAccessory Constructor
    Accessory = homebridge.platformAccessory;

    // Service and Characteristic are from hap-nodejs
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    // For platform plugin to be considered as dynamic platform plugin,
    // registerPlatform(pluginName, platformName, constructor, dynamic), dynamic must be true
    //homebridge.registerPlatform("homebridge-samplePlatform", "SamplePlatform", SamplePlatform, true);
    homebridge.registerAccessory("homebridge-plantower", "plantower", homebridgePlantower);
}

// Platform constructor
// config may be null
// api may be null if launched from old homebridge version
function homebridgePlantower(log, config, api) {
    log("homebridgePlantower Init");
    var platform = this;
    this.log = log;
    this.config = config;
    this.accessories = [];

    this.name = config['name'];
    this.model = config['model'];
    this.device = config['device'];

    this.humidity = 0;
    this.temperature = 0;
    this.pm2_5 = 0;

    this.humidityService = new Service.HumiditySensor(this.name)
    this.temperatureService = new Service.TemperatureSensor(this.name)
    this.airQualitySensor2_5 = new Service.AirQualitySensor("PM2 5(美标)")

/*    this.humidityService
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on('get', this.getValue.bind(this, 'humidity'))

    this.temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getValue.bind(this, 'temperature'))*/

    this.plantower = new Plantower(this.model, this.device);
    setInterval(() => {
        this.getValue(null, (err, data) => {

            this.humidityService
                .setCharacteristic(Characteristic.CurrentRelativeHumidity, this.humidity)

            this.temperatureService
                .setCharacteristic(Characteristic.CurrentTemperature, this.temperature)

          //  console.log(60, this.airQualitySensor2_5.getCharacteristic(Characteristic.PM2_5Density));

/*            this.airQualitySensor2_5
                .setCharacteristic(Characteristic.AirQuality, 1)*/
            this.log(this.pm2_5)
            var value = parseInt(this.pm2_5/50)

            this.airQualitySensor2_5
                .setCharacteristic(Characteristic.AirQuality, value >=5 ? 5 : value)

        });
    }, 5000);
}

homebridgePlantower.prototype.getValue = function(what, callback) {
    this.plantower.read().then(data => {
        //this.log(data)
        this.humidity = data['humidity'].value;
        this.temperature = data['temperature'].value;
        this.pm2_5 = data['concentration_pm2.5_normal'].value;
        /*        console.log('1', data['concentration_pm2.5_normal']);
                console.log('2', data['concentration_pm2.5_atmos']);
                console.log('3', data['formaldehyde']);
                console.log('4', data['temperature'].value);
                console.log('5', data['humidity'].value);*/
        return callback(null, data)
    }).catch(err => {
        console.error(err);
    });
}

homebridgePlantower.prototype.getServices = function() {
    return [this.humidityService, this.temperatureService, this.airQualitySensor2_5]
}
