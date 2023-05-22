import { CheckOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Select, Switch, Button } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { getIsThemeDark, switchTheme } from 'store/theme';
import styled from 'styled-components';
import * as colors from '@ant-design/colors';
import Link from 'next/link';
import { getIsUserLoggedIn } from 'store/auth/login';
import { useEffect, useState } from 'react';
import { getProfileInfo } from 'store/profile/get';
import { ScheduleType } from 'store/profile/update';
import { getGroups } from 'store/group';
import { getTeachers } from 'store/teacher';

import { useRouter } from 'next/router';
import { Routes } from 'routes';
import { changeActiveMenuTab, getActiveMenuTab } from 'store/menu';
import { getGroupId, getTeacherId } from 'store/schedule/get';
import { fetchGroupSchedule, fetchTeacherSchedule } from 'store/schedule/get';
import { fetchSession } from 'store/session';

const { Header, Content } = Layout;
const { Option } = Select;
const palette = colors.presetDarkPalettes.grey;

export type ScheduleMenuType = ScheduleType | 'session';

const AppHeader = () => {
    const dispatch = useDispatch();

    const theme = useSelector(getIsThemeDark);
    const [profileLink, setProfileLink] = useState('/profile');

    const isLoggedIn = useSelector(getIsUserLoggedIn);
    const { scheduleType } = useSelector(getProfileInfo);
    const groups = useSelector(getGroups);
    const teachers = useSelector(getTeachers);

    const groupId = useSelector(getGroupId);
    const teacherId = useSelector(getTeacherId);

    const activeMenuTab = useSelector(getActiveMenuTab);

    const router = useRouter();

    useEffect(() => {
        setProfileLink(isLoggedIn ? Routes.profile : Routes.login);
    }, [isLoggedIn]);

    useEffect(() => {
        if (router.pathname.includes('/schedule')) {
            const path = router.pathname.split('/');
            const pathname = path[2];

            if (pathname === 'personal' && isLoggedIn) {
                if (activeMenuTab !== pathname) {
                    dispatch(changeActiveMenuTab(pathname));
                    router.push(Routes.personalSchedule);
                }
            } else {
                if (activeMenuTab !== pathname) {
                    dispatch(changeActiveMenuTab(pathname as ScheduleMenuType));
                }
            }
        }
    }, []);
    useEffect(() => {
        if (activeMenuTab && router.pathname.includes(Routes.schedule)) {
            const path = router.pathname;

            const schedulePath = `${Routes.schedule}/${activeMenuTab}`;

            if (path !== schedulePath) {
                router.push(schedulePath);
            }

            router.push(`${Routes.schedule}/${activeMenuTab}`);
        }
    }, [activeMenuTab, router.pathname]);

    const options =
        activeMenuTab === 'group' || activeMenuTab === 'session'
            ? groups.map((group) => ({
                  label: group.name,
                  value: group._id,
              }))
            : teachers.map((teacher) => ({
                  label: teacher.name,
                  value: teacher._id,
              }));

    const handleMenuChange = (info: any) => {
        router.push(`${Routes.schedule}/${info.key}`);
        dispatch(changeActiveMenuTab(info.key));
    };
    const handleSwitchChange = (
        checked: boolean,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        dispatch(switchTheme());
    };

    return (
        <StyledHeader isThemeDark={theme}>
            <Container>
                <LogoContainer>
                    <Link
                        href={
                            isLoggedIn
                                ? `${Routes.schedule}/personal`
                                : `${Routes.schedule}/group`
                        }
                    >
                        <Logo
                            src={
                                theme
                                    ? '/images/schedule_logo_dark.png'
                                    : '/images/schedule_logo.png'
                            }
                        />
                    </Link>
                </LogoContainer>

                <ContentContainer>
                    <MenuContainer>
                        <div>
                            <StyledMenu
                                mode='horizontal'
                                defaultSelectedKeys={['group']}
                                selectedKeys={[activeMenuTab]}
                                theme={theme ? 'dark' : 'light'}
                                onSelect={handleMenuChange}
                            >
                                <Menu.Item key='group'>
                                    Розклад занять
                                </Menu.Item>
                                <Menu.Item key='session'>Сесія</Menu.Item>
                                <Menu.Item key='teacher'>
                                    Розклад для викладачів
                                </Menu.Item>
                                {isLoggedIn && (
                                    <Menu.Item key='personal'>
                                        Персональний
                                    </Menu.Item>
                                )}
                            </StyledMenu>
                        </div>
                    </MenuContainer>
                    <InputButtonContainer>
                        <SelectContainer>
                            {activeMenuTab !== null &&
                                activeMenuTab !== 'personal' && (
                                    <StyledSelect
                                        showSearch
                                        placeholder='Search...'
                                        optionFilterProp='children'
                                        filterOption={(input, option) =>
                                            option?.label
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                        value={
                                            activeMenuTab === 'teacher'
                                                ? teacherId
                                                : groupId
                                        }
                                        onChange={(value: any) => {
                                            if (activeMenuTab === 'teacher') {
                                                dispatch(
                                                    fetchTeacherSchedule(value)
                                                );
                                            } else {
                                                dispatch(
                                                    fetchGroupSchedule(value)
                                                );
                                                dispatch(fetchSession(value));
                                            }
                                        }}
                                        options={options}
                                    />
                                )}
                        </SelectContainer>
                        <Link href={profileLink}>
                            <Button icon={<UserOutlined />} />
                        </Link>
                        {/* <div> */}
                        <SwitchContainer>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked={theme}
                                onChange={handleSwitchChange}
                            ></Switch>
                        </SwitchContainer>
                        {/* </div> */}
                    </InputButtonContainer>
                </ContentContainer>
            </Container>
        </StyledHeader>
    );
};

const Container = styled.div`
    display: flex;
`;
const ContentContainer = styled.div`
    width: 100%;
    padding-left: 50px;
`;
const InputButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;
const MenuContainer = styled.div`
    /* display: flex;
    justify-content: space-between; */
`;
const SelectContainer = styled.div`
    width: 100%;
`;
const StyledSelect = styled(Select)`
    width: 100%;
    max-width: 600px;
`;

const Logo = styled.img`
    width: 70px;
`;

const StyledHeader = styled(Header)<{ isThemeDark: boolean }>`
    height: fit-content;

    ${(props) =>
        `background-color: ${props.isThemeDark ? palette[0] : 'white'}`};
`;

const StyledMenu = styled(Menu)`
    width: 100%;
`;

const SwitchContainer = styled.div`
    margin-left: 10px;
`;

const LogoContainer = styled.div`
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default AppHeader;
