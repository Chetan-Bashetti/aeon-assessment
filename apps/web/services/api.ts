import axios from 'axios';
import {
	SecureWordResponse,
	LoginRequest,
	LoginResponse,
	MfaRequest,
	MfaResponse,
	AuthError,
	TransactionResponse,
	Transaction
} from '../types/auth';

const API_BASE_URL = 'http://localhost:4000';

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Request interceptor to handle errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.data?.error) {
			return Promise.reject(error.response.data);
		}
		return Promise.reject({ error: 'Network error occurred' });
	}
);

export const authAPI = {
	// Get secure word for username
	getSecureWord: async (username: string): Promise<SecureWordResponse> => {
		console.log(username, ' USERNAME');
		const response = await api.post<SecureWordResponse>('/api/getSecureWord', {
			username
		});
		return response.data;
	},

	// Login with username, hashed password, and secure word
	login: async (data: LoginRequest): Promise<LoginResponse> => {
		const response = await api.post<LoginResponse>('/api/login', data);
		return response.data;
	},

	// Verify MFA code
	verifyMfa: async (data: MfaRequest): Promise<MfaResponse> => {
		const response = await api.post<MfaResponse>('/api/verifyMfa', data);
		return response.data;
	},

	// Get transactions
	getTransactions: async (): Promise<TransactionResponse> => {
		const response = await api.get<TransactionResponse>('/api/transactions');
		return response.data;
	}
};

export default api;
