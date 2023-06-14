import {
    Action,
    ActionReducerMapBuilder,
    createAction,
    createSlice,
} from '@reduxjs/toolkit';
import { API } from 'api';
import axios, { AxiosResponse } from 'axios';
import {
    CallEffect,
    PutEffect,
    apply,
    call,
    put,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';

export type Teacher = {
    _id: string;
    name: string;
    apiId: string;
};

type TeachersState = {
    isLoading: boolean;
    teachers: Teacher[];
};

const initialState: TeachersState = {
    isLoading: false,
    teachers: [],
};

// actions
export const fetchTeachers = createAction('FETCH_TEACHERS');
export const fetchTeachersSucceeded = createAction(
    'FETCH_TEACHERS_SUCCEEDED',
    (teachers: Teacher[]) => {
        return {
            payload: {
                teachers,
            },
        };
    }
);
export const fetchTeachersFailed = createAction('FETCH_TEACHERS_FAILED');

// selectors

export const getIsLoading = (state: any) => state.teacher.isLoading;

export const getTeachers = (state: any) => state.teacher.teachers as Teacher[];

// reducers

const teachersReducer = (builder: ActionReducerMapBuilder<TeachersState>) => {
    builder
        .addCase(fetchTeachers, (state, action) => {
            return {
                ...state,
                isLoading: true,
                teachers: [],
            };
        })
        .addCase(fetchTeachersSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                teachers: action.payload.teachers,
            };
        })
        .addCase(fetchTeachersFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                teachers: [],
            };
        });
};
// request

async function callAPIGetTeachers(): Promise<AxiosResponse<any>> {
    try {
        const response = await API.get(`/teacher`);

        return response.data;
    } catch (err) {
        throw err;
    }
}

// saga

export function* teachersSaga() {
    yield takeEvery(fetchTeachers.type, workerSaga);
}

function* workerSaga(
    action: any
): Generator<
    CallEffect<AxiosResponse<any>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const response = yield call(callAPIGetTeachers);

        yield put({
            type: fetchTeachersSucceeded.type,
            payload: { teachers: response },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: fetchTeachersFailed.type });
    }
}
// slice

export const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {},
    extraReducers: teachersReducer,
});
