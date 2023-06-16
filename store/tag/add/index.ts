import {
    ActionReducerMapBuilder,
    createAction,
    createSlice,
} from '@reduxjs/toolkit';
import { API } from 'api';
import { AxiosResponse } from 'axios';
import {
    CallEffect,
    PutEffect,
    SelectEffect,
    call,
    put,
    select,
    takeEvery,
} from 'redux-saga/effects';

import { getSelectedSubjectId } from 'store/subject/open-info-panel';
import { fetchTags } from 'store/tag/get';

type CreateTagPayload = {
    text: string;
    subjectSchedule: string;
};

type AddTagState = {
    isLoading: boolean;
};

const initialState: AddTagState = {
    isLoading: false,
};

// actions

export const addTag = createAction(
    'ADD_TAGS_ATTEMPT',
    (tag: CreateTagPayload) => ({
        payload: {
            ...tag,
        },
    })
);

export const addTagSucceeded = createAction('ADD_TAGS_SUCCEEDED');

export const addTagFailed = createAction('ADD_TAGS_FAILED');

// selectors

export const getIsLoading = (state: any) => state.addTag.isLoading;

// reducers

const addTagReducer = (builder: ActionReducerMapBuilder<AddTagState>) => {
    builder
        .addCase(addTag, (state, action) => {
            return {
                ...state,
                isLoading: true,
            };
        })
        .addCase(addTagSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        })
        .addCase(addTagFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        });
};

// request

async function callAPIAddTag(json: {
    text: string;
    subjectSchedules: string[];
}): Promise<AxiosResponse<any>> {
    const response = await API.post('/tag', json);
    return response.data;
}

// saga

export function* addTagSaga() {
    yield takeEvery(addTag.type, workerSaga);
}

function* workerSaga(
    action: ReturnType<typeof addTag>
): Generator<
    CallEffect<AxiosResponse<any>> | PutEffect<{ type: string }> | SelectEffect,
    void,
    unknown
> {
    try {
        yield call(callAPIAddTag, {
            text: action.payload.text,
            subjectSchedules: [action.payload.subjectSchedule],
        });

        yield put({ type: addTagSucceeded.type });
        const subjectScheduleId = yield select(getSelectedSubjectId);

        yield put({
            type: fetchTags.type,
            payload: { subjectScheduleId: subjectScheduleId },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: addTagFailed.type });
    }
}

// slice

export const addTagSlice = createSlice({
    name: 'addTag',
    initialState,
    reducers: {},
    extraReducers: addTagReducer,
});
