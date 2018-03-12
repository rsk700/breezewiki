import _ from 'lodash'
import * as types from '../actions/types'

export const editMethod = {
  FULL: 'full',
  BLOCK: 'block',
  DISABLED: 'disabled'
};

let initialState = {
  pages: {},
  titlesMap: {},
  activePage: {
    id: null,
    failedById: false,
    failedByTitle: false,
    newTitle: '',
    newText: '',
    editMethod: editMethod.DISABLED,
    editedBlock: {
      tokenType: null,
      start: null,
      end: null
    },
    history: [],
    historyCursor: null,
    // at least one history request finished
    firstHistoryRequest: false
  }
}

export function getActivePage(state) {
  let page = state.pages.pages[state.pages.activePage.id];
  if (!page) {
    let idByTitle = state.pages.titlesMap[state.pages.activePage.id];
    if (idByTitle) {
      page = state.pages.pages[idByTitle];
    }
  }
  if (!page) {
    page = null;
  }
  return page;
}

function rememberPage(state, page) {
  let newState = _.assign({}, state);
  newState.pages[page.id] = page;
  newState.titlesMap[page.normal_title] = page.id;
  return newState;
}

function getPage(state, action) {
  switch (action.state) {
    case 'success':
      return rememberPage(state, action.page);
    case 'fail':
      if (action.id === state.activePage.id) {
        state = _.assign({}, state);
        state.activePage.failedById = true;
      }
      return state;
    default:
      return state
  }
}

function getPageByTitle(state, action) {
  let newState = null;
  switch (action.state) {
    case 'success':
      newState = rememberPage(state, action.page);
      // it is possible title we sending is different from actual normalized
      // title of page
      newState.titlesMap[action.title] = action.page.id;
      return newState;
    case 'fail':
      if (action.title === state.activePage.id) {
        state = _.assign({}, state);
        state.activePage.failedByTitle = true;
      }
      return state;
    default:
      return state
  }
}

function getActivePageHistory(state, action) {
  switch (action.state) {
    case types.requestStates.SUCCESS:
      let activePageState = _.assign({}, state.activePage, {
        history: action.diffs,
        historyCursor: action.cursor,
        firstHistoryRequest: true
      });
      return {
        ...state,
        activePage: activePageState
      };
    default:
      return state
  }
}

function getMoreActivePageHistory(state, action) {
  switch (action.state) {
    case types.requestStates.SUCCESS:
      let activePageState = _.assign({}, state.activePage, {
        history: state.activePage.history.concat(action.diffs),
        historyCursor: action.cursor,
      });
      return {
        ...state,
        activePage: activePageState
      };
    default:
      return state
  }
}

function updatePage(state, action) {
  switch (action.state) {
    case 'start':
      state = _.assign({}, state);
      state.pages[action.id].text = action.text;
      return state
    case 'success':
      return rememberPage(state, action.page);
    default:
      return state
  }
}

function createPage(state, action) {
  switch (action.state) {
    case 'success':
      return rememberPage(state, action.page);
    default:
      return state
  }
}

function setActivePage(state, action) {
  state = _.assign({}, state);
  state.activePage = {
    // todo: need remember exact page id of active page, currently in id can be
    // title of page id
    id: action.id,
    failedById: false,
    failedByTitle: false,
    newTitle: action.id,
    newText: '',
    editMethod: editMethod.DISABLED,
    editedBlock: {
      tokenType: null,
      start: null,
      end: null
    },
    history: [],
    historyCursor: null,
    firstHistoryRequest: false
  }
  return state;
}

function startPageEditing(state, action) {
  let activePage = _.assign({}, state.activePage);
  activePage.editMethod = action.editMethod;
  activePage.editedBlock = {
    tokenType: action.tokenType,
    start: action.start,
    end: action.end
  };
  let page = state.pages[activePage.id];
  if (!page) {
    let idByTitle = state.titlesMap[activePage.id];
    if (idByTitle) {
      page = state.pages[idByTitle];
    }
  }
  if (page) {
    activePage.newTitle = page.title;
    if (action.editMethod === editMethod.BLOCK) {
      activePage.newText = page.text.slice(action.start, action.end);
    }
    else {
      activePage.newText = page.text;
    }
  }
  else {
    activePage.newTitle = activePage.id;
    activePage.newText = '';
  }
  return activePage;
}

function updateEditedTitle(state, action) {
  state = _.assign({}, state);
  state.activePage.newTitle = action.title;
  return state;
}

function updateEditedText(state, action) {
  state = _.assign({}, state);
  state.activePage.newText = action.text;
  return state;
}

export default function pages(state=initialState, action) {
  switch (action.type) {
    case types.SET_ACTIVE_PAGE:
      return setActivePage(state, action);
    case types.GET_PAGE:
      return getPage(state, action)
    case types.GET_PAGE_BY_TITLE:
      return getPageByTitle(state, action)
    case types.GET_ACTIVE_PAGE_HISTORY:
      return getActivePageHistory(state, action)
    case types.GET_MORE_ACTIVE_PAGE_HISTORY:
      return getMoreActivePageHistory(state, action)
    case types.UPDATE_PAGE:
      return updatePage(state, action)
    case types.CREATE_PAGE:
      return createPage(state, action)
    case types.START_PAGE_EDITING:
      return {
        ...state,
        activePage: startPageEditing(state, action)
      }
    case types.STOP_PAGE_EDITING:
      return {
        ...state,
        activePage: {
          ...state.activePage,
          editMethod: editMethod.DISABLED
        }
      }
    case types.UPDATE_EDITED_TITLE:
      return updateEditedTitle(state, action)
    case types.UPDATE_EDITED_TEXT:
      return updateEditedText(state, action)
    default:
      return state
  }
}
