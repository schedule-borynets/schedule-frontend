import Subject from '@/components/subject';
import { Col, Divider, Row, Typography } from 'antd';

import { FC } from 'react';
import { SubjectSchedule } from 'store/subject/schedule';
import styled from 'styled-components';
import { DAYS } from 'utils/schedule';
const { Title } = Typography;

type Props = {
    scheduleByTime: { time: string; days: any[] }[];
};

const ScheduleGrid: FC<Props> = ({ scheduleByTime }) => {
    return (
        <div>
            <Row>
                {DAYS.map((day) => (
                    <StyledCol span={4} key={day}>
                        <Title level={5}>{day}</Title>
                    </StyledCol>
                ))}
            </Row>

            {scheduleByTime.map(({ time, days }) => (
                <div key={time}>
                    <Divider>{time}</Divider>
                    <Row gutter={[16, 16]}>
                        {days.map((pairs, dayIndex) => (
                            <Col span={4} key={dayIndex}>
                                <div
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                    }}
                                ></div>

                                {pairs.map(
                                    (
                                        pair: SubjectSchedule,
                                        pairIndex: number
                                    ) => (
                                        <Subject
                                            key={pairIndex}
                                            subjectSchedule={pair}
                                        />
                                    )
                                )}
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </div>
    );
};

const StyledCol = styled(Col)`
    text-align: center;
`;
export default ScheduleGrid;
