import ScheduleGrid from '@/components/schedule-grid';
import { Tabs } from 'antd';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getScheduleWeek } from 'store/schedule/get';
import { SubjectSchedule } from 'store/subject/schedule';
import { DAYS, weeks } from 'utils/schedule';

type Props = {
    subjectScheduleData: SubjectSchedule[][];
};

const PersonalScheduleTabs: FC<Props> = ({ subjectScheduleData }) => {
    const week = useSelector(getScheduleWeek);

    const subjectScheduleTimes = subjectScheduleData.map((s) => {
        return [
            ...new Set(s.flatMap(({ time }) => time.padStart(5, '0'))),
        ].sort();
    });

    const subjectShedulesByTime = subjectScheduleTimes.map((t) => {
        return t.map((time) => ({
            time,
            days: Array(6).fill([]),
        }));
    });

    subjectScheduleData.forEach((s, index) =>
        s.forEach((pair) => {
            const dayIndex = DAYS.indexOf(pair.day);
            const timeIndex = subjectScheduleTimes[index].indexOf(
                pair.time.padStart(5, '0')
            );
            subjectShedulesByTime[index][timeIndex].days[dayIndex] = [
                ...subjectShedulesByTime[index][timeIndex].days[dayIndex],
                pair,
            ];
        })
    );
    return (
        <Tabs
            defaultActiveKey={weeks[week || 1]}
            items={subjectShedulesByTime.map(
                (scheduleByTime, scheduleIndex) => ({
                    label: `${weeks[scheduleIndex]} тиждень`,
                    key: weeks[scheduleIndex],
                    children: <ScheduleGrid scheduleByTime={scheduleByTime} />,
                })
            )}
        />
    );
};
export default PersonalScheduleTabs;
