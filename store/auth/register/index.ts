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
import { loginUserSucceeded } from 'store/auth/login';

type RegisterUserPayload = {
    email: string;
    password: string;
    name: string;
};

type RegisterState = {
    isLoading: boolean;
    successfullyRegistered: boolean;
    errorWhileRegistration: boolean;
};

const initialState: RegisterState = {
    isLoading: false,
    successfullyRegistered: false,
    errorWhileRegistration: false,
};

// actions

export const registerUser = createAction(
    'REGISTER_USER_ATTEMPT',
    (user: RegisterUserPayload) => ({
        payload: {
            ...user,
        },
    })
);

export const registerUserSucceeded = createAction('REGISTER_USER_SUCCEEDED');

export const registerUserFailed = createAction('REGISTER_USER_FAILED');

// selectors

export const getIsLoading = (state: any) => state.register.isLoading;

export const getErrorWhileRegistration = (state: any) =>
    state.register.errorWhileRegistration;

// reducers

const registerReducer = (builder: ActionReducerMapBuilder<RegisterState>) => {
    builder
        .addCase(registerUser, (state, action) => {
            return {
                ...state,
                isLoading: true,
                successfullyRegistered: false,
                errorWhileRegistration: false,
            };
        })
        .addCase(registerUserSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                successfullyRegistered: true,
                errorWhileRegistration: false,
            };
        })
        .addCase(registerUserFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                successfullyRegistered: true,
                errorWhileRegistration: true,
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

async function callAPIRegister(json: any): Promise<AxiosResponse<APIResponse>> {
    const response = await API.post('/auth/register', json);
    return response.data;
}

// saga

export function* registerSaga() {
    yield takeEvery(registerUser.type, workerSaga);
}

function* workerSaga(
    action: any
): Generator<
    CallEffect<AxiosResponse<APIResponse>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const response = yield call(callAPIRegister, action.payload);

        const responseData = response as APIResponse;

        localStorage.setItem('access_token', responseData.access_token);
        localStorage.setItem('refresh_token', responseData.refresh_token);
        localStorage.setItem('user_id', responseData.user.id);

        yield put({ type: registerUserSucceeded.type });
        yield put({ type: loginUserSucceeded.type });
    } catch (err) {
        console.log(err);
        yield put({ type: registerUserFailed.type });
    }
}

// slice

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {},
    extraReducers: registerReducer,
});
