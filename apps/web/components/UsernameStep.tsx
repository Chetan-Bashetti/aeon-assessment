import React from 'react';
import {
	UseFormRegister,
	UseFormHandleSubmit,
	FieldErrors
} from 'react-hook-form';

interface UsernameStepProps {
	onSubmit: (data: { username: string }) => void;
	loading: boolean;
	error: string;
	register: UseFormRegister<any>;
	handleSubmit: UseFormHandleSubmit<any>;
	errors: FieldErrors<any>;
}

const UsernameStep: React.FC<UsernameStepProps> = ({
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
					Enter Username
				</div>
				<div className='auth-subtitle' style={{ marginBottom: 0 }}>
					We'll generate a secure word for your login session
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
				<div>
					<label htmlFor='username' className='auth-label'>
						Username
					</label>
					<input
						type='text'
						id='username'
						{...register('username', {
							required: 'Username is required',
							minLength: {
								value: 3,
								message: 'Username must be at least 3 characters'
							}
						})}
						className={`auth-input${errors?.username ? ' error' : ''}`}
						placeholder='Enter your username'
						disabled={loading}
					/>
					{errors?.username && (
						<p className='auth-error'>{errors?.username?.message}</p>
					)}
				</div>

				{error && <div className='auth-error'>{error}</div>}

				<button type='submit' disabled={loading} className='auth-btn'>
					{loading ? 'Generating Secure Word...' : 'Get Secure Word'}
				</button>
			</form>
		</div>
	);
};

export default UsernameStep;
