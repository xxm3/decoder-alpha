import React from "react";
import { Redirect, Route } from "react-router";
import { useUser } from "../context/UserContext";
import { isDev } from "../environments/environment";
import AppRoute from "./Route";

// a route to be used to protect pages against unauthenticated users
const ProtectedRoute = (props: Parameters<typeof AppRoute>[0]) => {
	const user = useUser();
	return user
        || isDev
    ? (
		<AppRoute {...props} />
	) : (
		<Route
			{...props}
			render={() => (
				// if user is not authenticated redirect user to login page
			<Redirect to={`/login?next=${props.path ?? "/"}`} />
			)}
			component={undefined}
			children={undefined}
		/>
	);
};

export default ProtectedRoute;



