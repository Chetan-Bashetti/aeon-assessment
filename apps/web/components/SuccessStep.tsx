import React from 'react';
import { useRouter } from 'next/router';

interface SuccessStepProps {
	username: string;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ username }) => {
	const router = useRouter();

	const handleGoToDashboard = () => {
		router.push('/dashboard');
	};

	return (
		<div className='auth-success'>
			<div style={{ marginBottom: '1rem' }}>
				<div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
				<div
					style={{
						fontWeight: 'bold',
						fontSize: '1.2rem',
						marginBottom: '0.5rem'
					}}
				>
					Authentication Complete!
				</div>
				<div>
					Welcome back, <span style={{ fontWeight: 600 }}>{username}</span>
				</div>
			</div>
			<ul
				style={{ textAlign: 'left', margin: '0 auto 1rem auto', maxWidth: 260 }}
			>
				<li>• Username verified</li>
				<li>• Secure word validated</li>
				<li>• Password authenticated</li>
				<li>• MFA code verified</li>
			</ul>
			<div
				style={{ fontSize: '0.95rem', color: '#2c5282', marginBottom: '1rem' }}
			>
				<strong>Session Active:</strong> Your secure session has been
				established. You can now access protected resources.
			</div>
			<button
				className='auth-btn'
				onClick={handleGoToDashboard}
				style={{ marginTop: 12 }}
			>
				Go to Dashboard
			</button>
		</div>
	);
};

export default SuccessStep;
