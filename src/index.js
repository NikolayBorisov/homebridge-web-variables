import url from 'url';
import Server from './server';
import Storage from './storage';

let Service;
let Characteristic;
let homebridge;

class WebVariables {
  constructor(log, config) {
    const cacheDirectory = config.cacheDirectory || `${homebridge.user.persistPath()}_data`;

    this.log = log;
    this.services = [];
    this.name = config.name;

    this.storage = new Storage({ cacheDirectory });
    this.server = new Server(config, this.callback.bind(this));
  }

  callback(request, response) {
    this.log(`HTTP Request → ${request.url}`);

    const { query, pathname } = url.parse(request.url, true);

    response.writeHead(200, { 'Content-Type': 'application/json' });

    if (pathname === '/get') {
      response.write(JSON.stringify(this.storage.getItems(query)));
    }

    if (pathname === '/set') {
      this.storage.setItems(query);
      response.write(JSON.stringify(query));
    }

    if (pathname === '/del') {
      this.storage.delItems(query);
      response.write(JSON.stringify(query));
    }

    response.end();
  }

  getServices() {
    return this.services;
  }


  WebSensor() {
    if (this.type === 'fan') {
      this.service = new Service.Fanv2(this.name, 'Timer');
      this.Characteristic = {
        Timer: Characteristic.RotationSpeed,
        On: Characteristic.Active,
      };
    } else if (this.type === 'bulb') {
      this.service = new Service.Lightbulb(this.name, 'Timer');
      this.Characteristic = {
        Timer: Characteristic.Brightness,
        On: Characteristic.On,
      };
    }

    this.service.getCharacteristic(this.Characteristic.Timer)
      .on('set', this.setTimer.bind(this));

    this.service.getCharacteristic(this.Characteristic.On)
      .on('set', this.setOn.bind(this));
  }
}


export default function (hb) {
  homebridge = hb;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-web-variables', 'WebVariables', WebVariables);
}
