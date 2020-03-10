"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodePersist = _interopRequireDefault(require("node-persist"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(_ref) {
  var cacheDirectory = _ref.cacheDirectory;

  _nodePersist["default"].initSync({
    dir: cacheDirectory
  });

  var data = _nodePersist["default"].getItemSync('data') || {};
  return {
    getItem: function getItem(item) {
      return data[item];
    },
    setItem: function setItem(item, value) {
      data[item] = value;

      _nodePersist["default"].setItem('data', data);
    },
    delItem: function delItem(item) {
      delete data[item];

      _nodePersist["default"].setItem('data', data);
    },
    getItems: function getItems() {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var res = {};
      Object.keys(items).forEach(function (key) {
        res[key] = data[key];
      });
      return res;
    },
    setItems: function setItems(items) {
      Object.keys(items).forEach(function (key) {
        data[key] = items[key];
      });

      _nodePersist["default"].setItem('data', data);
    },
    delItems: function delItems(items) {
      Object.keys(items).forEach(function (key) {
        delete data[key];
      });

      _nodePersist["default"].setItem('data', data);
    }
  };
};

exports["default"] = _default;