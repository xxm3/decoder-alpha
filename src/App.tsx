import { IonApp, IonCol, IonContent, IonGrid, IonMenu, IonPage, IonRouterOutlet, IonRow, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Network } from '@capacitor/network';
// import { useEffect, useState } from "react";
// import Search from "./pages/Search";
// import Login from "./pages/Login";
import { useEffect, useRef, useState } from "react";
import { auth } from "./firebase";
import { IUser } from "./types/User";
import { Route } from "react-router";
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
import Theme from "./theme/Theme";
import FoxToken from "./pages/FoxToken";
import NftPriceTable from "./pages/NftPriceTable";
import StackedSearch from "./pages/StackedSearch";
import { css } from "@emotion/react";
import Alerts from "./pages/Alerts";
import { useDispatch } from "react-redux"
import { setDemo } from "./redux/slices/demoSlice";
import PrivacyPolicy from './pages/home/PrivacyPolicy';
import { getPlatforms, isPlatform, getConfig } from '@ionic/react';


const App = () => {

const [networkState, setNetworkState] = useState(true);

//offline Online
	useEffect(() => {
		statusCheck()
		const loadEvent = () => {
			window.addEventListener('online', ()=>{
				setNetworkState(true)
			});
			window.addEventListener('offline', ()=>{
				setNetworkState(false)
			});
		}
		window.addEventListener('load', loadEvent);
		
	}, [])


	const statusCheck = async () => {
		const status = await Network.getStatus();
		setNetworkState(status.connected)
	}
	
	/*
		state which stores the user. It has 3 states:
		1. undefined : User data is still loading
		2. null : User is not authenticated
		3. { id : "USERS_ID"} : user is authenticated
	*/
	const [user, setUser] = useState<IUser | null | undefined>(undefined);


	// const [walletAddress, setWalletAdress] = useState(null);

	const isAnonymous = useRef<boolean | null>(null);
	const dispatch = useDispatch()
	useEffect(() => {
        // first redirect if on old URL
        // if (window.location.hostname.indexOf('localhost') === -1 && window.location.hostname.indexOf('soldecoder.app') === -1) {
        //     window.location.replace("https://soldecoder.app");
        // }

        // code that is supposed to update the authorization header whenever the token changes
		return auth.onAuthStateChanged(context => {
			if (context) {
                setUser({ id: context.uid });
				isAnonymous.current = context.isAnonymous;
				if(context.isAnonymous){
					dispatch(setDemo(true));
				}
            } else {
				if(isAnonymous.current){
					dispatch(setDemo(false))
				}
				isAnonymous.current = null;
                setUser(null);
            }
		})
	}, []);

	return (
<>
			{networkState ?        <IonApp>
            <Theme>
                <QueryClientProvider client={queryClient}>
                    <UserContext.Provider value={user}>
					{(user !== undefined) ? (
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
	                                                        <IonSplitPane when="md" contentId="main"
																css={css`
																	@media only screen and (min-width:768px) and (max-width:992px){
																			--side-min-width: none;
																	}
																`}>
	                                                            <IonMenu menuId="sidebar" contentId="main">
	                                                                <Sidebar />
	                                                            </IonMenu>
	                                                            <IonContent className="h-full" id="main">
	                                                                <IonRouterOutlet>
                                                                        {/*home page, after authenticated*/}
	                                                                    <ProtectedRoute
	                                                                        path="/" component={ Home } exact
	                                                                    />

                                                                        {/*searched on something*/}
	                                                                    <ProtectedRoute
	                                                                        path="/search/:id" exact={true} component={Search}
	                                                                    />

                                                                        {/* todays mints*/}
	                                                                    <ProtectedRoute
	                                                                        exact path="/schedule" component={Schedule}
	                                                                    />

                                                                        {/* fox token market */}
                                                                        <ProtectedRoute
                                                                            exact path="/foxtoken" component={FoxToken}
                                                                        />

                                                                        {/* mint alert automated - stats */}
                                                                        <ProtectedRoute
                                                                            exact path="/mintstats" component={NftPriceTable}
                                                                        />

                                                                        {/* Stacked Line Search */}
                                                                        <ProtectedRoute
                                                                            exact path="/stackedsearch" component={StackedSearch}
                                                                        />

                                                                        {/* Alerts */}
                                                                        <ProtectedRoute
                                                                            exact path="/alerts" component={Alerts}
                                                                        />

                                                                        {/*login button etc...*/}
	                                                                    <AppRoute
	                                                                        exact path="/login" component={ Login}
	                                                                    />
                                                                        {/* privacy policy */}
                                                                        <AppRoute
                                                                            exact path="/privacy" component={ PrivacyPolicy }
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
	                       <IonReactRouter>
							   <IonRouterOutlet>
								   <Route>
									   <IonPage>
										   <IonContent fullscreen>
							   					<div className="flex h-full w-full justify-center items-center">
													   <Loader />
												</div>
										   </IonContent>
									   </IonPage>
								   </Route>
							   </IonRouterOutlet>
							</IonReactRouter>
	                    )}
                        <ReactQueryDevtools initialIsOpen />
                    </UserContext.Provider>
                </QueryClientProvider>
            </Theme>
        </IonApp>
:
				<>
				
					<div className=" flex items-center justify-center align-middle	h-full " > <div className="text-3xl text-slate-400">Network is not found. Please check your internet connection.</div></div>
				</>

			}
		</>    );
};

export default App;
