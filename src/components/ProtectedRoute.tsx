import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";
import { useUser } from "../context/UserContext";
import { isDev } from "../environments/environment";
import { RootState } from "../redux/store";
import AppRoute from "./Route";

/**
 * Descriptions of the login flow on Login.tsx
 */

// a route to be used to protect pages against unauthenticated users
const ProtectedRoute = (props: Parameters<typeof AppRoute>[0] & {
	needsRole ?: boolean
}) => {
	const user = useUser();
	const needsRole = props.needsRole ?? true;
	const hasRoles = useSelector<RootState>(state => state.user.hasRoles);

	return user
        || isDev
    ? (
		(needsRole && !isDev ? hasRoles : true) ?
            <AppRoute {...props} /> :
            <AppRoute {...props} component={() => <div>You cannot access this page</div>} />
	) : (
		<Route
			{...props}
			render={() => (
				// if user is not authenticated redirect user to login page
			<Redirect to={`/login?next=${props.path}`} />
			)}
			component={undefined}
			children={undefined}
		/>
	);
};

export default ProtectedRoute;



