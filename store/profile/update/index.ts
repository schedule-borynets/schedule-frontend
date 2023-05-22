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
import {
    fetchProfileInfoSucceeded,
    fetchProfileInfoFailed,
    ProfileResponse,
    ProfileInfo,
    fetchProfileInfo,
} from 'store/profile/get';

export type ScheduleType = 'group' | 'teacher';

type UpdateProfilePayload = {
    username?: string | null;
    email?: string | null;
    scheduleType?: ScheduleType | null;
    group?: string | null;
    teacher?: string | null;
};

type ProfileState = {
    isLoading: boolean;
};

const initialState: ProfileState = {
    isLoading: false,
};

// actions

export const updateProfile = createAction(
    'UPDATE_PROFILE_ATTEMPT',
    (profileInfo: UpdateProfilePayload) => ({
        payload: {
            ...profileInfo,
        },
    })
);
export const updateProfileSucceeded = createAction(
    'UPDATE_PROFILE_SUCCEEDED',
    (profile: ProfileResponse) => ({
        payload: {
            ...profile,
        },
    })
);
export const updateProfileFailed = createAction('UPDATE_PROFILE_FAILED');

// selectors

export const getIsLoading = (state: any) => state.updateProfile.isLoading;

// reducers

const updateProfileReducer = (
    builder: ActionReducerMapBuilder<ProfileState>
) => {
    builder
        .addCase(updateProfile, (state, action) => {
            return {
                ...state,
                isLoading: true,
            };
        })
        .addCase(updateProfileSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        })
        .addCase(updateProfileFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
            };
        });
};

// request

async function callAPIUpdateProfileInfo(
    userId: string,
    json: UpdateProfilePayload
): Promise<AxiosResponse<any>> {
    try {
        const response = await API.patch(`/user/${userId}`, json);

        return response.data;
    } catch (err) {
        throw err;
    }
}

// saga

export function* updateProfileSaga() {
    yield takeEvery(updateProfile.type, workerSaga);
}

function* workerSaga(
    action: any
): Generator<
    CallEffect<AxiosResponse<any>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            const response = yield call(
                callAPIUpdateProfileInfo,
                userId,
                action.payload
            );

            const data = response as ProfileResponse;

            const payload = {
                name: data.name,
                email: data.email,
                scheduleType: data.scheduleType,
                groupId: data.group,
                teacherId: data.teacher,
                google: data.googleId,
            };
            yield put({
                type: updateProfileSucceeded.type,
                payload: {
                    ...payload,
                },
            });
            yield put({
                type: fetchProfileInfo.type,
                payload: {
                    userId,
                },
            });
        }
    } catch (err) {
        console.log(err);
        yield put({ type: updateProfileFailed.type });
    }
}

// slice

export const updateProfileSlice = createSlice({
    name: 'updateProfile',
    initialState,
    reducers: {},
    extraReducers: updateProfileReducer,
});
