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
import { fetchTags } from 'store/tag/get';
import { getSelectedSubjectId } from 'store/subject/open-info-panel';

type DeleteTagState = {
    isLoading: boolean;
};

const initialState: DeleteTagState = {
    isLoading: false,
};

// actions

export const deleteTag = createAction(
    'DELETE_TAG_ATTEMPT',
    (tagId: string) => ({
        payload: {
            tagId,
        },
    })
);

export const deleteTagSucceeded = createAction('DELETE_TAG_SUCCEEDED');

export const deleteTagFailed = createAction('DELETE_TAG_FAILED');

// selectors

export const getIsLoading = (state: any) => state.deleteTag.isLoading;

// reducers

const deleteTagReducer = (builder: ActionReducerMapBuilder<DeleteTagState>) => {
    builder
        .addCase(deleteTag, (state, action) => {
            return {
                ...state,
                isLoading: true,
            };
        })
        .addCase(deleteTagSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        })
        .addCase(deleteTagFailed, (state, action) => {
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

async function callAPIDeleteTag(
    tagId: string
): Promise<AxiosResponse<APIResponse>> {
    const response = await API.delete(`/tag/${tagId}`);
    return response.data;
}

// saga

export function* deleteTagSaga() {
    yield takeEvery(deleteTag.type, workerSaga);
}

function* workerSaga(
    action: ReturnType<typeof deleteTag>
): Generator<
    | CallEffect<AxiosResponse<APIResponse>>
    | PutEffect<{ type: string }>
    | SelectEffect,
    void,
    unknown
> {
    try {
        yield call(callAPIDeleteTag, action.payload.tagId);

        yield put({ type: deleteTagSucceeded.type });
        const subjectScheduleId = yield select(getSelectedSubjectId);
        yield put({
            type: fetchTags.type,
            payload: { subjectScheduleId: subjectScheduleId },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: deleteTagFailed.type });
    }
}

// slice

export const deleteTagSlice = createSlice({
    name: 'deleteTag',
    initialState,
    reducers: {},
    extraReducers: deleteTagReducer,
});
