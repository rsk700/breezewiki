import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/empty'
import { Observable } from 'rxjs/Observable'
import * as types from './types'
import api from '../api'
import { getActivePage } from '../reducers/pages'

export function setActivePage(pageId) {
  return {
    type: types.SET_ACTIVE_PAGE,
    id: pageId
  }
}

export function getPageSuccess(page) {
  return {
    type: types.GET_PAGE,
    state: 'success',
    page,
  }
}

export function getPageFail(id, error) {
  return {
    type: types.GET_PAGE,
    state: 'fail',
    id: id,
    error
  }
}

export function getPage(id) {
  return (dispatch, getState) => {
    dispatch({
      type: types.GET_PAGE,
      state: 'start',
      id: id
    })
    dispatch({
      type: types.GET_PAGE_BY_TITLE,
      state: 'start',
      title: id
    })
    api.getPagesById$(getState().auth.token, id)
      .catch(({error}) => { dispatch(getPageFail(id, error)); return Observable.empty(); })
      .subscribe(page => dispatch(getPageSuccess(page)))
      ;
    api.getPagesByTitle$(getState().auth.token, id)
      .catch(({error}) => { dispatch(getPageByTitleFail(id, error)); return Observable.empty(); })
      .subscribe(page => dispatch(getPageByTitleSuccess(page, id)))
      ;
  }
}

export function getPageByTitleSuccess(page, title) {
  return {
    type: types.GET_PAGE_BY_TITLE,
    state: 'success',
    title: title,
    page,
  }
}

export function getPageByTitleFail(title, error) {
  return {
    type: types.GET_PAGE_BY_TITLE,
    state: 'fail',
    title: title,
    error
  }
}

export function getPageByTitle(title) {
  return (dispatch, getState) => {
    dispatch({
      type: types.GET_PAGE_BY_TITLE,
      state: 'start',
      title: title
    })
    api.getPagesByTitle$(getState().auth.token, title)
      .catch(({error}) => { dispatch(getPageByTitleFail(title, error)); return Observable.empty(); })
      .subscribe(page => dispatch(getPageByTitleSuccess(page, title)))
      ;
  }
}

export function updatePageSuccess(page) {
  return {
    type: types.UPDATE_PAGE,
    state: 'success',
    page,
  }
}

export function updatePageFail(id, diffId, text, error) {
  return {
    type: types.UPDATE_PAGE,
    state: 'fail',
    id: id,
    diffId: diffId,
    text: text,
    error
  }
}

export function updatePage(id, diffId, text) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_PAGE,
      state: 'start',
      id: id,
      diffId: diffId,
      text: text
    })
    api.putPagesById$(getState().auth.token, id, diffId, text)
      .catch(({error}) => { dispatch(updatePageFail(id, diffId, text, error)); return Observable.empty(); })
      .subscribe(page => dispatch(updatePageSuccess(page)))
      ;
  }
}

export function createPageSuccess(title, page) {
  return {
    type: types.CREATE_PAGE,
    state: 'success',
    title,
    page,
  }
}

export function createPageFail(title, error) {
  return {
    type: types.CREATE_PAGE,
    state: 'fail',
    title,
    error
  }
}

export function createPage(title, text) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CREATE_PAGE,
      state: 'start',
      title,
      text
    })
    api.postPages$(getState().auth.token, title, text)
      .catch(({error}) => { dispatch(createPageFail(title, error)); return Observable.empty(); })
      .subscribe(page => dispatch(createPageSuccess(title, page)))
      ;
  }
}

export function startPageEditing(editMethod, tokenType, start, end) {
  return {
    type: types.START_PAGE_EDITING,
    editMethod,
    tokenType,
    start,
    end
  }
}

export function stopPageEditing() {
  return {
    type: types.STOP_PAGE_EDITING
  }
}

export function updateEditedTitle(title) {
  return {
    type: types.UPDATE_EDITED_TITLE,
    title
  }
}

export function updateEditedText(text) {
  return {
    type: types.UPDATE_EDITED_TEXT,
    text
  }
}

export function getActivePageHistorySuccess(diffs, cursor) {
  return {
    type: types.GET_ACTIVE_PAGE_HISTORY,
    state: types.requestStates.SUCCESS,
    diffs: diffs,
    cursor: cursor
  }
}

export function getActivePageHistoryFail(error) {
  return {
    type: types.GET_ACTIVE_PAGE_HISTORY,
    state: types.requestStates.FAIL,
    error
  }
}

export function getActivePageHistory() {
  return (dispatch, getState) => {
    let page = getActivePage(getState());
    dispatch({
      type: types.GET_ACTIVE_PAGE_HISTORY,
      state: types.requestStates.START
    });
    api.getPagesByIdDiffs$(getState().auth.token, page.id, null)
      .catch(({error}) => { dispatch(getActivePageHistoryFail(error)); return Observable.empty(); })
      .subscribe(diffs => dispatch(getActivePageHistorySuccess(diffs.data, diffs.next)))
      ;
  };
}

export function getMoreActivePageHistorySuccess(diffs, cursor) {
  return {
    type: types.GET_MORE_ACTIVE_PAGE_HISTORY,
    state: types.requestStates.SUCCESS,
    diffs: diffs,
    cursor: cursor
  }
}

export function getMoreActivePageHistoryFail(error) {
  return {
    type: types.GET_MORE_ACTIVE_PAGE_HISTORY,
    state: types.requestStates.FAIL,
    error
  };
}

export function getMoreActivePageHistory() {
  return (dispatch, getState) => {
    let page = getActivePage(getState());
    dispatch({
      type: types.GET_MORE_ACTIVE_PAGE_HISTORY,
      state: types.requestStates.START
    });
    api.getPagesByIdDiffs$(getState().auth.token, page.id, getState().pages.activePage.historyCursor)
      .catch(({error}) => { dispatch(getMoreActivePageHistoryFail(error)); return Observable.empty(); })
      .subscribe(diffs => dispatch(getMoreActivePageHistorySuccess(diffs.data, diffs.next)))
      ;
  };
}
