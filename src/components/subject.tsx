import { Button, Checkbox, Collapse, Tag } from 'antd';
import { FC, MouseEvent } from 'react';
import {
    UserOutlined,
    InfoCircleOutlined,
    MoreOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { openSubjectInfoPanel } from 'store/subject/open-info-panel';
import { getIsUserLoggedIn } from 'store/auth/login';
import {
    addHiddenSubject,
    getHiddenSubjects,
    getIsEditing,
    removeHiddenSubject,
} from 'store/schedule/edit';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { SubjectSchedule } from 'store/subject/schedule';
const { Panel } = Collapse;

type Props = {
    subjectSchedule: SubjectSchedule;
};

const Subject: FC<Props> = ({ subjectSchedule }) => {
    const subject = subjectSchedule.subject;
    const teacher = subjectSchedule.teacher;
    const groups = subjectSchedule.groups;
    const location = subjectSchedule.location;
    const lessonType = subjectSchedule.lessonType;

    const subjectScheduleId = subjectSchedule._id;

    const subjectId = subject._id;
    const subjectName = subject.name;
    const type = lessonType.split(' ')[0];
    const participant = teacher?.name || groups.map((g) => g?.name).join(',');

    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsUserLoggedIn);
    const isEditing = useSelector(getIsEditing);
    const shouldBeChecked =
        !useSelector(getHiddenSubjects).includes(subjectScheduleId);

    const handleMoreButtonClick = (
        e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
        e.stopPropagation();
        dispatch(openSubjectInfoPanel(subjectScheduleId));
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        if (!e.target.checked) {
            dispatch(addHiddenSubject(subjectScheduleId));
        } else {
            dispatch(removeHiddenSubject(subjectScheduleId));
        }
    };
    return (
        <div className='day-card'>
            <Collapse defaultActiveKey={['1']} bordered={false}>
                <Panel
                    showArrow={false}
                    header={
                        <HeaderBox>
                            <ButtonsBox>
                                {type ? (
                                    <StyledTag
                                        color={
                                            type.includes('Лек')
                                                ? 'blue'
                                                : 'lime'
                                        }
                                    >
                                        {type}
                                    </StyledTag>
                                ) : (
                                    <div />
                                )}
                                {isLoggedIn && !isEditing && (
                                    <Button
                                        icon={<MoreOutlined />}
                                        type='text'
                                        onClick={handleMoreButtonClick}
                                    />
                                )}
                                {isLoggedIn && isEditing && (
                                    <Checkbox
                                        checked={shouldBeChecked}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={handleCheckboxChange}
                                    ></Checkbox>
                                )}
                            </ButtonsBox>
                            <p>{subjectName}</p>
                        </HeaderBox>
                    }
                    key={subjectId}
                >
                    <InfoBox>
                        {participant && (
                            <DetailsBox>
                                <UserOutlined />
                                <StyledText>
                                    {participant.split(',').join('\n')}
                                </StyledText>
                            </DetailsBox>
                        )}
                        {location && (
                            <DetailsBox>
                                <InfoCircleOutlined />
                                <p>{location}</p>
                            </DetailsBox>
                        )}
                    </InfoBox>
                </Panel>
            </Collapse>
        </div>
    );
};
const HeaderBox = styled.div`
    text-align: left;
`;
const InfoBox = styled.div`
    text-align: left;
    flex-direction: column;
`;

const DetailsBox = styled.div`
    display: flex;
    p {
        margin-left: 10px;
    }
`;

const ButtonsBox = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledText = styled.p`
    white-space: pre-wrap;
`;
const StyledTag = styled(Tag)`
    display: inline-flex;
    align-items: center;
`;
export default Subject;
