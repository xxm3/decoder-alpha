import { IonApp, IonCol, IonContent, IonGrid, IonMenu, IonPage, IonRouterOutlet, IonRow, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
// import { useEffect, useState } from "react";
// import Search from "./pages/Search";
// import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { IUser } from "./types/User";
import { Route as DefaultRoute, Route } from "react-router";
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
import Style from "./components/Style";
import Theme from "./theme/Theme";


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


	const [loadingGif, setLoadingGif] = useState(true)
	useEffect(() => {
		const id = setTimeout(() => {
			setLoadingGif(false)
		}, 8000)
		return () => clearTimeout(id)
	}, [])


	return (
        <IonApp>
            <Theme>
            	<QueryClientProvider client={queryClient}>
	                <UserContext.Provider value={user}>
	                    {(user !== undefined && !loadingGif) ? (
	                        <>
	                            <IonReactRouter>
	                                <IonRouterOutlet id="router">
	                                    <Route>
	                                        <IonPage>
	                                            <IonGrid className="w-screen h-screen flex flex-col relative">
	                                                <IonRow>
	                                                    <IonCol size="12">
	                                                        <HeaderContainer />
	                                                    </IonCol>
	                                                </IonRow>
	                                                <IonRow className="flex-grow">
	                                                    <IonCol
	                                                        size="12"
	                                                        className="flex h-full"
	                                                    >
	                                                        <Style>
	                                                            {`
																	@media only screen and (min-width:768px) and (max-width:992px){ 
																		ion-split-pane {
																			--side-min-width: none;
																		}
																	}
																	
																		
																`}
	                                                        </Style>
	                                                        <IonSplitPane
	                                                            when="md"
	                                                            contentId="main"
	                                                        >
	                                                            <IonMenu
	                                                                menuId="sidebar"
	                                                                contentId="main"
	                                                            >
	                                                                <Sidebar />
	                                                            </IonMenu>
	                                                            <IonContent
	                                                                className="h-full"
	                                                                id="main"
	                                                            >
	                                                                <IonRouterOutlet>
	                                                                    <ProtectedRoute
	                                                                        path="/"
	                                                                        component={
	                                                                            Home
	                                                                        }
	                                                                        exact
	                                                                    />
	
	                                                                    <ProtectedRoute
	                                                                        path="/search/:id"
	                                                                        exact={
	                                                                            true
	                                                                        }
	                                                                        component={
	                                                                            Search
	                                                                        }
	                                                                    />
	                                                                    <AppRoute
	                                                                        exact
	                                                                        path="/Schedule"
	                                                                        component={
	                                                                            Schedule
	                                                                        }
	                                                                    />
	                                                                    <AppRoute
	                                                                        exact
	                                                                        path="/Login"
	                                                                        component={
	                                                                            Login
	                                                                        }
	                                                                    />
	                                                                </IonRouterOutlet>
	                                                            </IonContent>
	                                                        </IonSplitPane>
	                                                    </IonCol>
	                                                </IonRow>
	                                            </IonGrid>
	                                        </IonPage>
	                                    </Route>
	                                </IonRouterOutlet>
	                            </IonReactRouter>
	                        </>
	                    ) : (
	                        <div className="mx-auto my-auto h-48 w-48">
	                            <img src="/assets/site-logos/Logo_Sol_decoder/Terminados/Gif/logo.gif" />
	                        </div>
	                    )}
	                    <ReactQueryDevtools initialIsOpen />
	                </UserContext.Provider>
	            </QueryClientProvider>
            </Theme>
        </IonApp>
    );

};



export default App;
