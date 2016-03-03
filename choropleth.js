'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _reactLeaflet = require('react-leaflet');

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = function style(_ref) {
  var valueProperty = _ref.valueProperty;
  var userStyle = _ref.style;
  var data = _ref.data;
  var colors = _ref.colors;
  var scale = _ref.scale;
  var mode = _ref.mode;
  var steps = _ref.steps;

  return function (feature) {

    var values = data.features.map(function (item) {
      return typeof valueProperty === 'function' ? valueProperty(item) : item.properties[valueProperty];
    });

    var limits = _chromaJs2.default.limits(values, mode, steps - 1);
    var colors = colors || _chromaJs2.default.scale(scale).colors(steps);

    var featureValue = typeof valueProperty === 'function' ? valueProperty(feature) : feature.properties[valueProperty];

    var idx = !isNaN(featureValue) ? limits.findIndex(function (lim) {
      return featureValue <= lim;
    }) : -1;

    var style = {
      fillColor: colors[idx] || 0
    };
    switch (typeof userStyle === 'undefined' ? 'undefined' : _typeof(userStyle)) {
      case 'function':
        return Object.assign(userStyle(), style);
      case 'object':
        return Object.assign({}, userStyle, style);
      default:
        return style;
    }
  };
};

exports.default = function (props) {
  props = Object.assign({}, props, { style: style(props) });
  return _react2.default.createElement(_reactLeaflet.GeoJson, props);
};

