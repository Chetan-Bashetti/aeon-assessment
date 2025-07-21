import router from 'next/router';
import React from 'react';

const Links = ({ links }) => {
	const handleLogout = () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('token');
			router.replace('/login');
		}
	};

	return (
		<div className='links' style={{ display: 'flex' }}>
			{links.map((eachLink) => (
				<a href='/' key={eachLink} className='each-link'>
					{eachLink}
				</a>
			))}
			<div
				className='auth-btn'
				style={{ width: 'auto', padding: '0px 18px' }}
				onClick={handleLogout}
			>
				Login
			</div>
		</div>
	);
};

const Navbar = () => {
	const [isOpen, setIsOpen] = React.useState(false);

	const navLinks = [
		'Showcase',
		'Docs',
		'Blog',
		'Analysis',
		'Templates',
		'Enterprise'
	];

	return (
		<div className='navbar-wrapper'>
			<>
				<div className='navbar-xl'>
					<div className='navbar-content'>
						<div className='logo'>AEON</div>
						<Links links={navLinks} />
					</div>
					<div>
						<input
							className='search-input'
							placeholder='Search Documentation...'
						/>
					</div>
				</div>
			</>
			<div className='navbar-sm'>
				<div className='navbar-content'>
					<div className='logo'>AEON</div>
					<div className='md-icons'>
						<div className='icon'> &#128269;</div>
						{isOpen ? (
							<div
								className='icon'
								onClick={() => {
									setIsOpen(!isOpen);
								}}
							>
								&#120;
							</div>
						) : (
							<div
								className='icon'
								onClick={() => {
									setIsOpen(!isOpen);
								}}
							>
								&#8801;
							</div>
						)}
					</div>
				</div>
				<div className={isOpen ? 'navbar-md show' : 'navbar-md hide'}>
					<Links links={navLinks} />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
