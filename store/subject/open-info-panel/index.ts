import {
    ActionReducerMapBuilder,
    createAction,
    createSlice,
} from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import { CallEffect, PutEffect, put, takeEvery } from 'redux-saga/effects'
import { fetchComments } from 'store/comment/get'
import { fetchTags } from 'store/tag/get'
import { fetchLinks } from '../../schedule_links/get'

type SubjectState = {
    subjectId: string | null
    isInfoPanelOpen: boolean
}

const initialState: SubjectState = {
    subjectId: null,
    isInfoPanelOpen: false,
}

// actions

export const openSubjectInfoPanel = createAction(
    'OPEN_SUBJECT_INFO_PANEL',
    (subjectScheduleId: string) => ({
        payload: {
            subjectScheduleId,
        },
    })
)

export const closeSubjectInfoPanel = createAction('CLOSE_SUBJECT_INFO_PANEL')

// selectors

export const getIsInfoPanelOpen = (state: any) =>
    state.openInfoPanel.isInfoPanelOpen
export const getSelectedSubjectId = (state: any) =>
    state.openInfoPanel.subjectId

// reducers

const subjectReducer = (builder: ActionReducerMapBuilder<SubjectState>) => {
    builder
        .addCase(openSubjectInfoPanel, (state, action) => {
            return {
                ...state,
                subjectId: action.payload.subjectScheduleId,
                isInfoPanelOpen: true,
            }
        })
        .addCase(closeSubjectInfoPanel, (state, action) => {
            return {
                ...state,
                subjectId: null,
                isInfoPanelOpen: false,
            }
        })
}

// saga

export function* openInfoPanelSaga() {
    yield takeEvery(openSubjectInfoPanel.type, infoPanelSaga)
}

function* infoPanelSaga(
    action: any
): Generator<
    CallEffect<AxiosResponse<any>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    yield put({
        type: fetchComments.type,
        payload: { subjectScheduleId: action.payload.subjectScheduleId },
    })
    yield put({
        type: fetchTags.type,
        payload: { subjectScheduleId: action.payload.subjectScheduleId },
    })

    yield put({
        type: fetchLinks.type,
        payload: { subjectScheduleId: action.payload.subjectScheduleId },
    })
}

// slice

export const openInfoPanelSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {},
    extraReducers: subjectReducer,
})
