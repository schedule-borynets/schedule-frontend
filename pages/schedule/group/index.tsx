import ScheduleTabs from '@/components/schedule-tabs';
import SidePanel from '@/components/side-panel';
import { Layout } from 'antd';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getGroupSchedule } from 'store/schedule/get';
import styled from 'styled-components';
const { Content } = Layout;

const Group: FC = () => {
    const schedule = useSelector(getGroupSchedule);

    if (!schedule) {
        return null;
    }

    const scheduleData = [
        schedule.scheduleFirstWeek,
        schedule.scheduleSecondWeek,
    ];

    const times = scheduleData.map((s) => {
        return [
            ...new Set(
                s.flatMap(({ pairs }) =>
                    pairs.map((pair) => pair.time.padStart(5, '0'))
                )
            ),
        ].sort();
    });

    const schedulesByTime = times.map((t) => {
        return t.map((time) => ({
            time,
            days: Array(6).fill([]),
        }));
    });

    scheduleData.forEach((s, index) =>
        s.forEach(({ pairs }, dayIndex) => {
            pairs.forEach((pair) => {
                const timeIndex = times[index].indexOf(
                    pair.time.padStart(5, '0')
                );
                schedulesByTime[index][timeIndex].days[dayIndex] = [
                    ...schedulesByTime[index][timeIndex].days[dayIndex],
                    pair,
                ];
            });
        })
    );

    return (
        <LayoutStyled>
            <Content>
                <ScheduleTabs schedulesByTime={schedulesByTime} />
            </Content>
            <SidePanel />
        </LayoutStyled>
    );
};

const LayoutStyled = styled(Layout)`
    padding: 0 50px;
    .day-card {
        margin-bottom: 10px;
    }
`;

export default Group;
