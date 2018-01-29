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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LotteryCard = function (_Events) {
  (0, _inherits3.default)(LotteryCard, _Events);

  function LotteryCard(canvas, options) {
    (0, _classCallCheck3.default)(this, LotteryCard);

    var _this = (0, _possibleConstructorReturn3.default)(this, (LotteryCard.__proto__ || (0, _getPrototypeOf2.default)(LotteryCard)).call(this));

    _this.options = (0, _assign2.default)({
      size: 20,
      percent: 50,
      resize: true,
      cover: null
    }, options);

    _this.canvas = canvas;
    _this.ctx = canvas.getContext('2d');

    _this._first = true;
    _this._touch = false;
    _this.init();
    _this.bind();
    return _this;
  }

  (0, _createClass3.default)(LotteryCard, [{
    key: 'getCanvasInfo',
    value: function getCanvasInfo() {
      var info = this.canvas.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeftp || 0;

      this.width = info.width;
      this.height = info.height;
      this.offsetX = Math.round(info.left + scrollLeft);
      this.offsetY = Math.round(info.top + scrollTop);
      this.canvas.width = info.width;
      this.canvas.height = info.height;
    }
  }, {
    key: 'bind',
    value: function bind() {
      var SUPPORT_ONLY_TOUCH = 'ontouchstart' in window && /mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent);

      this.canvas.addEventListener(SUPPORT_ONLY_TOUCH ? 'touchstart' : 'mousedown', this.onTouchStart.bind(this), false);
      this.canvas.addEventListener(SUPPORT_ONLY_TOUCH ? 'touchmove' : 'mousemove', this.onTouchMove.bind(this), false);
      document.addEventListener(SUPPORT_ONLY_TOUCH ? 'touchend' : 'mouseup', this.onTouchEnd.bind(this));
      window.addEventListener('onorientationchange' in document ? 'orientationchange' : 'resize', this.onResize.bind(this));
    }
  }, {
    key: 'init',
    value: function init() {
      this._state = 'init';
      this.getCanvasInfo();

      this.ctx.closePath();
      this.ctx.globalCompositeOperation = 'source-over';
      var cover = this.options.cover;

      if (cover instanceof Image) {
        this.ctx.fillStyle = this.ctx.createPattern(cover, 'repeat');
        this.ctx.rect(0, 0, this.width, this.height);
      } else {
        this.ctx.fillStyle = typeof cover === 'string' ? cover : 'gray';
        this.ctx.fillRect(0, 0, this.width, this.height);
      }
      this.ctx.fill();
      this.ctx.globalCompositeOperation = 'destination-out';
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._first = true;
      this._touch = false;
      this.canvas.style.backgroundImage = null;
      this.init();
      this.trigger('reset');
    }
  }, {
    key: 'setResult',
    value: function setResult(url) {
      this.canvas.style.backgroundImage = 'url(' + url + ')';
    }
  }, {
    key: 'draw',
    value: function draw() {
      if (this._state === 'end') return;
      this._state = 'end';
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.trigger('end');
    }
  }, {
    key: 'scratchPercent',
    value: function scratchPercent() {
      var imageData = this.ctx.getImageData(0, 0, this.width, this.height);
      var hits = 0;

      for (var i = 0, ii = imageData.data.length; i < ii; i += 4) {
        if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 0 && imageData.data[i + 3] === 0) {
          hits++;
        }
      }

      return hits / (this.width * this.height) * 100;
    }
  }, {
    key: 'getEventXY',
    value: function getEventXY(e) {
      e = e.changedTouches ? e.changedTouches[0] : e;
      return {
        x: e.pageX - this.offsetX,
        y: e.pageY - this.offsetY
      };
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(e) {
      e.preventDefault();
      if (this._state === 'end') return;
      if (this.has('start') && this._first) this.trigger('start');

      var point = this.getEventXY(e);
      this._state = 'start';
      this._touch = true;
      this._first = false;

      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, this.options.size / 2, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.lineWidth = this.options.size;
      this.ctx.moveTo(point.x, point.y);
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(e) {
      e.preventDefault();
      if (!this._touch) return;

      var point = this.getEventXY(e);
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(e) {
      if (!this._touch) return;
      this._touch = false;

      var point = this.getEventXY(e);
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, this.options.size / 2, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.fill();

      if (this.scratchPercent() >= this.options.percent) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this._state = 'end';
        this.trigger('end');
      }
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      this._touch = false;
      if (this.options.resize) {
        if (this._state !== 'end') {
          this.init();
        } else {
          this.getCanvasInfo();
        }
      } else {
        this.getCanvasInfo();
      }
    }
  }]);
  return LotteryCard;
}(_events2.default);

exports.default = LotteryCard;