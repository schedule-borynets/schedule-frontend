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

export type Comment = {
    _id: string;
    text: string;
    priority: number;
    creationTime: Date;
};

type CommentsState = {
    isLoading: boolean;
    comments: Comment[];
};

const initialState: CommentsState = {
    isLoading: false,
    comments: [],
};

// actions

export const fetchComments = createAction(
    'FETCH_COMMENTS',
    (subjectScheduleId: string) => ({
        payload: {
            subjectScheduleId,
        },
    })
);

export const fetchCommentsSucceeded = createAction(
    'FETCH_COMMENTS_SUCCEEDED',
    (comments: Comment[]) => {
        return {
            payload: {
                comments: comments,
            },
        };
    }
);
export const fetchCommentsFailed = createAction('FETCH_COMMENTS_FAILED');

// selectors

export const getIsLoading = (state: any) => state.comment.isLoading;

export const getComments = (state: any) => state.comment.comments as Comment[];

// reducers

const commentsReducer = (builder: ActionReducerMapBuilder<CommentsState>) => {
    builder
        .addCase(fetchComments, (state, action) => {
            return {
                ...state,
                isLoading: true,
                comments: [],
            };
        })
        .addCase(fetchCommentsSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                comments: action.payload.comments,
            };
        })
        .addCase(fetchCommentsFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                comments: [],
            };
        });
};
// request

async function callAPIGetComments(
    subjectScheduleId: string
): Promise<AxiosResponse<Comment[]>> {
    const response = await API.get(
        `/comment/subject-schedule/${subjectScheduleId}`
    );
    return response.data;
}

// saga

export function* commentsSaga() {
    yield takeEvery(fetchComments.type, workerSaga);
}

function* workerSaga(
    action: ReturnType<typeof fetchComments>
): Generator<
    CallEffect<AxiosResponse<Comment[]>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const response = yield call(
            callAPIGetComments,
            action.payload.subjectScheduleId
        );

        yield put({
            type: fetchCommentsSucceeded.type,
            payload: { comments: response },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: fetchCommentsFailed.type });
    }
}
// slice

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: commentsReducer,
});
