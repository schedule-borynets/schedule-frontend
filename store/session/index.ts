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
    all,
    call,
    put,
    takeEvery,
} from 'redux-saga/effects';
import { Group } from 'store/group';
import { ProfileInfo } from 'store/profile/get';
import { Teacher } from 'store/teacher';

export type Session = {
    date: string;
    daysLeft: number;
    genericGroupId: string;
    group: string;
    id: string;
    lecturerId: string;
    lecturerName: string;
    room: string;
    subject: string;
    subjectShort: string;
};

type GetSessionState = {
    isLoading: boolean;
    session: Session[] | null;
};

const initialState: GetSessionState = {
    isLoading: false,
    session: null,
};

// actions

export const fetchSession = createAction(
    'FETCH_SESSION_ATTEMPT',
    (groupId: string) => ({ payload: { groupId } })
);

export const fetchSessionSucceeded = createAction(
    'FETCH_SESSION_SUCCEEDED',
    (session: Session[]) => ({
        payload: session,
    })
);

export const fetchSessionFailed = createAction('FETCH_SESSION_FAILED');

// selectors

export const getIsSessionLoading = (state: any): boolean =>
    state.getSession.isLoading;
export const getSession = (state: any): Session[] => state.getSession.session;

// reducers

const getSessionReducer = (
    builder: ActionReducerMapBuilder<GetSessionState>
) => {
    builder
        .addCase(fetchSession, (state, action) => {
            return {
                ...state,
                isLoading: true,
                session: null,
            };
        })
        .addCase(fetchSessionSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                session: action.payload,
            };
        })
        .addCase(fetchSessionFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                session: null,
            };
        });
};

// request

async function callAPIGetSession(
    groupId: string
): Promise<AxiosResponse<Session>> {
    try {
        const response = await axios.get(
            `https://schedule.kpi.ua/api/exams/group?groupId=${groupId}`
        );

        return response.data.data;
    } catch (err) {
        throw err;
    }
}

async function callAPIGetGroup(groupId: string): Promise<AxiosResponse<Group>> {
    try {
        const response = await API.get(`group/${groupId}`);

        return response.data;
    } catch (err) {
        throw err;
    }
}

// saga

export function* getSessionSaga() {
    yield all([takeEvery(fetchSession.type, sessionSaga)]);
}

function* sessionSaga(
    action: ReturnType<typeof fetchSession>
): Generator<
    | CallEffect<AxiosResponse<Session>>
    | CallEffect<AxiosResponse<Group>>
    | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const group = yield call(callAPIGetGroup, action.payload.groupId);
        const groupData = group as Group;

        const response = yield call(callAPIGetSession, groupData.apiId);

        yield put({ type: fetchSessionSucceeded.type, payload: response });
    } catch (err) {
        console.log(err);
        yield put({ type: fetchSessionFailed.type });
    }
}

// slice

export const getSessionSlice = createSlice({
    name: 'getSession',
    initialState,
    reducers: {},
    extraReducers: getSessionReducer,
});
