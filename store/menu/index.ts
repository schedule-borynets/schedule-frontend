import { ScheduleMenuType } from '@/layout/app-header';

import {
    ActionReducerMapBuilder,
    createAction,
    createSlice,
} from '@reduxjs/toolkit';

type ScheduleMenuItemType = ScheduleMenuType | 'personal';

type MenuState = {
    activeMenuTab: ScheduleMenuItemType | null;
};

const initialState: MenuState = {
    activeMenuTab: null,
};

// actions

export const changeActiveMenuTab = createAction(
    'CHANGE_ACTIVE_MENU_TAB',
    (menuTab: ScheduleMenuItemType | null) => ({
        payload: {
            menuTab,
        },
    })
);
// selectors

export const getActiveMenuTab = (state: any) =>
    state.menu.activeMenuTab as ScheduleMenuItemType;

// reducers

const menuReducer = (builder: ActionReducerMapBuilder<MenuState>) => {
    builder.addCase(changeActiveMenuTab, (state, action) => {
        return {
            ...state,
            activeMenuTab: action.payload.menuTab,
        };
    });
};

// slice

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {},
    extraReducers: menuReducer,
});
