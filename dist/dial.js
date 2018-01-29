'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

require('./modules/assign');

var _events = require('./modules/events');

var _events2 = _interopRequireDefault(_events);

var _getPrefix = require('./modules/getPrefix');

var _getPrefix2 = _interopRequireDefault(_getPrefix);

var _requestAnimationFrame = require('./modules/requestAnimationFrame');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LotteryDial = function (_Events) {
  (0, _inherits3.default)(LotteryDial, _Events);

  function LotteryDial(pointer, options) {
    (0, _classCallCheck3.default)(this, LotteryDial);

    var _this = (0, _possibleConstructorReturn3.default)(this, (LotteryDial.__proto__ || (0, _getPrototypeOf2.default)(LotteryDial)).call(this));

    _this.options = (0, _assign2.default)({
      speed: 30,
      areaNumber: 8,
      deviation: 2 }, options);
    _this.pointer = pointer;

    _this.init();
    return _this;
  }

  (0, _createClass3.default)(LotteryDial, [{
    key: 'init',
    value: function init() {
      this._transform = (0, _getPrefix2.default)(this.pointer, 'transform', 'translate3d(0,0,0)');
      (0, _getPrefix2.default)(this.pointer, 'backfaceVisibility', 'hidden');
      (0, _getPrefix2.default)(this.pointer, 'perspective', '1000px');

      this._raf = null;
      this._runAngle = 0;
      this._targetAngle = -1;
    }
  }, {
    key: 'reset',
    value: function reset() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'reset';

      if (!this._raf) return;
      (0, _requestAnimationFrame.cancelAnimationFrame)(this._raf);
      this._raf = null;
      this._runAngle = 0;
      this._targetAngle = -1;
      this.trigger(event);
      if (event === 'reset') (0, _getPrefix2.default)(this.pointer, this._transform, 'translate3d(0,0,0) rotate(0deg)');
    }
  }, {
    key: 'setResult',
    value: function setResult(index) {
      var singleAngle = 360 / this.options.areaNumber;
      var endAngle = Math.random() * singleAngle;

      endAngle = Math.max(this.options.deviation, endAngle);
      endAngle = Math.min(singleAngle - this.options.deviation, endAngle);
      endAngle = Math.ceil(endAngle + index * singleAngle);

      this._runAngle = 0;
      this._targetAngle = endAngle + (Math.floor(Math.random() * 4) + 4) * 360;
    }
  }, {
    key: 'step',
    value: function step() {
      var _this2 = this;

      if (this._targetAngle === -1) {
        this._runAngle += this.options.speed;
      } else {
        this._angle = (this._targetAngle - this._runAngle) / this.options.speed;
        this._angle = this._angle > this.options.speed ? this.options.speed : this._angle < 0.5 ? 0.5 : this._angle;
        this._runAngle += this._angle;
        this._runAngle = this._runAngle > this._targetAngle ? this._targetAngle : this._runAngle;
      }

      (0, _getPrefix2.default)(this.pointer, this._transform, 'translate3d(0,0,0) rotate(' + this._runAngle % 360 + 'deg)');

      if (this._runAngle === this._targetAngle) {
        this.reset('end');
      } else {
        this._raf = (0, _requestAnimationFrame.requestAnimationFrame)(function () {
          return _this2.step();
        });
      }
    }
  }, {
    key: 'draw',
    value: function draw() {
      var _this3 = this;

      if (this._raf) return;
      if (this.has('start')) this.trigger('start');
      this._angle = 0;
      this._raf = (0, _requestAnimationFrame.requestAnimationFrame)(function () {
        return _this3.step();
      });
    }
  }]);
  return LotteryDial;
}(_events2.default);

exports.default = LotteryDial;