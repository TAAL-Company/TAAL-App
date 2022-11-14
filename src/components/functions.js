export const isLoggedIn = () => {
	return localStorage.getItem('token');
};

export const getUserName = () => (
	localStorage.getItem('userName')
);

export const internetConnection = () => {
	const internetConditionFlag = navigator.onLine ? 'online' : 'offline';
	if (internetConditionFlag === 'online') {
		return new Promise((resolve) => {
			// Check for internet connectivity
			fetch('https://www.google.com/', {
				mode: 'no-cors',
			})
				.then(() => {
					resolve(true)
				}).catch(() => {
					resolve(false)
				})
		})

	} else
		return false
}