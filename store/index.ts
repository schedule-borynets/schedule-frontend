import {
    addComment,
    addCommentSaga,
    addCommentSlice,
} from './comment/add/index';
import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';
import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';

import {
    openInfoPanelSaga,
    openInfoPanelSlice,
} from 'store/subject/open-info-panel';
import { themeSlice } from 'store/theme';
import { loginSaga, loginSlice } from 'store/auth/login';
import { registerSaga, registerSlice } from 'store/auth/register';
import { updateProfileSaga, updateProfileSlice } from 'store/profile/update';
import thunk from 'redux-thunk';
import { logoutSaga, logoutSlice } from 'store/auth/logout';
import { getProfileInfoSaga, getProfileInfoSlice } from 'store/profile/get';
import { groupsSaga, groupSlice } from 'store/group';
import { teacherSlice, teachersSaga } from 'store/teacher';
import { getScheduleSaga, getScheduleSlice } from 'store/schedule/get';
import { editScheduleSaga, editScheduleSlice } from 'store/schedule/edit';
import { tagSlice, tagsSaga } from 'store/tag/get';
import { commentSlice, commentsSaga } from 'store/comment/get';
import {
    getSubjectScheduleSaga,
    getSubjectScheduleSlice,
} from 'store/subject/schedule';
import { deleteCommentSaga, deleteCommentSlice } from 'store/comment/delete';
import { addTagSaga, addTagSlice } from 'store/tag/add';
import { deleteTagSaga, deleteTagSlice } from 'store/tag/delete';
import { getSessionSaga, getSessionSlice } from 'store/session';
import { menuSlice } from 'store/menu';

const rootReducer = combineReducers({
    openInfoPanel: openInfoPanelSlice.reducer,
    theme: themeSlice.reducer,
    login: loginSlice.reducer,
    logout: logoutSlice.reducer,
    register: registerSlice.reducer,
    updateProfile: updateProfileSlice.reducer,
    getProfileInfo: getProfileInfoSlice.reducer,
    group: groupSlice.reducer,
    teacher: teacherSlice.reducer,
    getSchedule: getScheduleSlice.reducer,
    editSchedule: editScheduleSlice.reducer,
    tag: tagSlice.reducer,
    comment: commentSlice.reducer,
    addComment: addCommentSlice.reducer,
    deleteComment: deleteCommentSlice.reducer,
    getSubjectSchedule: getSubjectScheduleSlice.reducer,
    addTag: addTagSlice.reducer,
    deleteTag: deleteTagSlice.reducer,
    getSession: getSessionSlice.reducer,
    menu: menuSlice.reducer,
});

function* rootSaga() {
    yield all([
        fork(loginSaga),
        fork(registerSaga),
        fork(logoutSaga),
        fork(updateProfileSaga),
        fork(getProfileInfoSaga),
        fork(groupsSaga),
        fork(teachersSaga),
        fork(getScheduleSaga),
        fork(tagsSaga),
        fork(commentsSaga),
        fork(addCommentSaga),
        fork(deleteCommentSaga),
        fork(openInfoPanelSaga),
        fork(getSubjectScheduleSaga),
        fork(editScheduleSaga),
        fork(addTagSaga),
        fork(deleteTagSaga),
        fork(getSessionSaga),
    ]);
}

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware, thunk],
});

sagaMiddleware.run(rootSaga);

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
