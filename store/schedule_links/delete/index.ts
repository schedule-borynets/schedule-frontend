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

type DeleteLinkState = {
    isLoading: boolean;
};

const initialState: DeleteLinkState = {
    isLoading: false,
};

// actions

export const deleteLink = createAction(
    'DELETE_LINK_ATTEMPT',
    (linkId: string) => ({
        payload: {
            linkId,
        },
    })
);

export const deleteLinkSucceeded = createAction('DELETE_LINK_SUCCEEDED');

export const deleteLinkFailed = createAction('DELETE_LINK_FAILED');

// selectors

export const getIsLoading = (state: any) => state.deleteLink.isLoading;

// reducers

const deleteLinkReducer = (
    builder: ActionReducerMapBuilder<DeleteLinkState>
) => {
    builder
        .addCase(deleteLink, (state, action) => {
            return {
                ...state,
                isLoading: true,
            };
        })
        .addCase(deleteLinkSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        })
        .addCase(deleteLinkFailed, (state, action) => {
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

async function callAPIDeleteLink(
    linkId: string
): Promise<AxiosResponse<APIResponse>> {
    const response = await API.delete(`/link/${linkId}`);
    return response.data;
}

// saga

export function* deleteLinkSaga() {
    yield takeEvery(deleteLink.type, workerSaga);
}

function* workerSaga(
    action: ReturnType<typeof deleteLink>
): Generator<
    | CallEffect<AxiosResponse<APIResponse>>
    | PutEffect<{ type: string }>
    | SelectEffect,
    void,
    unknown
> {
    try {
        yield call(callAPIDeleteLink, action.payload.linkId);

        yield put({ type: deleteLinkSucceeded.type });
        const subjectScheduleId = yield select(getSelectedSubjectId);
        yield put({
            type: fetchLinks.type,
            payload: { subjectScheduleId: subjectScheduleId },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: deleteLinkFailed.type });
    }
}

// slice

export const deleteLinkSlice = createSlice({
    name: 'deleteLink',
    initialState,
    reducers: {},
    extraReducers: deleteLinkReducer,
});
