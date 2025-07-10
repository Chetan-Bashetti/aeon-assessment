import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CryptoJS from 'crypto-js';
import { authAPI } from '../services/api';
import { AuthStep, AuthError } from '../types/auth';
import UsernameStep from './UsernameStep';
import SecureWordStep from './SecureWordStep';
import PasswordStep from './PasswordStep';
import MfaStep from './MfaStep';
import SuccessStep from './SuccessStep';

interface AuthData {
	username: string;
	secureWord: string;
	password: string;
	mfaCode: string;
}

const AuthFlow: React.FC = () => {
	const [currentStep, setCurrentStep] = useState<AuthStep>('username');
	const [authData, setAuthData] = useState<AuthData>({
		username: '',
		secureWord: '',
		password: '',
		mfaCode: ''
	});
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [secureWordExpiry, setSecureWordExpiry] = useState<number>(0);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm();

	// Handle username submission
	const handleUsernameSubmit = async (data: { username: string }) => {
		setLoading(true);
		setError('');

		try {
			const response = await authAPI.getSecureWord(data.username);
			setAuthData((prev) => ({
				...prev,
				username: data.username,
				secureWord: response.secureWord
			}));
			setSecureWordExpiry(Date.now() + response.expiresIn * 1000);
			setCurrentStep('secureWord');
		} catch (err: any) {
			setError(err.error || 'Failed to get secure word');
		} finally {
			setLoading(false);
		}
	};

	// Handle secure word confirmation
	const handleSecureWordNext = () => {
		setCurrentStep('password');
	};

	// Handle password submission
	const handlePasswordSubmit = async (data: { password: string }) => {
		setLoading(true);
		setError('');

		try {
			// Hash the password using SHA-256
			const hashedPassword = CryptoJS.SHA256(data.password).toString();

			const response = await authAPI.login({
				username: authData.username,
				hashedPassword,
				secureWord: authData.secureWord
			});

			if (response.success && response.token) {
				if (typeof window !== 'undefined') {
					localStorage.setItem('token', response.token);
				}
			}

			if (response.requiresMfa) {
				setCurrentStep('mfa');
			} else {
				setCurrentStep('complete');
			}
		} catch (err: any) {
			setError(err.error || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	// Handle MFA submission
	const handleMfaSubmit = async (data: { mfaCode: string }) => {
		setLoading(true);
		setError('');

		try {
			const response = await authAPI.verifyMfa({
				username: authData.username,
				code: data.mfaCode
			});

			setCurrentStep('complete');
		} catch (err: any) {
			setError(err.error || 'MFA verification failed');
		} finally {
			setLoading(false);
		}
	};

	// Check secure word expiry
	useEffect(() => {
		if (currentStep === 'secureWord' && secureWordExpiry > 0) {
			const interval = setInterval(() => {
				if (Date.now() >= secureWordExpiry) {
					setError('Secure word has expired. Please start over.');
					setCurrentStep('username');
					setAuthData({
						username: '',
						secureWord: '',
						password: '',
						mfaCode: ''
					});
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [currentStep, secureWordExpiry]);

	const renderStep = () => {
		switch (currentStep) {
			case 'username':
				return (
					<UsernameStep
						onSubmit={handleUsernameSubmit}
						loading={loading}
						error={error}
						register={register}
						handleSubmit={handleSubmit}
						errors={errors}
					/>
				);

			case 'secureWord':
				return (
					<SecureWordStep
						secureWord={authData.secureWord}
						onNext={handleSecureWordNext}
						expiryTime={secureWordExpiry}
					/>
				);

			case 'password':
				return (
					<PasswordStep
						onSubmit={handlePasswordSubmit}
						loading={loading}
						error={error}
						register={register}
						handleSubmit={handleSubmit}
						errors={errors}
					/>
				);

			case 'mfa':
				return (
					<MfaStep
						onSubmit={handleMfaSubmit}
						loading={loading}
						error={error}
						register={register}
						handleSubmit={handleSubmit}
						errors={errors}
					/>
				);

			case 'complete':
				return <SuccessStep username={authData.username} />;

			default:
				return null;
		}
	};

	// Progress steps
	const steps: { key: AuthStep; label: string }[] = [
		{ key: 'username', label: 'Username' },
		{ key: 'secureWord', label: 'Secure Word' },
		{ key: 'password', label: 'Password' },
		{ key: 'mfa', label: 'MFA' }
	];
	const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

	return (
		<div className='auth-container'>
			<div className='auth-box'>
				<div className='auth-title'>Secure Login</div>
				<div className='auth-subtitle'>Multi-factor authentication system</div>

				{/* Progress indicator */}
				<div className='auth-progress'>
					{steps.map((step, idx) => (
						<React.Fragment key={step.key}>
							<div
								className={
									'auth-progress-step' +
									(currentStep === step.key
										? ' active'
										: idx < currentStepIndex
										? ' complete'
										: '')
								}
							>
								{idx + 1}
							</div>
							{idx < steps.length - 1 && (
								<div
									className={
										'auth-progress-bar' +
										(idx < currentStepIndex ? ' complete' : '')
									}
								/>
							)}
						</React.Fragment>
					))}
				</div>

				{renderStep()}
			</div>
		</div>
	);
};

export default AuthFlow;
