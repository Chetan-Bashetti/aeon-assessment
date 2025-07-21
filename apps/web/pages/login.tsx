import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthFlow from '../components/AuthFlow';

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		const token =
			typeof window !== 'undefined' ? localStorage.getItem('token') : null;
		if (token) {
			router.replace('/dashboard');
		}
	}, [router]);

	return <AuthFlow />;
}
