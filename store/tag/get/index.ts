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

export type Tag = {
    _id: string;

    text: string;

    color?: string | null;

    subjects?: string[];
};

type TagsState = {
    isLoading: boolean;
    tags: Tag[];
};

const initialState: TagsState = {
    isLoading: false,
    tags: [],
};

// actions

export const fetchTags = createAction(
    'FETCH_TAGS',
    (subjectScheduleId: string) => ({
        payload: {
            subjectScheduleId,
        },
    })
);

export const fetchTagsSucceeded = createAction(
    'FETCH_TAGS_SUCCEEDED',
    (tags: Tag[]) => {
        return {
            payload: {
                tags: tags,
            },
        };
    }
);
export const fetchTagsFailed = createAction('FETCH_TAGS_FAILED');

// selectors

export const getIsLoading = (state: any) => state.tag.isLoading;

export const getTags = (state: any) => state.tag.tags as Tag[];

// reducers

const tagsReducer = (builder: ActionReducerMapBuilder<TagsState>) => {
    builder
        .addCase(fetchTags, (state, action) => {
            return {
                ...state,
                isLoading: true,
                tags: [],
            };
        })
        .addCase(fetchTagsSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                tags: action.payload.tags,
            };
        })
        .addCase(fetchTagsFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                tags: [],
            };
        });
};
// request

async function callAPIGetTagsForSubjectSchedule(
    subjectScheduleId: string
): Promise<AxiosResponse<Tag[]>> {
    const response = await API.get(
        `/tag/subject-schedule/${subjectScheduleId}`
    );
    return response.data;
}

// saga

export function* tagsSaga() {
    yield takeEvery(fetchTags.type, workerSaga);
}

function* workerSaga(
    action: ReturnType<typeof fetchTags>
): Generator<
    CallEffect<AxiosResponse<Tag[]>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const response = yield call(
            callAPIGetTagsForSubjectSchedule,
            action.payload.subjectScheduleId
        );

        yield put({
            type: fetchTagsSucceeded.type,
            payload: { tags: response },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: fetchTagsFailed.type });
    }
}
// slice

export const tagSlice = createSlice({
    name: 'tag',
    initialState,
    reducers: {},
    extraReducers: tagsReducer,
});
