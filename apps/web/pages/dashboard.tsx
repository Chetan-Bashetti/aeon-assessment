import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../services/api';
import { TransactionResponse } from '../types/auth';

const Dashboard = () => {
	const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
	const router = useRouter();

	useEffect(() => {
		const token =
			typeof window !== 'undefined' ? localStorage.getItem('token') : null;
		if (!token) {
			router.replace('/');
			return;
		}
		const fetchTransactions = async () => {
			const response = await authAPI.getTransactions();
			setTransactions(Array.isArray(response) ? response : [response]);
		};
		fetchTransactions();
	}, [router]);

	return (
		<div className='dashboard-container'>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 24
				}}
			>
				<h1>Dashboard</h1>
			</div>
			<table className='dashboard-table'>
				<thead>
					<tr>
						<th>Date</th>
						<th>Reference ID</th>
						<th>To</th>
						<th>Transaction Type</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					{transactions.length === 0 ? (
						<tr>
							<td colSpan={5} style={{ textAlign: 'center', padding: 16 }}>
								No transactions found.
							</td>
						</tr>
					) : (
						transactions.map((transaction, idx) => (
							<tr key={transaction?.reference_id || idx}>
								<td>{transaction?.transaction_date}</td>
								<td>{transaction?.reference_id}</td>
								<td>
									<div className='dashboard-table-recipient'>
										<p>{transaction?.transaction_recipient?.name}</p>
										<p>{transaction?.transaction_recipient?.email}</p>
									</div>
								</td>
								<td>{transaction?.transaction_type}</td>
								<td>{transaction?.transaction_amount}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Dashboard;
