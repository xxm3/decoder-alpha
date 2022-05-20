import {IonButton, IonCard, IonCol, IonIcon, IonLabel, IonRouterLink, IonRow, isPlatform} from '@ionic/react';
import React, {useEffect, useMemo, useState} from 'react';
import {Redirect, useHistory} from 'react-router';
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
import IosLogo from '../images/app-store.png'
import AndroidLogo from '../images/playstore.png'
import { Grid } from '@material-ui/core';
import {logoDiscord, logoTwitter,logoYoutube} from "ionicons/icons";
import usePersistentState from '../hooks/usePersistentState';
import meLogo from '../images/me.png';




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
    const history = useHistory()
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

    //check open in mobile-web or Browser
    const DeviceCheck = isPlatform('mobileweb');
    const [mode] = usePersistentState("mode", "dark");



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
                    localStorage.setItem('servers',JSON.stringify(data.servers))
                    localStorage.setItem('roleList',JSON.stringify(data.roles))
                    return signInWithCustomToken(auth, data.body);
                })
                .catch((e) => {
                    console.log(e);
                    if (e.response?.status === 403)
                        // TODO: !! undo this etc...
                        // You need a proper role in Discord before accessing the site. Buy the NFT then go to our Discord and verify
                        setError("Please join our Discord, then you may get access during this free weekend event.");
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
        // null
        <Redirect to={next} />
    ) : (
        <>
            {!loading ? (
                <>
                 {DeviceCheck ?
                        <>
                            <IonRow>
                                <IonCol size='6' >
                                    <IonButton href="#"  className='iosButton ionTextRight' fill='clear'
                                        onClick={() =>{
                                           window.open( `https://apps.apple.com/in/app/sol-decoder/id1619922481`);
                                        }} >
                                            <img src={IosLogo} />
                                    </IonButton>
                                </IonCol>
                                <IonCol size='6'  >
                                    <IonButton href="#" className='androidButton ionTextLeft' fill='clear'
                                        onClick={() =>{
                                            window.open( `https://play.google.com/store/apps/details?id=com.soldecoder.app`);
                                        }} >
                                        <img src={AndroidLogo} />
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </>
                        : ''}
                    {/*text-center*/}
                    <div className= {`flex ${isMobileDevice ? 'flex-col': 'flex-row'}`}>
                            <div className={` ${isMobileDevice ? 'w-full mt-4' : 'w-1/3 mt-10' }`}>
                                <div className={`${isMobileDevice ? "text-center" : ""}`}>
                                    <IonLabel className={`text-4xl font-bold`}>
                                        Sign In
                                    </IonLabel>
                                </div>
                                <div className={`flex flex-col mr-2 ${isMobileDevice ? "mt-6" : 'mt-10'}`}>
                                    <IonButton className='mb-4 h-11' color={ mode === 'dark' ? '' : "dark"}
                                        onClick={() => {
                                            const params = new URLSearchParams();
                                            params.set(
                                                'redirect_uri',
                                                `${!isMobileDevice ? window.location.origin : environment.ionicAppUrl}/login`
                                            );
                                            params.set('state', next);
                                                const urlToRedirect = `https://discord.com/api/oauth2/authorize?client_id=${
                                                environment.clientId
                                                }&response_type=code&scope=identify+guilds&${params.toString()}`;
                                                setError("")
                                                if(isMobileDevice){
                                                    const browser = InAppBrowser.create(urlToRedirect, '_blank', 'location=yes');
                                                    browser.on("beforeload")
                                                    browser.on('loadstart').subscribe(event => {
                                                        const eventUrl = new URL(event.url)
                                                        if(eventUrl.origin === environment.ionicAppUrl && eventUrl.pathname === '/login'){
                                                            const code = eventUrl.searchParams.get('code');
                                                            if(code){ setCode(code); setLoading(true) };
                                                            setNext(eventUrl.searchParams.get("next") || eventUrl.searchParams.get('state') || "/");
                                                            browser.close();
                                                        }
                                                    })
                                                }
                                                else { window.location.href = urlToRedirect; }
                                        }} >
                                            { <IonIcon icon={logoDiscord} className="big-emoji mr-3"/>} Login with Discord
                                    </IonButton>
                                    <div className='flex flex-row items-center justify-between ml-1 mr-1'>
                                        <div className='login-btn-devider'/> OR <div className='login-btn-devider'/>
                                    </div>
                                    <IonButton className='buy-nft-btn mt-4 h-11'color='medium' onClick={()=> window.open('https://magiceden.io/marketplace/soldecoder', "_blank")}>
                                        <img src={meLogo} className="me-logo mr-2"/>
                                        Buy 1 NFT to gain access
                                    </IonButton>
                                    <IonButton className='buy-nft-btn mt-3 h-11' color='medium' onClick={()=> window.open('https://discord.gg/sol-decoder', "_blank")}>
                                        { <IonIcon icon={logoDiscord} className="big-emoji mr-2"/>}
                                        Join the Discord
                                    </IonButton>
                                </div>
                            </div>


                            <div className={`login-right-side-wrapper w-full justify-center flex flex-col rounded-md ${isMobileDevice ? 'pl-4 mt-4 pb-4 pt-4 pr-2' : 'pl-10 pr-4' }`} style={{height:isMobileDevice ? 'auto'  : '84vh' }}>

                                {/*this is the error msg at top! no delete!*/}
                                <p className="text-red-500 my-4 text-xl">
                                    {error}
                                </p>

                                <div className="title-text text-4xl font-bold flex">
                                    New to<br/>SOL Decoder ?
                                </div>
                                <div className={`title-text flex flex-col mt-4`}>
                                    <span>Use of the site / apps is locked to holders of one of our NFTs, <a href="https://magiceden.io/marketplace/soldecoder" className="underline" target="_blank">which you can purchase on the left.</a> </span>
                                    <br/>
                                    <span>After purchasing one, please join <a href="https://discord.gg/sol-decoder" target="_blank" style={{"textDecoration": "underline"}}>our Discord</a> and verify to get a role which allows access to the site / apps.</span>
                                    <br/>

                                    <span>  Follow us <a href="https://twitter.com/SOL_Decoder" target="_blank" className="underline">on Twitter<IonIcon icon={logoTwitter} className="big-emoji ml-1"/></a></span>
                                    <span>Read a Twitter thread of what we do <a href="https://twitter.com/SOL_Decoder/status/1516759793884712965 " target="_blank" className="underline">here</a></span>

                                    <span>Read our <a href="https://docs.soldecoder.app" target="_blank" className="underline">docs here</a> </span>

                                    <div >View our official YouTube channel to view videos about our website / Discord <a href="https://www.youtube.com/playlist?list=PLeuijfzk0Wfv3rgrurWKo26l7rNy4lJE_" target="_blank" className="underline">here <IonIcon icon={logoYoutube} className="big-emoji ml-1"/></a></div>
                                    <span> Read our <IonRouterLink href="/privacy" className="pr-7 underline text-inherit">Privacy Policy</IonRouterLink> </span>
                                    <br/>
                                    <hr/>
                                    <br/><span>Full access to SOL Decoder is only available to those holding one of our NFTs. If you still want to click around the site to see what we offer, then try out the demo below. Note that you will only see old data, and some features are disabled.</span>

                                    <div className={`mt-4 flex ${isMobileDevice ? 'self-center flex-col' : ' flex-row'}`}>
                                        <IonButton className='h-11 w-48' color="dark" onClick={() => {signInAnonymously(auth)}}>
                                            Try our demo
                                        </IonButton>

                                        {/*<IonButton className={`buy-nft-btn h-11 w-48 ${isMobileDevice ? '' : 'ml-4'}`} color='medium' onClick={()=> window.open('https://docs.soldecoder.app', "_blank")}>*/}
                                        {/*    Documentation*/}
                                        {/*</IonButton>*/}
                                    </div>
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
