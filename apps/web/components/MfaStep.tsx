import React from 'react';
import {
	UseFormRegister,
	UseFormHandleSubmit,
	FieldErrors
} from 'react-hook-form';

interface MfaStepProps {
	onSubmit: (data: { mfaCode: string }) => void;
	loading: boolean;
	error: string;
	register: UseFormRegister<any>;
	handleSubmit: UseFormHandleSubmit<any>;
	errors: FieldErrors<any>;
}

const MfaStep: React.FC<MfaStepProps> = ({
	onSubmit,
	loading,
	error,
	register,
	handleSubmit,
	errors
}) => {
	return (
		<div>
			<div style={{ marginBottom: '1.5rem' }}>
				<div
					className='auth-title'
					style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}
				>
					Two-Factor Authentication
				</div>
				<div className='auth-subtitle' style={{ marginBottom: 0 }}>
					Enter the 6-digit code from your authenticator app
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
				<div>
					<label htmlFor='mfaCode' className='auth-label'>
						MFA Code
					</label>
					<input
						type='text'
						id='mfaCode'
						maxLength={6}
						{...register('mfaCode', {
							required: 'MFA code is required'
						})}
						className={`auth-input`}
						style={{
							textAlign: 'center',
							fontSize: '1.5rem',
							fontFamily: 'monospace',
							letterSpacing: '0.3em'
						}}
						placeholder='000000'
						disabled={loading}
					/>
					{errors?.mfaCode && (
						<p className='auth-error'>{errors?.mfaCode?.message}</p>
					)}
				</div>

				<div className='auth-alert'>
					<strong>Note:</strong> You have 3 attempts to enter the correct code.
					The code expires in 5 minutes.
				</div>

				{error && <div className='auth-error'>{error}</div>}

				<button type='submit' disabled={loading} className='auth-btn'>
					{loading ? 'Verifying MFA...' : 'Verify MFA Code'}
				</button>
			</form>
		</div>
	);
};

export default MfaStep;
