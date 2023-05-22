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
    all,
    call,
    put,
    takeEvery,
} from 'redux-saga/effects';
import { logoutUserSucceeded } from 'store/auth/logout';
import { Group } from 'store/group';
import { ProfileInfo } from 'store/profile/get';
import { Teacher } from 'store/teacher';

type Subject = { _id: string; name: string };

export type SubjectSchedule = {
    _id: string;
    day: string;
    groups: Group[];
    lessonType: string;
    location: string;
    subject: Subject;
    teacher: Teacher;
    time: string;
    week: number;
};

type GetScheduleState = {
    isLoading: boolean;
    subjectSchedule: SubjectSchedule[];
};

const initialState: GetScheduleState = {
    isLoading: false,
    subjectSchedule: [],
};

// actions

export const fetchSubjectSchedule = createAction(
    'FETCH_SUBJECT_SCHEDULE_ATTEMPT',
    (profileInfo: ProfileInfo) => ({
        payload: {
            ...profileInfo,
        },
    })
);

export const fetchGroupSchedule = createAction(
    'FETCH_GROUP_SUBJECT_SCHEDULE',
    (groupId: string) => ({ payload: { groupId, scheduleType: 'group' } })
);

export const fetchTeacherSchedule = createAction(
    'FETCH_TEACHER_SUBJECT_SCHEDULE',
    (teacherId: string) => ({ payload: { teacherId, scheduleType: 'teacher' } })
);

export const fetchSubjectScheduleSucceeded = createAction(
    'FETCH_SUBJECT_SCHEDULE_SUCCEEDED',
    (subjectSchedule: SubjectSchedule[]) => ({
        payload: subjectSchedule,
    })
);

export const fetchSubjectScheduleFailed = createAction(
    'FETCH_SUBJECT_SCHEDULE_FAILED'
);

// selectors

export const getIsLoading = (state: any): boolean =>
    state.getSubjectSchedule.isLoading;
export const getSubjectSchedule = (state: any): SubjectSchedule[] =>
    state.getSubjectSchedule.subjectSchedule;

// reducers

const getSubjectScheduleReducer = (
    builder: ActionReducerMapBuilder<GetScheduleState>
) => {
    builder
        .addCase(fetchSubjectSchedule, (state, action) => {
            return {
                ...state,
                isLoading: true,
                subjectSchedule: [],
            };
        })
        .addCase(fetchSubjectScheduleSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                subjectSchedule: action.payload,
            };
        })
        .addCase(fetchSubjectScheduleFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                subjectSchedule: [],
            };
        })
        .addCase(logoutUserSucceeded, (state, action) => {
            return {
                ...state,
                subjectSchedule: [],
            };
        });
};

// request

async function callAPIGetSubjectScheduleForGroup(
    groupId: string
): Promise<AxiosResponse<Group>> {
    try {
        const response = await API.get(`subject-schedule/group/${groupId}`);

        return response.data;
    } catch (err) {
        throw err;
    }
}
async function callAPIGetSubjectScheduleForTeacher(
    teacherId: string
): Promise<AxiosResponse<any>> {
    try {
        const response = await API.get(`subject-schedule/teacher/${teacherId}`);

        return response.data;
    } catch (err) {
        throw err;
    }
}

// saga

export function* getSubjectScheduleSaga() {
    yield all([
        takeEvery(fetchSubjectSchedule.type, subjectScheduleSaga),
        takeEvery(fetchGroupSchedule.type, subjectScheduleSaga),
        takeEvery(fetchTeacherSchedule.type, subjectScheduleSaga),
    ]);
}

function* subjectScheduleSaga(
    action: ReturnType<typeof fetchSubjectSchedule>
): Generator<
    | CallEffect<AxiosResponse<SubjectSchedule[]>>
    | CallEffect<AxiosResponse<Group>>
    | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const scheduleType = action.payload.scheduleType;
        if (scheduleType === 'group' && action.payload.groupId) {
            const response = yield call(
                callAPIGetSubjectScheduleForGroup,
                action.payload.groupId
            );

            yield put({
                type: fetchSubjectScheduleSucceeded.type,
                payload: response as SubjectSchedule[],
            });
        } else if (scheduleType === 'teacher' && action.payload.teacherId) {
            const response = yield call(
                callAPIGetSubjectScheduleForTeacher,
                action.payload.teacherId
            );

            yield put({
                type: fetchSubjectScheduleSucceeded.type,
                payload: response as SubjectSchedule[],
            });
        }
    } catch (err) {
        console.log(err);
        yield put({ type: fetchSubjectScheduleFailed.type });
    }
}

// slice

export const getSubjectScheduleSlice = createSlice({
    name: 'getSubjectSchedule',
    initialState,
    reducers: {},
    extraReducers: getSubjectScheduleReducer,
});
