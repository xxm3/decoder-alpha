import {IonButton, IonCard, IonRouterLink, isPlatform} from '@ionic/react';
import {useEffect, useMemo, useState} from 'react';
import {Redirect} from 'react-router';
import {instance} from '../axios';
import Loader from '../components/Loader';
import {useUser} from '../context/UserContext';
import {environment} from '../environments/environment';

import {auth} from '../firebase';
import {  signInAnonymously, signInWithCustomToken ,browserSessionPersistence} from "firebase/auth";

import "./Login.css"
import { InAppBrowser }  from "@awesome-cordova-plugins/in-app-browser"
import { useDispatch } from "react-redux"
import { setDemo } from '../redux/slices/demoSlice';
import NavLink from '../components/nav/NavLink';

/**
 * The "Login" page to which all unauthenticated users are redirected to
 *
 * Frontend Workflow:
 * - user hits the site, and hits "ProtectedRoute.tsx" (which ignores localhost)
 * - ProctedRoute.tsx brings them to Login.tsx
 * - Login.tsx sends them to discord_auth.js, to get a token from discord
 * - discord_auth.js goes to discord and gets a token, returns it to login.tsx
 * - Login.tsx signs them in
 *
 * - also axios.ts is used for getting new tokens
 * - also environment.js sets isDev (OVERRIDES FOR LOCAL), also read from ProtectedRoute.tsx to protect our routes or not
 *
 * Backend
 * - middleware is in from verify.js
 *   - has some (OVERRIDES FOR LOCAL) to skip logging in via localhost
 */

function Login() {

	const dispatch = useDispatch();
    const user = useUser();
    const { nextUrl, urlCode, discordError } = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        // the login page also works as the redirect page for discord oauth

        // authorization code returned by discord in the search query after user authorises the site
        const urlCode = params.get('code');

        // the url to redirect to after user succesfully logs in
        const nextUrl = params.get('next') || params.get('state') || '/';
        // the error , if any, returned by discord
        const discordError = params.get('error_description');
        return { urlCode, nextUrl, discordError };
    }, []);

    const [error, setError] = useState(discordError);

    const [code,setCode] = useState(urlCode);
    const [next,setNext] = useState(nextUrl);

    // loading state which stores whether an access token is being issued or not
    const [loading, setLoading] = useState(!!code);


    const isMobileDevice = useMemo(() => isPlatform("mobile"), []);

    useEffect(() => {
        if (code && !error && !user) {
            // exchange authorization code given by discord for an access token which we can sign in with using firebase
            // this is defined on discord_auth.js

            // console.log(code)
            instance
                .post(
                    '/getToken',
                    { code },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then(({ data }) => {
                    // console.log(data);
					// auth.setPersistence(browserLocalPersistence)
                    return signInWithCustomToken(auth, data.body);
                })
                .catch((e) => {
                    console.log(e);
                    if (e.response?.status === 403)
                        setError("You need a proper role in Discord before accessing the site. Buy the NFT then go to the 'matrica-verify'channel");
                    else setError('Something went wrong. Please try again, and try using a VPN program, not a VPN in your browser (ie. people in Russia currently banned by Google)');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [code, error, user]);
    // if user is already authenticated redirect them to the last page they were on if any. or otherwise to the home page

    // if user is authenticated, redirect user to previous page
    return user ? (
        <Redirect to={next} />
    ) : (
        <>
            {!loading ? (
                <>
                    {/*text-center*/}
                    <div className="">
                    <IonButton
                        onClick={() => {
                            const params = new URLSearchParams();
                            params.set(
                                'redirect_uri',
                                `${!isMobileDevice ? window.location.origin : environment.ionicAppUrl}/login`
                            );
                            params.set('state', next);
                            const urlToRedirect = `https://discord.com/api/oauth2/authorize?client_id=${
                                environment.clientId
                            }&response_type=code&scope=identify&${params.toString()}`;
                            setError("")
                            if(isMobileDevice){
                                const browser = InAppBrowser.create(urlToRedirect, '_blank', 'location=yes');
                                browser.on("beforeload")
                                browser.on('loadstart').subscribe(event => {
                                    const eventUrl = new URL(event.url)
                                    if(eventUrl.origin === environment.ionicAppUrl && eventUrl.pathname === '/login'){
                                        const code = eventUrl.searchParams.get('code');
                                        if(code){
                                            setCode(code)
                                            setLoading(true)
                                        };
                                        setNext(eventUrl.searchParams.get("next") || eventUrl.searchParams.get('state') || "/");
                                        browser.close();
                                    }
                                })
                            }
                            else{
                                window.location.href = urlToRedirect;
                            }
                        }}
                    >
                        Login with Discord
                    </IonButton>

                    <p className="text-red-500 my-4 text-xl">
                        {error}
                    </p>

                    <div className="p-4">
                        <div id="welcome">
                            <p className="font-bold">Welcome to SOL Decoder Hello</p>

                            <ul className="">
                                <li>
                                    Use of the site / apps is locked to holders of one of our NFTs, <a href="https://magiceden.io/marketplace/soldecoder" className="underline" target="_blank">which you can purchase here</a>.
                                    <br/>
                                    After purchasing one,
                                    please join <a href="https://discord.gg/sol-decoder" target="_blank" style={{"textDecoration": "underline"}}>our Discord</a> and verify with Matrica to get a role which allows access to the site.
                                </li>
                            </ul>
                        </div>
                        <br/>

                        <div id="security">
                            <p className="font-bold">Other links:</p>
                            <ul>
                                <li>Follow us <a href="https://twitter.com/SOL_Decoder" target="_blank" className="underline">on Twitter</a></li>
                                <li>Read our <a href="https://docs.soldecoder.app" target="_blank" className="underline">docs here</a> </li>
                                <li>
                                    Read our <IonRouterLink href="/privacy" className="pr-7 underline text-inherit">Privacy Policy</IonRouterLink>
                                </li>
                            </ul>

                            <br/>

                            <hr/>
                            <br/>

                            <p className="font-bold">Want to try a demo?</p>

                            <p>Full access to SOL Decoder is only available to those holding one of our NFTs. If you still want to click around the site to
                            see what we offer, then try out the demo below. Note that you will only see old data, and some features are disabled.</p>
                            <br/>

                            <IonButton onClick={() => {
                                // auth.setPersistence(browserSessionPersistence)
                                signInAnonymously(auth)
                            }}>Try the demo</IonButton>

                            {/*<p className="font-bold">A note on Discord integration</p>*/}
                            {/*<ul>*/}
                            {/*    <li>We require you to login with Discord, so that we can verify you have the proper role(s)</li>*/}
                            {/*    <li>Note the permissions, seen when you click the Login button:</li>*/}
                            {/*    <li style={{paddingLeft: "8px"}}>(1) Access your username, avatar, and banner</li>*/}
                            {/*    <li style={{paddingLeft: "8px"}}>(2) This application cannot read your messages or send messages as you.</li>*/}
                            {/*    <li>The site can never read any of your Discord messages, and asks for the most limited amount of permissions.</li>*/}
                            {/*</ul>*/}
                        </div>

                    </div>

                    </div>
                </>

            ) : (
                <div className="h-48 w-48">
                    <Loader />
                </div>
            )}
        </>
    );
}

export default Login;
