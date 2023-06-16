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
import {
    ProfileInfo,
    fetchProfileInfoSucceeded,
    getProfileInfo,
} from 'store/profile/get';

type EditScheduleState = {
    isEditing: boolean;
    isLoading: boolean;
    userHiddenSubjects: string[];
    hiddenSubjects: string[];
};

const initialState: EditScheduleState = {
    isEditing: false,
    isLoading: false,
    userHiddenSubjects: [],
    hiddenSubjects: [],
};

// actions

export const editSchedule = createAction('EDIT_SCHEDULE');

export const addHiddenSubject = createAction(
    'ADD_HIDDEN_SUBJECT',
    (subjectId: string) => ({
        payload: {
            subjectId,
        },
    })
);

export const removeHiddenSubject = createAction(
    'REMOVE_HIDDEN_SUBJECT',
    (subjectId: string) => ({
        payload: {
            subjectId,
        },
    })
);

export const saveSchedule = createAction('SAVE_SCHEDULE_ATTEMPT');
export const saveScheduleSucceeded = createAction('SAVE_SCHEDULE_SUCCEEDED');
export const saveScheduleFailed = createAction('SAVE_SCHEDULE_FAILED');

// selectors

export const getIsEditing = (state: any): boolean =>
    state.editSchedule.isEditing;

export const getHiddenSubjects = (state: any): string[] =>
    state.editSchedule.hiddenSubjects;

// reducers

const editScheduleReducer = (
    builder: ActionReducerMapBuilder<EditScheduleState>
) => {
    builder
        .addCase(editSchedule, (state, action) => {
            return {
                ...state,
                isEditing: true,
            };
        })
        .addCase(fetchProfileInfoSucceeded, (state, action) => {
            return {
                ...state,
                userHiddenSubjects: action.payload.hiddenSubjects,
                hiddenSubjects: action.payload.hiddenSubjects,
            };
        })
        .addCase(addHiddenSubject, (state, action) => {
            return {
                ...state,
                hiddenSubjects: [
                    ...state.hiddenSubjects,
                    action.payload.subjectId,
                ],
            };
        })
        .addCase(removeHiddenSubject, (state, action) => {
            return {
                ...state,
                hiddenSubjects: state.hiddenSubjects.filter(
                    (hiddenSubject) =>
                        hiddenSubject !== action.payload.subjectId
                ),
            };
        })
        .addCase(saveSchedule, (state, action) => {
            return {
                ...state,
                isEditing: false,
                isLoading: true,
            };
        })
        .addCase(saveScheduleSucceeded, (state, action) => {
            return {
                ...state,
                isEditing: false,
                isLoading: false,
            };
        })
        .addCase(saveScheduleFailed, (state, action) => {
            return {
                ...state,
                isEditing: false,
                isLoading: false,
            };
        });
};

// request

async function callAPIHiddenSubjectsSchedule(
    userId: string,
    hiddenSubjects: string[]
): Promise<AxiosResponse<ProfileInfo>> {
    const response = await API.patch(`user/${userId}`, {
        hiddenSubjects,
    });
    return response.data;
}

export function* editScheduleSaga() {
    yield takeEvery(saveSchedule.type, saveScheduleSaga);
}

function* saveScheduleSaga(
    action: ReturnType<typeof addHiddenSubject>
): Generator<
    | CallEffect<AxiosResponse<ProfileInfo>>
    | PutEffect<{ type: string }>
    | SelectEffect,
    void,
    unknown
> {
    try {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            const hiddenSubjects = yield select(getHiddenSubjects);
            const profileInfo = yield select(getProfileInfo);
            if (
                JSON.stringify((profileInfo as ProfileInfo).hiddenSubjects) ===
                JSON.stringify(hiddenSubjects)
            ) {
                console.log('no changes');
                return;
            }

            yield call(
                callAPIHiddenSubjectsSchedule,
                userId,
                hiddenSubjects as string[]
            );

            yield put({ type: saveScheduleSucceeded.type });
        } else {
            throw new Error('No user found');
        }
    } catch (err) {
        console.log(err);
        yield put({ type: saveScheduleFailed.type });
    }
}

// slice

export const editScheduleSlice = createSlice({
    name: 'editSchedule',
    initialState,
    reducers: {},
    extraReducers: editScheduleReducer,
});
