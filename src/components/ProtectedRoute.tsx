import React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { useUser } from "../context/UserContext";

const ProtectedRoute = (props: RouteProps) => {
	const user = useUser();
	return user ? (
		<Route {...props} />
	) : (
		<Route
			{...props}
			render={({ location }) => (
				<Redirect to={`/login?next=${location.pathname}`} />
			)}
			component={undefined}
			children={undefined}
		/>
	);
};

export default ProtectedRoute;
