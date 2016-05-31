'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactLeaflet = require('react-leaflet');

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _assign = require('./assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  var features = Array.isArray(props.data) ? props.data : props.data.features;
  var chroms = getColors(props);
  return _react2.default.createElement(
    'div',
    null,
    features.map(function (feature, idx) {
      return _react2.default.createElement(_reactLeaflet.GeoJson, _extends({
        key: idx
      }, props, {
        style: getStyle(props, chroms, feature)
      }, getStyle(props, chroms, feature), {
        data: feature,
        children: props.children ? cloneChildrenWithFeature(props, feature) : props.children
      }));
    })
  );
};

function isFunction(prop) {
  return typeof prop === 'function';
}

function getColors(_ref) {
  var data = _ref.data;
  var valueProperty = _ref.valueProperty;
  var mode = _ref.mode;
  var steps = _ref.steps;
  var scale = _ref.scale;
  var cl = _ref.colors;


  var colors = {};
  var features = Array.isArray(data) ? data : data.features;

  var values = features.map(function (item) {
    return isFunction(valueProperty) ? valueProperty(item) : item.properties[valueProperty];
  });

  colors.limits = _chromaJs2.default.limits(values, mode, steps - 1);
  colors.colors = cl || _chromaJs2.default.scale(scale).colors(steps);
  return colors;
}

function getStyle(_ref2, _ref3, feature) {
  var valueProperty = _ref2.valueProperty;
  var visible = _ref2.visible;
  var userStyle = _ref2.style;
  var limits = _ref3.limits;
  var colors = _ref3.colors;

  visible = visible || function () {
    return true;
  }; //If visible was not given, always return true
  if (!(isFunction(visible) && visible(feature) || feature.properties[visible])) return userStyle;

  var featureValue = isFunction(valueProperty) ? valueProperty(feature) : feature.properties[valueProperty];

  var idx = !isNaN(featureValue) ? limits.findIndex(function (lim) {
    return featureValue <= lim;
  }) : -1;

  if (colors[idx]) {
    var style = {
      fillColor: colors[idx]
    };

    switch (typeof userStyle === 'undefined' ? 'undefined' : _typeof(userStyle)) {
      case 'function':
        return (0, _assign2.default)(userStyle(feature), style);
      case 'object':
        return (0, _assign2.default)({}, userStyle, style);
      default:
        return style;
    }
  } else {
    return userStyle;
  }
}

function cloneChildrenWithFeature(props, feature) {
  var newProps = (0, _assign2.default)(props, { feature: feature });
  return ChildNode.map(props.children, function (child) {
    return child ? (0, _react.cloneElement)(child, newProps) : null;
  });
}

