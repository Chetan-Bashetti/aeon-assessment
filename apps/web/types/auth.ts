export interface SecureWordResponse {
	secureWord: string;
	expiresIn: number;
	message: string;
}

export interface LoginRequest {
	username: string;
	hashedPassword: string;
	secureWord: string;
}

export interface LoginResponse {
	success: boolean;
	token: string;
	message: string;
	requiresMfa: boolean;
}

export interface MfaRequest {
	username: string;
	code: string;
}

export interface MfaResponse {
	success: boolean;
	token: string;
	message: string;
}

export interface AuthError {
	error: string;
	attemptsRemaining?: number;
}

export interface TransactionRecipient {
	name: string;
	email: string;
}

export interface Transaction {
	reference_id: string;
	transaction_date: string;
	transaction_recipient: TransactionRecipient;
	transaction_type: string;
	transaction_amount: number;
}

export interface TransactionResponse {
	transactions: Transaction[];
}

export type AuthStep =
	| 'username'
	| 'secureWord'
	| 'password'
	| 'mfa'
	| 'complete';
