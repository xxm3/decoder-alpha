import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
// import { useEffect, useState } from "react";
// import Search from "./pages/Search";
// import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { IUser } from "./types/User";
import { Switch } from "react-router";
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
import Home from "./pages/home/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Schedule from "./pages/schedule/Schedule";
import { IonCol, IonContent, IonGrid, IonMenu, IonRouterLink, IonRow } from "@ionic/react"

// // https://javascript.plainenglish.io/how-to-setup-and-add-google-analytics-to-your-react-app-fd361f47ac7b
// const TRACKING_ID = "G-Z3GDFZ53DN";
// ReactGA.initialize(TRACKING_ID);


import {
	QueryClientProvider,
  } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"
import { queryClient } from "./queryClient";
import AppRoute from "./components/Route";
import HeaderContainer from "./components/nav/Header";
import WalletButton from "./components/WalletButton";
import Sidebar from "./components/nav/Sidebar";


const App = () => {

	/*
		state which stores the user. It has 3 states:
		1. undefined : User data is still loading
		2. null : User is not authenticated
		3. { id : "USERS_ID"} : user is authenticated
	*/
	const [user, setUser] = useState<IUser | null | undefined>(undefined);

	// const [walletAddress, setWalletAdress] = useState(null);

	useEffect(() => {

        // first redirect if on old URL
        if (window.location.hostname.indexOf('localhost') === -1 && window.location.hostname.indexOf('soldecoder.app') === -1) {
            window.location.replace("https://soldecoder.app");
        }

		return auth.onIdTokenChanged(user => {
            console.log(user);
			if (user) {
                user.getIdToken().then(
                    (token) => {
                        (instance.defaults.headers.common.Authorization = `Bearer ${token}`);

                        setUser({ id: user.uid });
                    });
            } else {
                setUser(null);
                instance.defaults.headers.common = {};
            }
		})
	}, []);




	return (
        <IonApp id="main">
            <QueryClientProvider client={queryClient}>
                <UserContext.Provider value={user}>
                    {user !== undefined ? (
                        <>
                            <IonMenu
                                menuId="sidebar"
                                contentId="router"
                            >
                               <Sidebar />
                            </IonMenu>
                            <IonReactRouter>
                                <IonRouterOutlet id="router">
                                    <Switch>
                                        {/* <ProtectedRoute
											path="/"
											exact={true}
											render={() => (
												<IonButton
													onClick={() => auth.signOut()}
												>
													Sign out
												</IonButton>
											)}
										/> */}

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
                                        <AppRoute
                                            exact
                                            path="/Schedule"
                                            component={Schedule}
                                        />
                                        <AppRoute
                                            exact
                                            path="/Login"
                                            component={Login}
                                        />
                                    </Switch>
                                </IonRouterOutlet>
                            </IonReactRouter>
                        </>
                    ) : (
                        <div className="mx-auto my-auto h-48 w-48">
                            <Loader />
                        </div>
                    )}
                    <ReactQueryDevtools initialIsOpen />
                </UserContext.Provider>
            </QueryClientProvider>
        </IonApp>
    );

};



export default App;
