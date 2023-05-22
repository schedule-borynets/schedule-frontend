import { Card } from 'antd';
import { format } from 'date-fns';
import { FC } from 'react';
import { Session } from 'store/session';

type Props = {
    session: Session;
};
const SessionCard: FC<Props> = ({ session }) => {
    return (
        <Card title={session.subject} style={{ marginTop: '20px' }}>
            <p>
                <b>Lecturer:</b> {session.lecturerName}
            </p>
            <p>
                <b>Room:</b> {session.room}
            </p>
            <p>
                <b>Date:</b>{' '}
                {format(new Date(session.date), 'HH:mm - EEEE, MMMM dd yyyy ')}
            </p>
            <p>
                <b>Days Left:</b> {session.daysLeft}
            </p>

            {session.group && (
                <p>
                    <b>Group:</b>
                    {session.group}
                </p>
            )}
        </Card>
    );
};

export default SessionCard;
