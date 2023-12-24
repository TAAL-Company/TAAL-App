import noRoute from "./NO-Route.json";
import wpRoute from "./WP-Route.json";

export const isLoggedIn = () => {
	return localStorage.getItem('token');
};
export const handleLogout = () => {
	console.log('logout');
	localStorage.removeItem("token");
	window.location.href = "/";
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

export const nodeRouteAdapter = (routedata) => {
	// wpRoute.id=noRoute.id
	// wpRoute.title=noRoute.name
	// wpRoute.=noRoute.picture_url --- ??
	// wpRoute.places=noRoute.sites --- ?? 

	// ----users---
	// wpRoute.acf.users[0].ID = noRoute.students[0].id
	// wpRoute.acf.users[0]. = noRoute.students[0].coachId --- ??
	// wpRoute.acf.users[0].user_email = noRoute.students[0].email
	// wpRoute.acf.users[0].display_name = noRoute.students[0].name
	// wpRoute.acf.users[0]. = noRoute.students[0].phone --- ??
	// wpRoute.acf.users[0].user_avatar = noRoute.students[0].picture_url
	// wpRoute.acf.users[0]. = noRoute.students[0].role --- ??
	// wpRoute.acf.users[0].user_nicename = noRoute.students[0].user_name

	// ----tasks----
	// wpRoute.acf.tasks[0]. = noRoute.tasks[0]. -- ?? need a loop 
	console.log("route data", routedata);
}
export const nodePlacesAdapter = (Placesdata) => {
	console.log("Places data", Placesdata);
}