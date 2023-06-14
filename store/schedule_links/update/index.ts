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
    call,
    put,
    takeEvery,
} from 'redux-saga/effects';
import { ScheduleLink, fetchLinks } from 'store/schedule_links/get';

type UpdateLinkPayload = {
    linkId: string;
    description?: string;
    link?: string;
    subjectScheduleId: string;
};

type LinkState = {
    isLoading: boolean;
};

const initialState: LinkState = {
    isLoading: false,
};

// actions

export const updateLink = createAction(
    'UPDATE_LINK_ATTEMPT',
    (linkInfo: UpdateLinkPayload) => ({
        payload: {
            ...linkInfo,
        },
    })
);
export const updateLinkSucceeded = createAction('UPDATE_LINK_SUCCEEDED');
export const updateLinkFailed = createAction('UPDATE_LINK_FAILED');

// selectors

export const getIsLoading = (state: any) => state.updateLink.isLoading;

// reducers

const updateLinkReducer = (builder: ActionReducerMapBuilder<LinkState>) => {
    builder
        .addCase(updateLink, (state, action) => {
            return {
                ...state,
                isLoading: true,
            };
        })
        .addCase(updateLinkSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        })
        .addCase(updateLinkFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        });
};

// request

async function callAPIUpdateLinkInfo(
    linkId: string,
    json: Omit<UpdateLinkPayload, 'linkId' | 'subjectScheduleId'>
): Promise<AxiosResponse<any>> {
    try {
        const response = await API.patch(`/link/${linkId}`, json);

        return response.data;
    } catch (err) {
        throw err;
    }
}

// saga

export function* updateLinkSaga() {
    yield takeEvery(updateLink.type, workerSaga);
}

function* workerSaga(
    action: ReturnType<typeof updateLink>
): Generator<
    CallEffect<AxiosResponse<any>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const { linkId, subjectScheduleId, ...json } = action.payload;
        const response = yield call(callAPIUpdateLinkInfo, linkId, json);

        yield put({
            type: updateLinkSucceeded.type,
        });
        yield put({
            type: fetchLinks.type,
            payload: { subjectScheduleId: subjectScheduleId },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: updateLinkFailed.type });
    }
}

// slice

export const updateLinkSlice = createSlice({
    name: 'updateLink',
    initialState,
    reducers: {},
    extraReducers: updateLinkReducer,
});
