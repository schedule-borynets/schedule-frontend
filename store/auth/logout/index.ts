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
    call,
    put,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';

type logoutUserPayload = {
    email: string;
    password: string;
};

type logoutState = {
    isLoading: boolean;
    errorWhileLoggingOut: boolean;
};

const initialState: logoutState = {
    isLoading: false,
    errorWhileLoggingOut: false,
};

// actions

export const logoutUser = createAction('LOGOUT_USER_ATTEMPT');

export const logoutUserSucceeded = createAction('LOGOUT_USER_SUCCEEDED');
export const logoutUserFailed = createAction(
    'LOGOUT_USER_FAILED',
    (error: any) => ({
        payload: { error },
    })
);

// selectors

export const getIsLoading = (state: any) => state.logout.isLoading;

export const getErrorWhileLoggingOut = (state: any) =>
    state.logout.errorWhileLoggingOut;
// reducers

const logoutReducer = (builder: ActionReducerMapBuilder<logoutState>) => {
    builder
        .addCase(logoutUser, (state, action) => {
            return {
                ...state,
                isLoading: true,
                errorWhileLoggingOut: false,
            };
        })
        .addCase(logoutUserSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                errorWhileLoggingOut: false,
            };
        })
        .addCase(logoutUserFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                errorWhileLoggingOut: true,
            };
        });
};
// request

async function callAPIlogout(json: {
    refresh_token: string;
}): Promise<AxiosResponse<any>> {
    try {
        const response = await API.post('/auth/logout', json);

        return response.data;
    } catch (err) {
        throw err;
    }
}

// saga

export function* logoutSaga() {
    yield takeLatest(logoutUser.type, workerSaga);
}

function* workerSaga(
    action: any
): Generator<
    CallEffect<AxiosResponse<any>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const token = localStorage.getItem('refresh_token');

        if (token) {
            const response = yield call(callAPIlogout, {
                refresh_token: token,
            });

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');

            yield put({ type: logoutUserSucceeded.type });
        } else {
            throw new Error("Token not found, can't log out");
        }
    } catch (err) {
        console.log(err);
        yield put({
            type: logoutUserFailed.type,
            payload: (err as Error).message,
        });
    }
}
// slice

export const logoutSlice = createSlice({
    name: 'logout',
    initialState,
    reducers: {},
    extraReducers: logoutReducer,
});
