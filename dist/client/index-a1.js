'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.linkTo = exports.action = exports.storiesOf = undefined;

var _indexA = require('./preview/index-a1');

var previewApi = _interopRequireWildcard(_indexA);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var storiesOf = exports.storiesOf = previewApi.storiesOf;
var action = exports.action = previewApi.action;
var linkTo = exports.linkTo = previewApi.linkTo;
var configure = exports.configure = previewApi.configure;