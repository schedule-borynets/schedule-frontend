import { useEffect, useState } from 'react';
import { Descriptions, Input, Select, Button } from 'antd';
import { styled } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from 'store/auth/logout';
import { getIsUserLoggedIn } from 'store/auth/login';
import { getProfileInfo } from 'store/profile/get';
import { useRouter } from 'next/router';
import { getGroups } from 'store/group';
import { getTeachers } from 'store/teacher';
import { ScheduleType, updateProfile } from 'store/profile/update';

const { Option } = Select;

function ProfileSettings() {
    const dispatch = useDispatch();

    const isLoggedIn = useSelector(getIsUserLoggedIn);
    const profile = useSelector(getProfileInfo);

    const [scheduleType, setScheduleType] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null);
    const [teacherId, setTeacherId] = useState<string | null>(null);

    const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem('user_id')) {
            router.push('auth/login');
        }
    }, [router, isLoggedIn]);

    useEffect(() => {
        const { name, email, scheduleType, groupId, teacherId } = profile;

        setScheduleType(scheduleType);
        setName(name);
        setEmail(email);
        setTeacherId(teacherId);
        setGroupId(groupId);
    }, [profile]);

    const handleSaveClick = () => {
        const payload = {
            name: name,
            email: email,
        };

        setIsEditable(false);

        dispatch(updateProfile(payload));
    };
    const [isEditable, setIsEditable] = useState(false);
    const groups = useSelector(getGroups);
    const teachers = useSelector(getTeachers);

    const handleLogoutClick = () => {
        dispatch(logoutUser());
    };

    const handleScheduleValueSearch = () => {};

    return (
        <Content>
            <div>
                <StyledDescriptions
                    title='Персональна інформація'
                    layout='horizontal'
                    column={1}
                >
                    <Descriptions.Item label='Name'>
                        {isEditable && name ? (
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        ) : (
                            name
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label='Email'>
                        {isEditable && email ? (
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        ) : (
                            <p>{email}</p>
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label='Schedule for'>
                        <Select
                            style={{ width: '200px' }}
                            onChange={(value: any) => {
                                setScheduleType(value);

                                dispatch(
                                    updateProfile({
                                        scheduleType: value as ScheduleType,
                                    })
                                );
                            }}
                            value={scheduleType}
                            options={[
                                { label: 'teacher', value: 'teacher' },
                                { label: 'group', value: 'group' },
                            ]}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={`Choose your ${
                            scheduleType === 'group' ? 'group' : 'name'
                        }`}
                    >
                        <Select
                            style={{ width: '200px' }}
                            showSearch
                            onSearch={handleScheduleValueSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            defaultValue={
                                scheduleType === 'group' ? groupId : teacherId
                            }
                            value={
                                scheduleType === 'group' ? groupId : teacherId
                            }
                            onChange={(value) => {
                                scheduleType === 'group'
                                    ? setGroupId(value)
                                    : setTeacherId(value);

                                // save to the db

                                if (scheduleType === 'group') {
                                    dispatch(
                                        updateProfile({
                                            group: value as string,
                                        })
                                    );
                                } else {
                                    dispatch(
                                        updateProfile({
                                            teacher: value as string,
                                        })
                                    );
                                }
                            }}
                            options={
                                scheduleType === 'group'
                                    ? groups.map((group) => ({
                                          label: group.name,
                                          value: group._id,
                                      }))
                                    : teachers.map((teacher) => ({
                                          label: teacher.name,
                                          value: teacher._id,
                                      }))
                            }
                        />
                    </Descriptions.Item>
                </StyledDescriptions>
                <ButtonsContainer>
                    <StyledButton
                        onClick={() => {
                            isEditable
                                ? handleSaveClick()
                                : setIsEditable(!isEditable);
                        }}
                    >
                        {isEditable ? 'Save' : 'Edit'}
                    </StyledButton>

                    <StyledButton onClick={handleLogoutClick} danger>
                        Logout
                    </StyledButton>
                </ButtonsContainer>
            </div>
        </Content>
    );
}

const StyledDescriptions = styled(Descriptions)`
    width: 50%;
    min-width: 450px;
`;

const StyledButton = styled(Button)`
    margin-right: 10px;
`;

const ButtonsContainer = styled.div`
    display: flex;
`;
const Content = styled.div`
    padding: 50px;
`;

export default ProfileSettings;
