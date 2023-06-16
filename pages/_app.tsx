import type { AppProps } from 'next/app';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { ConfigProvider, Layout, theme } from 'antd';
import { wrapper } from 'store';
import styled, { createGlobalStyle } from 'styled-components';
import { getIsThemeDark } from 'store/theme';
import AppHeader from '@/layout/app-header';
import { useEffect } from 'react';
import { setUserLoggedIn } from 'store/auth/login';
import { fetchGroups } from 'store/group';
import { fetchTeachers } from 'store/teacher';
import { fetchProfileInfo } from 'store/profile/get';
import { fetchGroupSchedule, fetchTeacherSchedule } from 'store/schedule/get';
import { fetchSession } from 'store/session';

function MyApp({ Component, ...rest }: AppProps) {
    const dispatch = useDispatch();

    const { store, props } = wrapper.useWrappedStore(rest);

    const { emotionCache, pageProps } = props;

    const isThemeDark = useSelector(getIsThemeDark);
    useEffect(() => {
        dispatch(fetchGroups());
        dispatch(fetchTeachers());
        const groupId = localStorage.getItem('groupId');
        const teacherId = localStorage.getItem('teacherId');

        if (groupId) {
            dispatch(fetchGroupSchedule(groupId));
            dispatch(fetchSession(groupId));
        }
        if (teacherId) {
            dispatch(fetchTeacherSchedule(teacherId));
        }
    }, [dispatch]);
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            dispatch(setUserLoggedIn());
            dispatch(fetchProfileInfo(userId));
        }
    });

    return (
        <Provider store={store}>
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 16,
                        colorWarning: '#f07d00',
                        colorInfo: '#a2a2a2',
                        colorError: '#ff3326',
                        colorPrimary: '#008acf',
                        colorSuccess: '#48d66f',
                    },
                    algorithm: isThemeDark
                        ? theme.darkAlgorithm
                        : theme.defaultAlgorithm,
                }}
            >
                <GlobalStyle />
                <Layout style={{ height: '100vh' }}>
                    <AppHeader />
                    <ContentContainer>
                        <Component {...pageProps} />
                    </ContentContainer>
                </Layout>
            </ConfigProvider>
        </Provider>
    );
}
const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
    }
`;

const ContentContainer = styled.div`
    height: 100%;
`;
export default wrapper.withRedux(MyApp);
