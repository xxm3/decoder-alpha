import { IonApp, IonButton, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

// /* Pages */
// import Home from './pages/home/Home';
// import Mint from "./pages/mint/Mint";
// import Game from "./pages/game/Game";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Theme variables */
import "./theme/variables.css";

import Search from "./pages/Search";
import Login from "./pages/Login";
import Home from "./pages/home/Home";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { IUser } from "./types/User";
import { Route, Switch } from "react-router";
import "./App.css";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import UserContext from "./context/UserContext";

// import { createBrowserHistory } from "history";

// const history = createBrowserHistory();

const App = () => {
	/* 
		state which stores the user. It has 3 states:
		1. undefined : User data is still loading
		2. null : User is not authenticated
		3. { id : "USERS_ID"} : user is authenticated
	*/

	const [user, setUser] = useState<IUser | null | undefined>(undefined);
	useEffect(() => {
		return auth.onAuthStateChanged((user) => {
			if (user) {
				setUser({
					id: user.uid,
				});
			} else {
				setUser(null);
				// if user is not authenticated, redirect them to the login page
				// let next = window.location.pathname;
				// if (next === "/Login") next = "/";
				// history.push(`/Login?next=${next}`);
			}
		});
	}, []);

	return (
		<IonApp>
			<UserContext.Provider value={user}>
				{user !== undefined ? (
					<IonReactRouter>
						<IonRouterOutlet>
							<Switch>
								<ProtectedRoute
									path="/"
									exact={true}
									render={() => (
										<IonButton
											onClick={() => auth.signOut()}
										>
											Sign out
										</IonButton>
									)}
								/>

								<ProtectedRoute
									path="/search/:id"
									exact={true}
									component={Search}
								/>
								<Route exact path="/Login" component={Login} />
							</Switch>

							{/* <Route path="/message/:id">
				                <ViewMessage />
				              </Route> */}
							{/* <Route path="/mint" component={ Mint } /> */}
							{/* <Route path="/game" component={ Game } /> */}
						</IonRouterOutlet>
					</IonReactRouter>
				) : (
					<div className="mx-auto my-auto h-48 w-48">
						<Loader />
					</div>
				)}
			</UserContext.Provider>
		</IonApp>
	);
};

export default App;
