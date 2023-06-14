import {
    ActionReducerMapBuilder,
    createAction,
    createSlice,
} from '@reduxjs/toolkit'
import { API } from 'api'
import { AxiosResponse } from 'axios'
import { CallEffect, PutEffect, call, put, takeEvery } from 'redux-saga/effects'

export type ScheduleLink = {
    _id: string
    link: string
    description: string
    user: string
    subjectSchedule: string
}

type LinksState = {
    isLoading: boolean
    links: ScheduleLink[]
}

const initialState: LinksState = {
    isLoading: false,
    links: [],
}

// actions

export const fetchLinks = createAction(
    'FETCH_LINKS',
    (subjectScheduleId: string) => ({
        payload: {
            subjectScheduleId,
        },
    })
)

export const fetchLinksSucceeded = createAction(
    'FETCH_LINKS_SUCCEEDED',
    (links: ScheduleLink[]) => {
        return {
            payload: {
                links,
            },
        }
    }
)
export const fetchLinksFailed = createAction('FETCH_LINKS_FAILED')

// selectors

export const getIsLoading = (state: any) => state.getLinks.isLoading

export const getLinks = (state: any) => state.getLinks.links as ScheduleLink[]

// reducers

const linksReducer = (builder: ActionReducerMapBuilder<LinksState>) => {
    builder
        .addCase(fetchLinks, (state, action) => {
            return {
                ...state,
                isLoading: true,
                links: [],
            }
        })
        .addCase(fetchLinksSucceeded, (state, action) => {
            return {
                ...state,
                isLoading: false,
                links: action.payload.links,
            }
        })
        .addCase(fetchLinksFailed, (state, action) => {
            return {
                ...state,
                isLoading: false,
                links: [],
            }
        })
}
// request

async function callAPIGetLinks(
    subjectScheduleId: string
): Promise<AxiosResponse<ScheduleLink[]>> {
    try {
        const response = await API.get(
            `/link/subject-schedule/${subjectScheduleId}`
        )

        return response.data
    } catch (err) {
        throw err
    }
}

// saga

export function* getLinksSaga() {
    yield takeEvery(fetchLinks.type, workerSaga)
}

function* workerSaga(
    action: ReturnType<typeof fetchLinks>
): Generator<
    CallEffect<AxiosResponse<ScheduleLink[]>> | PutEffect<{ type: string }>,
    void,
    unknown
> {
    try {
        const response = yield call(
            callAPIGetLinks,
            action.payload.subjectScheduleId
        )

        yield put({
            type: fetchLinksSucceeded.type,
            payload: { links: response },
        })
    } catch (err) {
        console.log(err)
        yield put({ type: fetchLinksFailed.type })
    }
}
// slice

export const getLinksSlice = createSlice({
    name: 'getLinks',
    initialState,
    reducers: {},
    extraReducers: linksReducer,
})
