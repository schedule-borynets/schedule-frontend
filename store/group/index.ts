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

export type Group = {
    _id: string;
    name: string;
    faculty: string;
    apiId: string;
};

type GroupsState = {
    isLoading: boolean;
    groups: Group[];
};

const initialState: GroupsState = {
    isLoading: false,
    groups: [],
};

// actions
export const fetchGroups = createAction('FETCH_GROUPS');
export const fetchGroupsSucceeded = createAction(
    'FETCH_GROUPS_SUCCEEDED',
    (groups: Group[]) => {
        return {
            payload: {
                groups,
            },
        };
    }
);
export const fetchGroupsFailed = createAction('FETCH_GROUPS_FAILED');

// selectors

export const getIsLoading = (state: any) => state.group.isLoading;

export const getGroups = (state: any) => state.group.groups as Group[];

// reducers

const groupsReducer = (builder: ActionReducerMapBuilder<GroupsState>) => {
    builder
        .addCase(fetchGroups, (state, action) => {
            return {
                ...state,
                isLoading: true,
                groups: [],
            };
        })
        .addCase(fetchGroupsSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                groups: action.payload.groups,
            };
        })
        .addCase(fetchGroupsFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                groups: [],
            };
        });
};
// request

async function callAPIGetGroups(): Promise<AxiosResponse<any>> {
    const response = await API.get(`/group`);
    return response.data;
}

// saga

export function* groupsSaga() {
    yield takeEvery(fetchGroups.type, workerSaga);
}

function* workerSaga(
    action: any
): Generator<
    CallEffect<AxiosResponse<any>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const response = yield call(callAPIGetGroups);

        yield put({
            type: fetchGroupsSucceeded.type,
            payload: { groups: response },
        });
    } catch (err) {
        console.log(err);
        yield put({ type: fetchGroupsFailed.type });
    }
}
// slice

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {},
    extraReducers: groupsReducer,
});
