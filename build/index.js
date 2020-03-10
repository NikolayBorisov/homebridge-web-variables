"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _url = _interopRequireDefault(require("url"));

var _server = _interopRequireDefault(require("./server"));

var _storage = _interopRequireDefault(require("./storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Service;
var Characteristic;
var homebridge;

var WebVariables = /*#__PURE__*/function () {
  function WebVariables(log, config) {
    _classCallCheck(this, WebVariables);

    var cacheDirectory = config.cacheDirectory || "".concat(homebridge.user.persistPath(), "_data");
    this.log = log;
    this.services = [];
    this.name = config.name;
    this.storage = new _storage["default"]({
      cacheDirectory: cacheDirectory
    });
    this.server = new _server["default"](config, this.callback.bind(this));
  }

  _createClass(WebVariables, [{
    key: "callback",
    value: function callback(request, response) {
      this.log("HTTP Request \u2192 ".concat(request.url));

      var _url$parse = _url["default"].parse(request.url, true),
          query = _url$parse.query,
          pathname = _url$parse.pathname;

      response.writeHead(200, {
        'Content-Type': 'application/json'
      });

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
  }, {
    key: "getServices",
    value: function getServices() {
      return this.services;
    }
  }, {
    key: "WebSensor",
    value: function WebSensor() {
      if (this.type === 'fan') {
        this.service = new Service.Fanv2(this.name, 'Timer');
        this.Characteristic = {
          Timer: Characteristic.RotationSpeed,
          On: Characteristic.Active
        };
      } else if (this.type === 'bulb') {
        this.service = new Service.Lightbulb(this.name, 'Timer');
        this.Characteristic = {
          Timer: Characteristic.Brightness,
          On: Characteristic.On
        };
      }

      this.service.getCharacteristic(this.Characteristic.Timer).on('set', this.setTimer.bind(this));
      this.service.getCharacteristic(this.Characteristic.On).on('set', this.setOn.bind(this));
    }
  }]);

  return WebVariables;
}();

function _default(hb) {
  homebridge = hb;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-web-variables', 'WebVariables', WebVariables);
}