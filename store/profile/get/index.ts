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
import { logoutUser } from 'store/auth/logout';
import { ScheduleType } from 'store/profile/update';

import { fetchSubjectSchedule } from 'store/subject/schedule';

export type ProfileInfo = {
    name: string | null;
    email: string | null;
    scheduleType: ScheduleType | null;
    groupId: string | null;
    teacherId: string | null;
    googleAccount: string | null;
    hiddenSubjects: string[];
};

export type ProfileResponse = {
    name: string | null;
    email: string | null;
    scheduleType: ScheduleType | null;
    group: string | null;
    teacher: string | null;
    googleId: string | null;
    hiddenSubjects: string[];
};

type GetProfileInfoState = ProfileInfo & {
    isLoading: boolean;
};

const initialState: GetProfileInfoState = {
    isLoading: false,
    name: null,
    email: null,
    scheduleType: null,
    groupId: null,
    teacherId: null,
    googleAccount: null,
    hiddenSubjects: [],
};

// actions

export const fetchProfileInfo = createAction(
    'FETCH_PROFILE_INFO_ATTEMPT',
    (userId: string) => ({
        payload: {
            userId,
        },
    })
);

export const fetchProfileInfoSucceeded = createAction(
    'FETCH_PROFILE_INFO_SUCCEEDED',
    (userInfo: ProfileInfo) => ({
        payload: {
            ...userInfo,
        },
    })
);
export const fetchProfileInfoFailed = createAction('FETCH_PROFILE_INFO_FAILED');

// selectors

export const getIsLoading = (state: any) => state.getProfileInfo.isLoading;
export const getProfileInfo = (state: any) =>
    state.getProfileInfo as ProfileInfo;

// reducers

const getProfileInfoReducer = (
    builder: ActionReducerMapBuilder<GetProfileInfoState>
) => {
    builder
        .addCase(fetchProfileInfo, (state, action) => {
            return {
                ...state,
                ...initialState,
                isLoading: true,
            };
        })
        .addCase(fetchProfileInfoSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                name: action.payload.name,
                email: action.payload.email,

                scheduleType: action.payload.scheduleType,
                groupId: action.payload.groupId,
                teacherId: action.payload.teacherId,
                googleAccount: action.payload.googleAccount,
                hiddenSubjects: action.payload.hiddenSubjects,
            };
        })
        .addCase(fetchProfileInfoFailed, (state, action) => {
            return {
                ...state,
                ...initialState,
                isLoading: false,
            };
        })
        .addCase(logoutUser, (state, action) => {
            return {
                ...initialState,
            };
        });
};

// request

async function callAPIGetProfileInfo(
    userId: string
): Promise<AxiosResponse<ProfileInfo>> {
    const response = await API.get(`/user/${userId}`);
    return response.data;
}

// saga

export function* getProfileInfoSaga() {
    yield takeEvery(fetchProfileInfo.type, workerSaga);
}

function* workerSaga(
    action: any
): Generator<
    CallEffect<AxiosResponse<ProfileInfo>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const response = yield call(
            callAPIGetProfileInfo,
            action.payload.userId
        );
        const data = response as ProfileResponse;

        const payload = {
            name: data.name,
            email: data.email,
            scheduleType: data.scheduleType,
            groupId: data.group,
            teacherId: data.teacher,
            google: data.googleId,
            hiddenSubjects: data.hiddenSubjects,
        };

        yield put({
            type: fetchProfileInfoSucceeded.type,
            payload: {
                ...payload,
            },
        });

        yield put({
            type: fetchSubjectSchedule.type,
            payload: {
                ...payload,
            },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: fetchProfileInfoFailed.type });
    }
}
// slice

export const getProfileInfoSlice = createSlice({
    name: 'getProfileInfo',
    initialState,
    reducers: {},
    extraReducers: getProfileInfoReducer,
});
