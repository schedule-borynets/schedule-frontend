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
import { fetchLinks } from '../get';

type CreateLinkPayload = {
    link: string;
    description: string;
    subjectSchedule: string;
};

type AddLinkState = {
    isLoading: boolean;
};

const initialState: AddLinkState = {
    isLoading: false,
};

// actions

export const addLink = createAction(
    'ADD_LINK_ATTEMPT',
    (link: CreateLinkPayload) => ({
        payload: {
            ...link,
        },
    })
);

export const addLinkSucceeded = createAction('ADD_LINK_SUCCEEDED');

export const addLinkFailed = createAction('ADD_LINK_FAILED');

// selectors

export const getIsLoading = (state: any) => state.addLink.isLoading;

// reducers

const addLinkReducer = (builder: ActionReducerMapBuilder<AddLinkState>) => {
    builder
        .addCase(addLink, (state, action) => {
            return {
                ...state,
                isLoading: true,
            };
        })
        .addCase(addLinkSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        })
        .addCase(addLinkFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        });
};

// request

type APIResponse = {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
    };
};

async function callAPIAddLink(
    json: CreateLinkPayload
): Promise<AxiosResponse<APIResponse>> {
    const response = await API.post('/link', json);
    return response.data;
}

// saga

export function* addLinkSaga() {
    yield takeEvery(addLink.type, workerSaga);
}

function* workerSaga(
    action: ReturnType<typeof addLink>
): Generator<
    | CallEffect<AxiosResponse<APIResponse>>
    | PutEffect<{ type: string }>
    | SelectEffect,
    void,
    unknown
> {
    try {
        yield call(callAPIAddLink, action.payload);

        yield put({ type: addLinkSucceeded.type });
        const subjectScheduleId = yield select(getSelectedSubjectId);
        yield put({
            type: fetchLinks.type,
            payload: { subjectScheduleId: subjectScheduleId },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: addLinkFailed.type });
    }
}

// slice

export const addLinkSlice = createSlice({
    name: 'addLink',
    initialState,
    reducers: {},
    extraReducers: addLinkReducer,
});
