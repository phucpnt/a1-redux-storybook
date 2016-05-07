'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.renderError = renderError;
exports.renderMain = renderMain;
exports.default = renderPreview;

require('airbnb-js-shims');

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _a1Redux = require('a1-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootEl = document.getElementById('root');
var previousKind = '';
var previousStory = '';
var APP_CLASSNAME = 'a1-redux-storybook';

function createNewAppForStory(rootEl, getStory) {
  var divApp = _angular2.default.element(rootEl).find('.' + APP_CLASSNAME)[0];
  divApp = divApp ? _angular2.default.element(divApp) : null;
  divApp && divApp.scope && divApp.scope() ? divApp.scope().$destroy() : null;

  _angular2.default.element(rootEl).empty();
  divApp = _angular2.default.element('<div class="' + APP_CLASSNAME + '"></div>');
  _angular2.default.element(rootEl).append(divApp);
  var app = (0, _a1Redux.setup)(_angular2.default.module(APP_CLASSNAME, []));

  var story = getStory();

  (0, _keys2.default)(story.directiveList).forEach(function (key) {
    app.directive(key, story.directiveList[key]);
  });
  _angular2.default.bootstrap(divApp, ['a1-redux-storybook']);
  divApp.injector().invoke(['$compile', '$rootScope', function ($compile, $rootScope) {
    var $nuScope = $rootScope.$new();
    (0, _keys2.default)(story.acceptData).forEach(function (key) {
      $nuScope[key] = story.acceptData[key];
    });

    divApp.append($compile(story.html)($nuScope));
    $nuScope.$digest();
  }]);
}

function renderError(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  var realError = new Error(error.message);
  realError.stack = error.stack;
  _angular2.default.element(rootEl).append('ERROR!!! Please check your console.');
  console.error(realError);
}

function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  var selectedKind = data.selectedKind;
  var selectedStory = data.selectedStory;


  var story = storyStore.getStory(selectedKind, selectedStory);
  if (!story) {
    return _angular2.default.element(rootEl).html('<h1>no preview</h1>');
  }
  var app = void 0;

  // Unmount the previous story only if selectedKind or selectedStory has changed.
  // renderMain() gets executed after each action. Actions will cause the whole
  // story to re-render without this check.
  //    https://github.com/kadirahq/react-storybook/issues/116
  if (selectedKind !== previousKind || previousStory !== selectedStory) {
    // We need to unmount the existing set of components in the DOM node.
    // Otherwise, React may not recrease instances for every story run.
    // This could leads to issues like below:
    //    https://github.com/kadirahq/react-storybook/issues/81
    previousKind = selectedKind;
    previousStory = selectedStory;
    // ReactDOM.unmountComponentAtNode(rootEl);
    // setup(app);
    //TODO: support a1-redux directive, custom scope/proptypes
  }
  createNewAppForStory(rootEl, story);
  return rootEl;
}

function renderPreview(_ref) {
  var reduxStore = _ref.reduxStore;
  var storyStore = _ref.storyStore;

  var state = reduxStore.getState();
  if (state.error) {
    return renderError(state.error);
  }

  return renderMain(state, storyStore);
}