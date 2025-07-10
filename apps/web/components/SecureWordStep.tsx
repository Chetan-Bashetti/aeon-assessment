import React, { useState, useEffect } from 'react';

interface SecureWordStepProps {
	secureWord: string;
	onNext: () => void;
	expiryTime: number;
}

const SecureWordStep: React.FC<SecureWordStepProps> = ({
	secureWord,
	onNext,
	expiryTime
}) => {
	const [timeLeft, setTimeLeft] = useState(60);

	useEffect(() => {
		const interval = setInterval(() => {
			const remaining = Math.max(
				0,
				Math.ceil((expiryTime - Date.now()) / 1000)
			);
			setTimeLeft(remaining);
		}, 1000);

		return () => clearInterval(interval);
	}, [expiryTime]);

	return (
		<div>
			<div style={{ marginBottom: '1.5rem' }}>
				<div
					className='auth-title'
					style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}
				>
					Secure Word Generated
				</div>
				<div className='auth-subtitle' style={{ marginBottom: 0 }}>
					Please note this secure word for the next step
				</div>
			</div>

			<div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
				<label className='auth-label'>Your Secure Word</label>
				<div className='auth-secure-word'>{secureWord}</div>
				<div style={{ color: '#4a5568', fontSize: '0.95rem' }}>
					This word will be required for login verification
				</div>
			</div>

			<div className='auth-alert' style={{ marginBottom: '1.5rem' }}>
				<strong>Warning:</strong> This secure word expires in{' '}
				<span
					style={{
						fontFamily: 'monospace',
						fontWeight: 'bold',
						color: timeLeft <= 10 ? '#e53e3e' : '#b7791f'
					}}
				>
					{timeLeft}
				</span>{' '}
				seconds
			</div>

			<button onClick={onNext} className='auth-btn' type='button'>
				Continue to Password
			</button>
		</div>
	);
};

export default SecureWordStep;
