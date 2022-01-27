import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import ReactGA from 'react-ga';

// /* Pages */
// import Home from './pages/home/Home';
// import Mint from "./pages/mint/Mint";
// import Game from "./pages/game/Game";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';

import Search from './pages/Search';
import ViewMessage from './pages/ViewMessage';
// Old Home
// import Home from './pages/home/Home';

// New Home
import HomePage from './pages/home/HomePage';
import Home from "./pages/home/Home";

// TODO: not working? https://analytics.google.com/analytics/web/#/p301084891/reports/reportinghub -- also in index.html
// https://javascript.plainenglish.io/how-to-setup-and-add-google-analytics-to-your-react-app-fd361f47ac7b
const TRACKING_ID = "G-Z3GDFZ53DN";
ReactGA.initialize(TRACKING_ID);

const App = () => (
    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet>
                { /* <Route path="/" component={isLoggedIn ? home : Login} exact /> */}

                {/* Old Home */}
                 <Route path="/" component={Home} exact />
                
                {/* New Home */}
                {/*<Route path="/" component={HomePage} exact />*/}

                {/* Search */}
                <Route path="/search/:id" exact={true}>
                    <Search />
                </Route>
                {/* <Route path="/message/:id">
                    <ViewMessage />
                </Route> */}
                {/* <Route path="/mint" component={ Mint } /> */}
                {/* <Route path="/game" component={ Game } /> */}
            </IonRouterOutlet>
        </IonReactRouter>
    </IonApp>
);

export default App;
