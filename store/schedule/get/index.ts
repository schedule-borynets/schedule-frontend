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
import { Teacher } from 'store/teacher';

export type Lesson = {
    id: string;
    lecturerId: string;
    name: string;
    place: string;
    tag: string;
    teacherName?: string;
    time: string;
    type: string;
    group?: string;
};

export type DaySchedule = {
    day: string;
    pairs: Lesson[];
};

export type Schedule = {
    scheduleFirstWeek: DaySchedule[];
    scheduleSecondWeek: DaySchedule[];
};

type GetScheduleState = {
    isLoading: boolean;
    groupId: string | null;
    teacherId: string | null;
    groupSchedule: Schedule | null;
    teacherSchedule: Schedule | null;
    week: number | null;
};

const initialState: GetScheduleState = {
    isLoading: false,
    teacherId: null,
    groupId: null,
    teacherSchedule: null,
    groupSchedule: null,
    week: null,
};

// actions

export const fetchGroupSchedule = createAction(
    'FETCH_GROUP_SCHEDULE',
    (groupId: string) => ({ payload: { groupId } })
);

export const fetchGroupScheduleSucceeded = createAction(
    'FETCH_GROUP_SCHEDULE_SUCCEEDED',
    (schedule: Schedule) => ({
        payload: schedule,
    })
);

export const fetchGroupScheduleFailed = createAction(
    'FETCH_GROUP_SCHEDULE_FAILED'
);

export const fetchTeacherSchedule = createAction(
    'FETCH_TEACHER_SCHEDULE',
    (teacherId: string) => ({ payload: { teacherId } })
);

export const fetchTeacherScheduleSucceeded = createAction(
    'FETCH_TEACHER_SCHEDULE_SUCCEEDED',
    (schedule: Schedule) => ({
        payload: schedule,
    })
);

export const fetchTeacherScheduleFailed = createAction(
    'FETCH_TEACHER_SCHEDULE_FAILED'
);

const setWeek = createAction('SET_WEEK', (week: number) => ({
    payload: {
        week,
    },
}));

// selectors

export const getIsLoading = (state: any): boolean =>
    state.getSchedule.isLoading;

export const getGroupId = (state: any): string => state.getSchedule.groupId;
export const getTeacherId = (state: any): string => state.getSchedule.teacherId;

export const getTeacherSchedule = (state: any): Schedule =>
    state.getSchedule.teacherSchedule;
export const getGroupSchedule = (state: any): Schedule =>
    state.getSchedule.groupSchedule;

export const getScheduleWeek = (state: any): number => state.getSchedule.week;
// reducers

const getScheduleReducer = (
    builder: ActionReducerMapBuilder<GetScheduleState>
) => {
    builder
        .addCase(fetchGroupSchedule, (state, action) => {
            return {
                ...state,
                isLoading: true,
                groupId: action.payload.groupId,
                groupSchedule: null,
            };
        })
        .addCase(fetchGroupScheduleSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                groupSchedule: action.payload,
            };
        })
        .addCase(fetchGroupScheduleFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                groupId: null,
                groupSchedule: null,
            };
        })
        .addCase(fetchTeacherSchedule, (state, action) => {
            return {
                ...state,
                isLoading: true,
                teacherId: action.payload.teacherId,
                teacherSchedule: null,
            };
        })
        .addCase(fetchTeacherScheduleSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                teacherSchedule: action.payload,
            };
        })
        .addCase(fetchTeacherScheduleFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                teacherId: null,
                teacherSchedule: null,
            };
        })
        .addCase(setWeek, (state, action) => {
            return {
                ...state,
                week: action.payload.week,
            };
        });
};

// request

async function callAPIGetGroup(groupId: string): Promise<AxiosResponse<Group>> {
    try {
        const response = await API.get(`group/${groupId}`);

        return response.data;
    } catch (err) {
        throw err;
    }
}
async function callAPIGetTeacher(
    teacherId: string
): Promise<AxiosResponse<any>> {
    try {
        const response = await API.get(`teacher/${teacherId}`);

        return response.data;
    } catch (err) {
        throw err;
    }
}

async function callAPIGetGroupSchedule(
    groupId: string
): Promise<AxiosResponse<Schedule>> {
    try {
        const response = await axios.get(
            `https://schedule.kpi.ua/api/schedule/lessons?groupId=${groupId}`
        );

        return response.data.data;
    } catch (err) {
        throw err;
    }
}

async function callAPIGetTeacherSchedule(
    teacherId: string
): Promise<AxiosResponse<Schedule>> {
    try {
        const response = await axios.get(
            `https://schedule.kpi.ua/api/schedule/lecturer?lecturerId=${teacherId}`
        );

        return response.data.data;
    } catch (err) {
        throw err;
    }
}

async function callAPIGetWeek(): Promise<AxiosResponse<Schedule>> {
    try {
        const response = await axios.get(
            `https://schedule.kpi.ua/api/time/current`
        );

        return response.data;
    } catch (err) {
        throw err;
    }
}

// saga

export function* getScheduleSaga() {
    yield all([
        takeEvery(fetchGroupSchedule.type, groupScheduleSaga),
        takeEvery(fetchTeacherSchedule.type, teacherScheduleSaga),
        takeEvery(fetchGroupSchedule.type, timeSaga),
        takeEvery(fetchTeacherSchedule.type, timeSaga),
    ]);
}
function* groupScheduleSaga(
    action: ReturnType<typeof fetchGroupSchedule>
): Generator<
    | CallEffect<AxiosResponse<Schedule>>
    | CallEffect<AxiosResponse<Group>>
    | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const group = yield call(callAPIGetGroup, action.payload.groupId);
        const groupData = group as Group;
        const response = yield call(callAPIGetGroupSchedule, groupData.apiId);

        localStorage.setItem('groupId', action.payload.groupId);

        yield put({
            type: fetchGroupScheduleSucceeded.type,
            payload: response,
        });
    } catch (err) {
        console.log(err);
        yield put(fetchGroupScheduleFailed());
    }
}

function* teacherScheduleSaga(
    action: ReturnType<typeof fetchTeacherSchedule>
): Generator<
    | CallEffect<AxiosResponse<Schedule>>
    | CallEffect<AxiosResponse<Group>>
    | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const teacher = yield call(callAPIGetTeacher, action.payload.teacherId);
        const teacherData = teacher as Teacher;
        const response = yield call(
            callAPIGetTeacherSchedule,
            teacherData.apiId
        );

        localStorage.setItem('teacherId', action.payload.teacherId);

        yield put({
            type: fetchTeacherScheduleSucceeded.type,
            payload: response,
        });
    } catch (err) {
        console.log(err);
        yield put(fetchTeacherScheduleFailed());
    }
}

function* timeSaga(): Generator<CallEffect<AxiosResponse<any>>, void, unknown> {
    try {
        const time = yield call(callAPIGetWeek);
    } catch (err) {}
}

// slice

export const getScheduleSlice = createSlice({
    name: 'getSchedule',
    initialState,
    reducers: {},
    extraReducers: getScheduleReducer,
});
