import {IonButton, IonCard } from '@ionic/react';
import {useEffect, useMemo, useState} from 'react';
import {Redirect} from 'react-router';
import {instance} from '../axios';
import Loader from '../components/Loader';
import {useUser} from '../context/UserContext';
import {environment} from '../environments/environment';
import {auth} from '../firebase';
import "./Login.css"

// The "Login" page to which all unauthenticated users are redirected to
function Login() {
    const user = useUser();
    const { next, code, discordError } = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        // the login page also works as the redirect page for discord oauth

        // authorization code returned by discord in the search query after user authorises the site
        const code = params.get('code');

        // the url to redirect to after user succesfully logs in
        const next = params.get('next') || params.get('state') || '/';
        // the error , if any, returned by discord
        const discordError = params.get('error_description');
        return { code, next, discordError };
    }, []);

    const [error, setError] = useState(discordError);
    // loading state which stores whether an access token is being issued or not
    const [loading, setLoading] = useState(!!code);
    useEffect(() => {
        if (code && !error && !user) {
            // exchange authorization code given by discord for an access token which we can sign in with using firebase
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
                    return auth.signInWithCustomToken(data.body);
                })
                .catch((e) => {
                    // console.log(e);
                    if (e.response?.status === 403)
                        setError("You need a proper role in Discord before accessing the site");
                    else setError('Something went wrong. Please try again');
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
                <div className="w-screen min-h-screen flex flex-col  justify-center items-center">
                    {!loading ? (
                        <>

                            <IonButton
                                onClick={() => {
                                    const params = new URLSearchParams();
                                    params.set(
                                        'redirect_uri',
                                        `${window.location.origin}/login`
                                    );
                                    params.set('state', next);
                                    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${
                                        environment.clientId
                                    }&response_type=code&scope=identify&${params.toString()}`;
                                }}
                            >
                                Login with Discord
                            </IonButton>

                            <p className="text-red-500 my-4 text-xl">
                                {error}
                            </p>


                            <IonCard className="p-4">
                                <div id="welcome">
                                    <p className="font-bold">Welcome to SOL Decoder</p>

                                    <ul className="">
                                        <li>Please join <a href="https://discord.gg/sol-decoder" style={{"textDecoration": "underline"}}>our Discord</a> to get access to the site</li>
                                        <li>In the future the site will be locked behind ownership of the NFT. Until the NFT releases, you can get access by being whitelisted, or getting a temporary role in the #self-roles channel</li>
                                        <li>View whitelisting requirements in the #whitelist-faq channel</li>
                                    </ul>
                                </div>
                                <br/>

                                <div id="security">
                                    <p className="font-bold">A note on the Discord status</p>
                                    <ul>
                                        <li>If the above Discord link doesn't work - it means we are in a closed state</li>
                                        <li>The Discord will remain closed while we continue to build features & release an Android / iOS app</li>
                                        <li>You may <a href="https://twitter.com/SOL_Decoder">follow our Twitter here</a> to see when the Discord opens, but also note we haven't yet
                                            started our marketing push and haven't started posting / advertising our Twitter yet</li>

                                    </ul>

                                    {/*<p className="font-bold">A note on Discord integration</p>*/}
                                    {/*<ul>*/}
                                    {/*    <li>We require you to login with Discord, so that we can verify you have the proper role(s)</li>*/}
                                    {/*    <li>Note the permissions, seen when you click the Login button:</li>*/}
                                    {/*    <li style={{paddingLeft: "8px"}}>(1) Access your username, avatar, and banner</li>*/}
                                    {/*    <li style={{paddingLeft: "8px"}}>(2) This application cannot read your messages or send messages as you.</li>*/}
                                    {/*    <li>The site can never read any of your Discord messages, and asks for the most limited amount of permissions.</li>*/}
                                    {/*</ul>*/}
                                </div>

                            </IonCard>


                        </>

                    ) : (
                        <div className="h-48 w-48">
                            <Loader />
                        </div>
                    )}
                </div>
        </>
    );
}

export default Login;
