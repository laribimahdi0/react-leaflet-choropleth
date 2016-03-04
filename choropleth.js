'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactLeaflet = require('react-leaflet');

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        data: feature
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
  var userStyle = _ref2.style;
  var limits = _ref3.limits;
  var colors = _ref3.colors;

  var featureValue = isFunction(valueProperty) ? valueProperty(feature) : feature.properties[valueProperty];

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
}

var Choropleth = function (_GeoJson) {
  _inherits(Choropleth, _GeoJson);

  function Choropleth() {
    _classCallCheck(this, Choropleth);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Choropleth).apply(this, arguments));
  }

  _createClass(Choropleth, [{
    key: 'componentWillMount',


    //TODO: move styling to componentWillUpdate

    value: function componentWillMount() {
      var _props = this.props;
      var valueProperty = _props.valueProperty;
      var userStyle = _props.style;
      var data = _props.data;
      var scale = _props.scale;
      var mode = _props.mode;
      var steps = _props.steps;
      var colors = _props.colors;


      this.props = Object.assign({}, this.props, { style: this.style.bind(this) });
      _get(Object.getPrototypeOf(Choropleth.prototype), 'componentWillMount', this).call(this);
    }
  }, {
    key: 'style',
    value: function style(feature) {
      var valueProperty = this.props.valueProperty;
      var userStyle = this.userStyle;
      var colors = this.colors;
      var limits = this.limits;
      var values = this.values;

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
    }
  }]);

  return Choropleth;
}(_reactLeaflet.GeoJson);

