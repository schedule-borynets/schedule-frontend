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
import { logoutUserSucceeded } from 'store/auth/logout';

type LoginUserPayload = {
    email: string;
    password: string;
};

type LoginState = {
    isLoading: boolean;
    isLoggedIn: boolean;
    errorWhileLoggingIn: boolean;
};

const initialState: LoginState = {
    isLoading: false,
    isLoggedIn: false,
    errorWhileLoggingIn: false,
};

// actions

export const loginUser = createAction(
    'LOGIN_USER_ATTEMPT',
    (user: LoginUserPayload) => ({
        payload: {
            ...user,
        },
    })
);

export const loginUserSucceeded = createAction('LOGIN_USER_SUCCEEDED');
export const loginUserFailed = createAction('LOGIN_USER_FAILED');

export const setUserLoggedIn = createAction('SET_USER_LOGGED_IN');

// selectors

export const getIsLoading = (state: any) => state.login.isLoading;

export const getIsUserLoggedIn = (state: any) => state.login.isLoggedIn;

export const getErrorWhileLoggingIn = (state: any) =>
    state.login.errorWhileLoggingIn;
// reducers

const loginReducer = (builder: ActionReducerMapBuilder<LoginState>) => {
    builder
        .addCase(loginUser, (state, action) => {
            return {
                ...state,
                isLoading: true,
                isLoggedIn: false,
                errorWhileLoggingIn: false,
            };
        })
        .addCase(loginUserSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                isLoggedIn: true,
                errorWhileLoggingIn: false,
            };
        })
        .addCase(loginUserFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                isLoggedIn: false,
                errorWhileLoggingIn: true,
            };
        })
        .addCase(setUserLoggedIn, (state, action) => {
            return {
                ...initialState,
                isLoggedIn: true,
            };
        })
        .addCase(logoutUserSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                isLoggedIn: false,
                errorWhileLoggingIn: false,
            };
        });
};
// request

type APIResponse = {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
    };
};

async function callAPILogin(json: any): Promise<AxiosResponse<APIResponse>> {
    const response = await API.post('/auth/login', json);
    return response.data;
}

// saga

export function* loginSaga() {
    yield takeEvery(loginUser.type, workerSaga);
}

function* workerSaga(
    action: any
): Generator<
    CallEffect<AxiosResponse<APIResponse>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const response = yield call(callAPILogin, action.payload);

        const responseData = response as APIResponse;

        localStorage.setItem('access_token', responseData.access_token);
        localStorage.setItem('refresh_token', responseData.refresh_token);
        localStorage.setItem('user_id', responseData.user.id);

        yield put({ type: loginUserSucceeded.type });
    } catch (error) {
        yield put({ type: loginUserFailed.type });
    }
}
// slice

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {},
    extraReducers: loginReducer,
});
