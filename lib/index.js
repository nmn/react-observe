'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = polyfillObserve;

var _React$Component = require('react');

var _React$Component2 = _interopRequireWildcard(_React$Component);

var _assign = require('react/lib/Object.assign');

var _assign2 = _interopRequireWildcard(_assign);

function polyfillObserve(ComposedComponent, observe) {
  var Enhancer = (function (_ComposedComponent) {
    function Enhancer(props, context) {
      _classCallCheck(this, Enhancer);

      _get(Object.getPrototypeOf(Enhancer.prototype), 'constructor', this).call(this, props, context);

      if (this.observe) {
        this._subscriptions = {};
        this.data = {};
        this._resubscribe(props, context);
      }
    }

    _inherits(Enhancer, _ComposedComponent);

    _createClass(Enhancer, [{
      key: 'componentWillUpdate',
      value: function componentWillUpdate() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(Enhancer.prototype), 'componentWillUpdate', this) && _get(Object.getPrototypeOf(Enhancer.prototype), 'componentWillUpdate', this).apply(this, args);
        if (this.observe) {
          this._resubscribe(this.props, this.context);
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(newProps, newContext) {
        _get(Object.getPrototypeOf(Enhancer.prototype), 'componentWillReceiveProps', this) && _get(Object.getPrototypeOf(Enhancer.prototype), 'componentWillReceiveProps', this).call(this, newProps, newContext);
        if (this.observe) {
          this._resubscribe(newProps, newContext);
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        _get(Object.getPrototypeOf(Enhancer.prototype), 'componentWillUnmount', this) && _get(Object.getPrototypeOf(Enhancer.prototype), 'componentWillUnmount', this).call(this);
        if (this._subscriptions) {
          this._unsubscribe();
        }
      }
    }, {
      key: '_resubscribe',
      value: function _resubscribe(props, context) {
        var newObservables = this.observe(props, context);
        var newSubscriptions = {};
        var that = this;

        var _loop = function (key) {
          newSubscriptions[key] = newObservables[key].subscribe(function onNext(value) {
            that.data[key] = value;
            that.forceUpdate();
          }, function onError() {}, function onCompleted() {});
        };

        for (var key in newObservables) {
          _loop(key);
        }

        this._unsubscribe();
        this._subscriptions = newSubscriptions;
      }
    }, {
      key: '_unsubscribe',
      value: function _unsubscribe() {
        var _this = this;

        Object.keys(this._subscriptions).forEach(function (key) {
          return _this._subscriptions[key].dispose();
        });

        this._subscriptions = {};
      }
    }]);

    return Enhancer;
  })(ComposedComponent);

  Enhancer.propTypes = ComposedComponent.propTypes;
  Enhancer.contextTypes = ComposedComponent.contextTypes;

  return Enhancer;
}

module.exports = exports['default'];