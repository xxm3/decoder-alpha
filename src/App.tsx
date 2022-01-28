import { IonApp, IonButton, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import ReactGA from 'react-ga';

import Search from "./pages/Search";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { IUser } from "./types/User";
import { Route, Switch } from "react-router";
import "./App.css";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import UserContext from "./context/UserContext";
import { instance } from "./axios";

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

/* Pages */
import HomePage from "./pages/home/HomePage";
import Home from "./pages/home/Home";

// // TODO: not working? https://analytics.google.com/analytics/web/#/p301084891/reports/reportinghub -- also in index.html
// // https://javascript.plainenglish.io/how-to-setup-and-add-google-analytics-to-your-react-app-fd361f47ac7b
const TRACKING_ID = "G-Z3GDFZ53DN";
ReactGA.initialize(TRACKING_ID);

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
                user.getIdToken().then(
                    (token) => {
                        (instance.defaults.headers.common.Authorization = `Bearer ${token}`);

                        setUser({id: user.uid });
                    });
            } else {
                setUser(null);
                instance.defaults.headers.common = {};
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
									// component={HomePage}
                                    component={Home}
									exact
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

// const App = () => (
//     <IonApp>
//         <IonReactRouter>
//             <IonRouterOutlet>
//                 { /* <Route path="/" component={isLoggedIn ? home : Login} exact /> */}

//                 {/* Old Home */}
//                  <Route path="/" component={Home} exact />

//                 {/* New Home */}
//                 {/*<Route path="/" component={HomePage} exact />*/}

//                 {/* Search */}
//                 <Route path="/search/:id" exact={true}>
//                     <Search />
//                 </Route>
//                 {/* <Route path="/message/:id">
//                     <ViewMessage />
//                 </Route> */}
//                 {/* <Route path="/mint" component={ Mint } /> */}
//                 {/* <Route path="/game" component={ Game } /> */}
//             </IonRouterOutlet>
//         </IonReactRouter>
//     </IonApp>
// );

export default App;
