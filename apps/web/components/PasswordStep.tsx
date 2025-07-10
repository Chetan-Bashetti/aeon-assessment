import React, { useState } from 'react';
import {
	UseFormRegister,
	UseFormHandleSubmit,
	FieldErrors
} from 'react-hook-form';

interface PasswordStepProps {
	onSubmit: (data: { password: string }) => void;
	loading: boolean;
	error: string;
	register: UseFormRegister<any>;
	handleSubmit: UseFormHandleSubmit<any>;
	errors: FieldErrors<any>;
}

const PasswordStep: React.FC<PasswordStepProps> = ({
	onSubmit,
	loading,
	error,
	register,
	handleSubmit,
	errors
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div>
			<div style={{ marginBottom: '1.5rem' }}>
				<div
					className='auth-title'
					style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}
				>
					Enter Password
				</div>
				<div className='auth-subtitle' style={{ marginBottom: 0 }}>
					Your password will be securely hashed before transmission
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
				<div>
					<label htmlFor='password' className='auth-label'>
						Password
					</label>
					<div style={{ position: 'relative' }}>
						<input
							type={showPassword ? 'text' : 'password'}
							id='password'
							{...register('password', {
								required: 'Password is required',
								minLength: {
									value: 6,
									message: 'Password must be at least 6 characters'
								}
							})}
							className={`auth-input${errors?.password ? ' error' : ''}`}
							placeholder='Enter your password'
							disabled={loading}
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							style={{
								position: 'absolute',
								right: 10,
								top: '50%',
								transform: 'translateY(-50%)',
								background: 'none',
								border: 'none',
								cursor: 'pointer'
							}}
							tabIndex={-1}
						>
							{showPassword ? '🙈' : '��️'}
						</button>
					</div>
					{errors?.password && (
						<p className='auth-error'>{errors?.password?.message}</p>
					)}
				</div>

				<div className='auth-alert'>
					<strong>Security Note:</strong> Your password will be hashed using
					SHA-256 before being sent to the server.
				</div>

				{error && <div className='auth-error'>{error}</div>}

				<button type='submit' disabled={loading} className='auth-btn'>
					{loading ? 'Verifying...' : 'Login'}
				</button>
			</form>
		</div>
	);
};

export default PasswordStep;
