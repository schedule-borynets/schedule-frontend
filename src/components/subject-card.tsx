import { Collapse, Tag } from 'antd';
import { FC } from 'react';
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Lesson } from 'store/schedule/get';
const { Panel } = Collapse;

type Props = {
    subject: Lesson;
};

const SubjectCard: FC<Props> = ({ subject }) => {
    const { type, name: subjectName, id, teacherName, group, place } = subject;
    const participant = teacherName || group;

    return (
        <Collapse defaultActiveKey={['1']} bordered={false}>
            <Panel
                showArrow={false}
                header={
                    <HeaderBox>
                        <ButtonsBox>
                            {type ? (
                                <Tag
                                    color={
                                        type.includes('Лек') ? 'blue' : 'lime'
                                    }
                                >
                                    {type}
                                </Tag>
                            ) : (
                                <div />
                            )}
                        </ButtonsBox>
                        <p>{subjectName}</p>
                    </HeaderBox>
                }
                key={id}
            >
                <InfoBox>
                    {participant && (
                        <DetailsBox>
                            <UserOutlined />
                            <div>
                                {participant.split(',').map((part, index) => (
                                    <StyledText key={index}>{part}</StyledText>
                                ))}
                            </div>
                        </DetailsBox>
                    )}
                    {place && place !== '' && (
                        <DetailsBox>
                            <InfoCircleOutlined />
                            <p>{place}</p>
                        </DetailsBox>
                    )}
                </InfoBox>
            </Panel>
        </Collapse>
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
    margin-top: 5px;
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
export default SubjectCard;
