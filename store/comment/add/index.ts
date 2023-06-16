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
import { fetchComments } from 'store/comment/get';
import { getSelectedSubjectId } from 'store/subject/open-info-panel';

type CreateCommentPayload = {
    text: string;
    subjectSchedule: string;
    priority?: number;
};

type AddCommentState = {
    isLoading: boolean;
};

const initialState: AddCommentState = {
    isLoading: false,
};

// actions

export const addComment = createAction(
    'ADD_COMMENT_ATTEMPT',
    (comment: CreateCommentPayload) => ({
        payload: {
            ...comment,
        },
    })
);

export const addCommentSucceeded = createAction('ADD_COMMENT_SUCCEEDED');

export const addCommentFailed = createAction('ADD_COMMENT_FAILED');

// selectors

export const getIsLoading = (state: any) => state.addComment.isLoading;

// reducers

const addCommentReducer = (
    builder: ActionReducerMapBuilder<AddCommentState>
) => {
    builder
        .addCase(addComment, (state, action) => {
            return {
                ...state,
                isLoading: true,
            };
        })
        .addCase(addCommentSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        })
        .addCase(addCommentFailed, (state, action) => {
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

async function callAPIAddComment(
    json: CreateCommentPayload & {
        user: string;
    }
): Promise<AxiosResponse<APIResponse>> {
    const response = await API.post('/comment', json);
    return response.data;
}

// saga

export function* addCommentSaga() {
    yield takeEvery(addComment.type, workerSaga);
}

function* workerSaga(
    action: ReturnType<typeof addComment>
): Generator<
    | CallEffect<AxiosResponse<APIResponse>>
    | PutEffect<{ type: string }>
    | SelectEffect,
    void,
    unknown
> {
    try {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            yield call(callAPIAddComment, { ...action.payload, user: userId });

            yield put({ type: addCommentSucceeded.type });
            const subjectScheduleId = yield select(getSelectedSubjectId);
            yield put({
                type: fetchComments.type,
                payload: { subjectScheduleId: subjectScheduleId },
            });
        } else {
            throw new Error('No user found');
        }
    } catch (err) {
        console.log(err);
        yield put({ type: addCommentFailed.type });
    }
}

// slice

export const addCommentSlice = createSlice({
    name: 'addComment',
    initialState,
    reducers: {},
    extraReducers: addCommentReducer,
});
