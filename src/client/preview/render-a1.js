import 'airbnb-js-shims';
import angular from 'angular';
import {setup} from 'a1-redux';

const rootEl = document.getElementById('root');
let previousKind = '';
let previousStory = '';
const APP_CLASSNAME = 'a1-redux-storybook';

function createNewAppForStory(rootEl, getStory){
  let divApp = angular.element(rootEl).find(`.${APP_CLASSNAME}`)[0];
  divApp = divApp ? angular.element(divApp): null;
  divApp && divApp.scope && divApp.scope() ? divApp.scope().$destroy(): null;

  angular.element(rootEl).empty();
  divApp = angular.element(`<div class="${APP_CLASSNAME}"></div>`);
  angular.element(rootEl).append(divApp);
  const app = setup(angular.module(APP_CLASSNAME, []));

  const story = getStory();


  Object.keys(story.directiveList).forEach(key => {
    app.directive(key, story.directiveList[key]);
  });
  angular.bootstrap(divApp, ['a1-redux-storybook']);
  divApp.injector().invoke(['$compile', '$rootScope', ($compile, $rootScope) => {
    const $nuScope = $rootScope.$new();
    Object.keys(story.acceptData).forEach(key => {
      $nuScope[key] = story.acceptData[key];
    });

    divApp.append($compile(story.html)($nuScope));
    $nuScope.$digest();
  }]);
  
}

export function renderError(error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const realError = new Error(error.message);
  realError.stack = error.stack;
  angular.element(rootEl).append('ERROR!!! Please check your console.');
  console.error(realError);
}

export function renderMain(data, storyStore) {
  if (storyStore.size() === 0) return null;

  const { selectedKind, selectedStory } = data;

  const story = storyStore.getStory(selectedKind, selectedStory);
  if (!story) {
    return angular.element(rootEl).html('<h1>no preview</h1>');
  }
  let app;

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

export default function renderPreview({ reduxStore, storyStore }) {
  const state = reduxStore.getState();
  if (state.error) {
    return renderError(state.error);
  }

  return renderMain(state, storyStore);
}
