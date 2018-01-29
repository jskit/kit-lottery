'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('./modules/assign');

var _events = require('./modules/events');

var _events2 = _interopRequireDefault(_events);

var _animationEnd = require('./modules/animationEnd');

var _animationEnd2 = _interopRequireDefault(_animationEnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LotteryTigerRoller = function () {
  function LotteryTigerRoller(elem) {
    (0, _classCallCheck3.default)(this, LotteryTigerRoller);

    this.elem = elem;
    this.items = elem.children;

    this.elem.appendChild(this.items[0].cloneNode(true));
  }

  (0, _createClass3.default)(LotteryTigerRoller, [{
    key: 'resize',
    value: function resize() {
      this.height = this.items[0].clientHeight;
      if (!this.elem.classList.contains('fx-roll') && this.index > 0) this.elem.style.marginTop = -this.index * this.height + 'px';
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.elem.classList.remove('fx-roll');
      this.elem.classList.remove('fx-bounce');
      this.elem.style.marginTop = 0;
      this.state = 0;
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.state === 1) return;
      this.state = 1;
      setTimeout(function () {
        if (_this.state !== 1) return;
        _this.elem.classList.add('fx-roll');
        _this.elem.style.marginTop = 0;
      }, timeout);
    }
  }, {
    key: 'stop',
    value: function stop(index, callback) {
      var _this2 = this;

      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (!this.height) this.height = this.items[0].clientHeight;
      setTimeout(function () {
        if (_this2.state !== 1) return;
        _this2.elem.classList.remove('fx-roll');
        _this2.elem.classList.add('fx-bounce');
        _this2.elem.style.marginTop = -index * _this2.height + 'px';
        (0, _animationEnd2.default)(_this2.elem, function () {
          _this2.state = 0;
          _this2.elem.classList.remove('fx-bounce');
          if (callback) callback.call(_this2, index);
        });
      }, timeout);
    }
  }]);
  return LotteryTigerRoller;
}();

var LotteryTiger = function (_Events) {
  (0, _inherits3.default)(LotteryTiger, _Events);

  function LotteryTiger(toggle, rollers, options) {
    (0, _classCallCheck3.default)(this, LotteryTiger);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (LotteryTiger.__proto__ || (0, _getPrototypeOf2.default)(LotteryTiger)).call(this));

    _this3.options = (0, _assign2.default)({
      interval: 300,
      aniMinTime: 6000,
      resize: true }, options);
    _this3.toggle = toggle;

    _this3.rollerQueue = [];
    for (var i = 0; i < rollers.length; i++) {
      _this3.rollerQueue.push(new LotteryTigerRoller(rollers[i]));
    }

    if (_this3.options.resize) {
      var handler = 'onorientationchange' in document ? 'orientationchange' : 'resize';
      window.addEventListener('' + handler, function () {
        _this3.rollerQueue.forEach(function (roller) {
          return roller.resize();
        });
      });
    }
    return _this3;
  }

  (0, _createClass3.default)(LotteryTiger, [{
    key: 'reset',
    value: function reset() {
      this.toggle.classList.remove('z-active');
      for (var i = 0, l = this.rollerQueue.length; i < l; i++) {
        this.rollerQueue[i].reset();
      }
      this.trigger('reset');
    }
  }, {
    key: 'setResult',
    value: function setResult(ret) {
      var _this4 = this;

      var endTime = new Date().getTime();
      var time = endTime - this._startTime > this.options.aniMinTime ? 0 : this.options.aniMinTime - (endTime - this._startTime);
      setTimeout(function () {
        for (var i = 0, l = _this4.rollerQueue.length; i < l; i++) {
          _this4.rollerQueue[i].stop(ret[i], i === l - 1 ? function () {
            _this4.toggle.classList.remove('z-active');
            _this4.trigger('end');
          } : null, i * _this4.options.interval);
        }
      }, time);
    }
  }, {
    key: 'draw',
    value: function draw() {
      if (this.toggle.classList.contains('z-active')) return;
      if (this.has('start')) this.trigger('start');
      this._startTime = new Date().getTime();

      this.toggle.classList.add('z-active');
      for (var i = 0, l = this.rollerQueue.length; i < l; i++) {
        this.rollerQueue[i].start(i * this.options.interval);
      }
    }
  }]);
  return LotteryTiger;
}(_events2.default);

exports.default = LotteryTiger;