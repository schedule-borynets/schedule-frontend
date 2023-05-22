import {
    ActionReducerMapBuilder,
    createAction,
    createSlice,
} from '@reduxjs/toolkit';

type ThemeState = {
    isDarkTheme: boolean;
};

const initialState: ThemeState = {
    isDarkTheme: false,
};

// actions

export const switchTheme = createAction('SWITCH_THEME');

// selectors

export const getIsThemeDark = (state: any) => state.theme.isDarkTheme;

// reducers

const themeReducer = (builder: ActionReducerMapBuilder<ThemeState>) => {
    builder.addCase(switchTheme, (state, action) => {
        return {
            ...state,
            isDarkTheme: !state.isDarkTheme,
        };
    });
};

// slice

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {},
    extraReducers: themeReducer,
});
