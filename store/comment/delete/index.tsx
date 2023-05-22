import {
    ActionReducerMapBuilder,
    createAction,
    createSlice,
} from '@reduxjs/toolkit';
import { API } from 'api';
import axios, { AxiosResponse } from 'axios';
import {
    CallEffect,
    PutEffect,
    SelectEffect,
    call,
    put,
    select,
    takeEvery,
} from 'redux-saga/effects';
import { loginUserSucceeded } from 'store/auth/login';
import { fetchComments } from 'store/comment/get';
import { getSelectedSubjectId } from 'store/subject/open-info-panel';

type DeleteCommentState = {
    isLoading: boolean;
};

const initialState: DeleteCommentState = {
    isLoading: false,
};

// actions

export const deleteComment = createAction(
    'DELETE_COMMENT_ATTEMPT',
    (commentId: string) => ({
        payload: {
            commentId,
        },
    })
);

export const deleteCommentSucceeded = createAction('DELETE_COMMENT_SUCCEEDED');

export const deleteCommentFailed = createAction('DELETE_COMMENT_FAILED');

// selectors

export const getIsLoading = (state: any) => state.deleteComment.isLoading;

// reducers

const deleteCommentReducer = (
    builder: ActionReducerMapBuilder<DeleteCommentState>
) => {
    builder
        .addCase(deleteComment, (state, action) => {
            return {
                ...state,
                isLoading: true,
            };
        })
        .addCase(deleteCommentSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        })
        .addCase(deleteCommentFailed, (state, action) => {
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

async function callAPIDeleteComment(
    commentId: string
): Promise<AxiosResponse<APIResponse>> {
    try {
        const response = await API.delete(`/comment/${commentId}`);
        return response.data;
    } catch (err) {
        throw err;
    }
}

// saga

export function* deleteCommentSaga() {
    yield takeEvery(deleteComment.type, workerSaga);
}

function* workerSaga(
    action: ReturnType<typeof deleteComment>
): Generator<
    | CallEffect<AxiosResponse<APIResponse>>
    | PutEffect<{ type: string }>
    | SelectEffect,
    void,
    unknown
> {
    try {
        yield call(callAPIDeleteComment, action.payload.commentId);

        yield put({ type: deleteCommentSucceeded.type });
        const subjectScheduleId = yield select(getSelectedSubjectId);
        yield put({
            type: fetchComments.type,
            payload: { subjectScheduleId: subjectScheduleId },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: deleteCommentFailed.type });
    }
}

// slice

export const deleteCommentSlice = createSlice({
    name: 'deleteComment',
    initialState,
    reducers: {},
    extraReducers: deleteCommentReducer,
});
