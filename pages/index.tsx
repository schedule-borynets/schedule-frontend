import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Routes } from 'routes';

export default function Home() {
    const navigation = useRouter();

    useEffect(() => {
        if (localStorage.getItem('user_id')) {
            navigation.push(`${Routes.personalSchedule}`);
        } else {
            navigation.push(`${Routes.groupSchedule}`);
        }
    }, [navigation]);
    return <></>;
}
