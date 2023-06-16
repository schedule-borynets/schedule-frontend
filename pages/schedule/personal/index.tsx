import { Layout, Button } from 'antd';
import SidePanel from '@/components/side-panel';
import { useDispatch, useSelector } from 'react-redux';

import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';
import { fetchTeachers } from 'store/teacher';
import { useEffect } from 'react';
import { fetchGroups } from 'store/group';
import {
    editSchedule,
    getHiddenSubjects,
    getIsEditing,
    saveSchedule,
} from 'store/schedule/edit';
import { getSubjectSchedule, getIsLoading } from 'store/subject/schedule';
import PersonalScheduleTabs from '@/components/personal-schedule-tabs';
import Spinner from '@/components/spinner';

const { Content } = Layout;

export default function PersonalSchedule() {
    const dispatch = useDispatch();

    const isLoading = useSelector(getIsLoading);
    const isEditable = useSelector(getIsEditing);
    const schedule = useSelector(getSubjectSchedule);
    const hiddenSubjects = useSelector(getHiddenSubjects);
    useEffect(() => {
        dispatch(fetchGroups());
        dispatch(fetchTeachers());
    }, [dispatch]);
    // Initialize an array with 6 empty arrays, one for each day of the week
    if (isLoading) {
        return <Spinner />;
    }
    if (!schedule) {
        return null;
    }

    const filteredSchedule = schedule.filter((s) => {
        return !hiddenSubjects.includes(s._id);
    });
    const subjectSchedule = isEditable ? schedule : filteredSchedule;

    const subjectScheduleData = [
        subjectSchedule.filter((s) => s.week === 0),
        subjectSchedule.filter((s) => s.week === 1),
    ];

    const handleEditScheduleClick = () => {
        dispatch(editSchedule());
    };
    const handleSaveScheduleClick = () => {
        dispatch(saveSchedule());
    };
    return (
        <LayoutStyled>
            <Content>
                {isEditable ? (
                    <Button
                        type="text"
                        icon={<CheckCircleOutlined />}
                        onClick={handleSaveScheduleClick}
                    >
                        Save
                    </Button>
                ) : (
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={handleEditScheduleClick}
                    >
                        Edit
                    </Button>
                )}
                <PersonalScheduleTabs
                    subjectScheduleData={subjectScheduleData}
                />
            </Content>
            <SidePanel />
        </LayoutStyled>
    );
}

const SpinContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LayoutStyled = styled(Layout)`
    padding: 0 50px;
    .day-card {
        margin-bottom: 10px;
    }
`;
