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

    // all routes need a role, unless needsRole: False is set on App.tsx
	const needsRole = props.needsRole ?? true;

    // set in App.tsx -- gets read from /getToken endpoint
	const hasRoles = useSelector<RootState>(state => state.user.hasRoles);
    // console.log(hasRoles);

	return user
        // ### skip if in dev
        || (isDev )
    ? (
		(needsRole
            // ### skip if in dev
            && !isDev
            ? hasRoles : true) ?
            <AppRoute {...props} /> :

            <AppRoute {...props} component={() => <div>

                <div className='text-xl'>Adding Discord Bots?</div>
                If you are looking to add our Discord bots to your server (including giving out your whitelist to other Discords with Seamless) - then <a className='cursor-pointer underline' href='/manageserver'>click here</a>
                <br/> <br/>

                <div className='text-xl'>Get whitelisted with Seamless?</div>
                If you are looking to get whitelisted onto a new mint - then <a className='cursor-pointer underline' href='/whitelistmarketplace'>click here</a>
                <br/> <br/>

                <div className='text-xl'>Doing something else?</div>
                You cannot access this page (SOL Decoder holders only). If you feel this is an error, click "Logout" on bottom left and log back in, or otherwise buy 1 of our NFTs on Magiceden. After purchasing, you must verify within the SOL Decoder Discord (metahelix-verify channel), and then login with Discord on this website.

            </div>} />
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



