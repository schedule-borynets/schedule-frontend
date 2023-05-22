import Subject from '@/components/subject';
import SubjectCard from '@/components/subject-card';
import { Card, Col, Divider, Row, Tabs, Typography } from 'antd';
import { FC } from 'react';
import { Lesson } from 'store/schedule/get';
import styled from 'styled-components';
import { DAYS, weeks } from 'utils/schedule';
const { Title } = Typography;

type Props = {
    schedulesByTime: { time: string; days: any[] }[][];
};
const ScheduleTabs: FC<Props> = ({ schedulesByTime }) => {
    return (
        <Tabs
            defaultActiveKey={weeks[1]}
            items={schedulesByTime.map((scheduleByTime, scheduleIndex) => ({
                label: `${weeks[scheduleIndex]} тиждень`,
                key: weeks[scheduleIndex],
                children: (
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
                                                    pair: Lesson,
                                                    pairIndex: number
                                                ) => (
                                                    <div
                                                        key={pairIndex}
                                                        style={{
                                                            marginTop: '10px',
                                                        }}
                                                    >
                                                        <SubjectCard
                                                            subject={pair}
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))}
                    </div>
                ),
            }))}
        />
    );
};
const StyledCol = styled(Col)`
    text-align: center;
`;
export default ScheduleTabs;
