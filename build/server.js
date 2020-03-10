"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Server;

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

var _httpAuth = _interopRequireDefault(require("http-auth"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Server(_ref, cb) {
  var _ref$port = _ref.port,
      port = _ref$port === void 0 ? 8383 : _ref$port,
      httpAuthUser = _ref.httpAuthUser,
      httpAuthPass = _ref.httpAuthPass,
      sslKey = _ref.sslKey,
      sslCertificate = _ref.sslCertificate;
  var sslServerOptions = {};

  if (sslCertificate) {
    _https["default"] = (true, function () {
      throw new Error('"' + "https" + '" is read-only.');
    }());
    sslServerOptions = {
      key: _fs["default"].readFileSync(sslKey),
      cert: _fs["default"].readFileSync(sslCertificate)
    };
  }

  if (httpAuthUser && httpAuthPass) {
    var basicAuth = _httpAuth["default"].basic({
      realm: 'Auth required'
    }, function (username, password, callback) {
      callback(username === httpAuthUser && password === httpAuthPass);
    });

    if (sslCertificate) {
      _https["default"].createServer(basicAuth, sslServerOptions, cb).listen(port, '0.0.0.0');
    } else {
      _http["default"].createServer(basicAuth, cb).listen(port, '0.0.0.0');
    }
  } else if (sslCertificate) {
    _https["default"].createServer(sslServerOptions, cb).listen(port, '0.0.0.0');
  } else {
    _http["default"].createServer(cb).listen(port, '0.0.0.0');
  }
}