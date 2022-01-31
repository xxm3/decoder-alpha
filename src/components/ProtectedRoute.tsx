import React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { useUser } from "../context/UserContext";

// a route to be used to protect pages against unauthenticated users
const ProtectedRoute = (props: RouteProps) => {
	const user = useUser();
	return user || (window.location.href.indexOf('localhost') !== -1) ? (
		<Route {...props} />
	) : (
		<Route
			{...props}
			render={({ location }) => (
				// if user is not authenticated redirect user to login page
				<Redirect to={`/login?next=${location.pathname}`} />
			)}
			component={undefined}
			children={undefined}
		/>
	);
};

export default ProtectedRoute;
