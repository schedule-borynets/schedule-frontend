import SessionCard from '@/components/session-card';
import Spinner from '@/components/spinner';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getIsSessionLoading, getSession } from 'store/session';

const Session: FC = () => {
    const session = useSelector(getSession);
    const isLoading = useSelector(getIsSessionLoading);

    if (isLoading) {
        return <Spinner />;
    }
    if (!session) {
        return null;
    }
    return (
        <div>
            {session.map((s, index) => (
                <SessionCard session={s} key={s.id} />
            ))}
        </div>
    );
};
export default Session;
