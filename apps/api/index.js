const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const app = express();
const port = 4000;

// JWT secret (in production, use environment variable)
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
const SECURE_WORD_SECRET = 'your-secure-word-secret-key';

app.use(cors());
app.use(express.json());

// In-memory storage for secure words and rate limiting
const secureWordStore = new Map();
const rateLimitStore = new Map();
const mfaAttempts = new Map();
const userMfaCodes = new Map();

// Rate limiting middleware
const rateLimit = (req, res, next) => {
	const username = req.body.username;
	const now = Date.now();

	if (rateLimitStore.has(username)) {
		const lastRequest = rateLimitStore.get(username);
		if (now - lastRequest < 10000) {
			// 10 seconds
			return res
				.status(429)
				.json({ error: 'Rate limit exceeded. Please wait 10 seconds.' });
		}
	}

	rateLimitStore.set(username, now);
	next();
};

// Clean up expired secure words
setInterval(() => {
	const now = Date.now();
	for (const [username, data] of secureWordStore.entries()) {
		if (now - data.issuedAt > 60000) {
			// 60 seconds
			secureWordStore.delete(username);
		}
	}
}, 10000); // Clean up every 10 seconds

// Generate secure word
app.post('/api/getSecureWord', rateLimit, (req, res) => {
	const { username } = req.body;

	if (!username) {
		return res.status(400).json({ error: 'Username is required' });
	}

	// Generate secure word using HMAC
	const timestamp = Date.now();
	const data = `${username}:${timestamp}`;
	const secureWord = crypto
		.createHmac('sha256', SECURE_WORD_SECRET)
		.update(data)
		.digest('hex')
		.substring(0, 8)
		.toUpperCase();

	// Store secure word with expiration
	secureWordStore.set(username, {
		secureWord,
		issuedAt: timestamp
	});

	res.json({
		secureWord,
		expiresIn: 60,
		message: 'Secure word generated successfully'
	});
});

// Login endpoint
app.post('/api/login', (req, res) => {
	const { username, hashedPassword, secureWord } = req.body;

	if (!username || !hashedPassword || !secureWord) {
		return res.status(400).json({
			error: 'Username, hashed password, and secure word are required'
		});
	}

	// Check if secure word exists and is valid
	const storedData = secureWordStore.get(username);
	if (!storedData) {
		return res.status(400).json({ error: 'Secure word not found or expired' });
	}

	if (storedData.secureWord !== secureWord) {
		return res.status(400).json({ error: 'Invalid secure word' });
	}

	// Check if secure word has expired (60 seconds)
	const now = Date.now();
	if (now - storedData.issuedAt > 60000) {
		secureWordStore.delete(username);
		return res.status(400).json({ error: 'Secure word has expired' });
	}

	// Mock password verification (in real app, check against database)
	// For demo purposes, we'll accept any password that's properly hashed
	if (!hashedPassword || hashedPassword.length < 10) {
		return res.status(400).json({ error: 'Invalid password' });
	}

	// Clear secure word after successful login
	secureWordStore.delete(username);

	// Generate JWT token
	const token = jwt.sign({ username, loginTime: now }, JWT_SECRET, {
		expiresIn: '1h'
	});

	// Generate MFA code for the user
	const mfaCode = generateMfaCode(username);
	console.log(mfaCode, ' MFA CODE');
	userMfaCodes.set(username, {
		code: mfaCode,
		generatedAt: now
	});

	res.json({
		success: true,
		token,
		message: 'Login successful. Please complete MFA verification.',
		requiresMfa: true
	});
});

// MFA verification endpoint
app.post('/api/verifyMfa', (req, res) => {
	const { username, code } = req.body;

	if (!username || !code) {
		return res
			.status(400)
			.json({ error: 'Username and MFA code are required' });
	}

	// Check MFA attempts
	const attempts = mfaAttempts.get(username) || 0;
	if (attempts >= 3) {
		return res
			.status(429)
			.json({ error: 'Too many MFA attempts. Account temporarily locked.' });
	}

	// Get stored MFA code
	const storedMfa = userMfaCodes.get(username);
	if (!storedMfa) {
		return res.status(400).json({ error: 'No MFA code found for user' });
	}

	// Check if MFA code has expired (5 minutes)
	const now = Date.now();
	if (now - storedMfa.generatedAt > 300000) {
		// 5 minutes
		userMfaCodes.delete(username);
		return res.status(400).json({ error: 'MFA code has expired' });
	}

	// Verify MFA code
	if (storedMfa.code !== code) {
		mfaAttempts.set(username, attempts + 1);
		return res.status(400).json({
			error: 'Invalid MFA code',
			attemptsRemaining: 3 - (attempts + 1)
		});
	}

	// Clear MFA data after successful verification
	userMfaCodes.delete(username);
	mfaAttempts.delete(username);

	// Generate final session token
	const finalToken = jwt.sign(
		{
			username,
			loginTime: now,
			mfaVerified: true
		},
		JWT_SECRET,
		{ expiresIn: '24h' }
	);

	res.json({
		success: true,
		token: finalToken,
		message: 'MFA verification successful. Login complete!'
	});
});

// Mock function to generate MFA code (simulates TOTP)
function generateMfaCode(username) {
	const timestamp = Math.floor(Date.now() / 30000); // 30-second window
	const data = `${username}:${timestamp}:${SECURE_WORD_SECRET}`;
	const hash = crypto.createHash('sha256').update(data).digest('hex');
	return hash.substring(0, 6).toUpperCase();
}

// Get transactions endpoint
app.get('/api/transactions', (req, res) => {
	const transactions = require('./mock/transactions.json');
	res.json(transactions);
});

// Health check endpoint
app.get('/', (req, res) => {
	res.json({
		message: 'Authentication API is running',
		endpoints: [
			'POST /api/getSecureWord',
			'POST /api/login',
			'POST /api/verifyMfa',
			'GET /api/transactions'
		]
	});
});

app.listen(port, () => {
	console.log(`Authentication API running on http://localhost:${port}`);
});
