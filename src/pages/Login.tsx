import {IonButton, IonCard } from '@ionic/react';
import {useEffect, useMemo, useState} from 'react';
import {Redirect} from 'react-router';
import {instance} from '../axios';
import Loader from '../components/Loader';
import {useUser} from '../context/UserContext';
import {environment} from '../environments/environment';
import {auth} from '../firebase';
import "./Login.css"

/**
 * The "Login" page to which all unauthenticated users are redirected to
 *
 * Workflow:
go
 */
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
            // this is defined on discord_auth.js
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

                            <div className="p-4">
                                <div id="welcome">
                                    <p className="font-bold">Welcome to SOL Decoder</p>

                                    <ul className="">
                                        <li>Please join <a href="https://discord.gg/sol-decoder" target="_blank" style={{"textDecoration": "underline"}}>our Discord</a> to get a role which allows access to the site. In the future the site will be locked behind ownership of our NFT</li>
                                        <li>View whitelisting info in the <b>#whitelist-faq</b> channel within Discord</li>
                                    </ul>
                                </div>
                                <br/>

                                <div id="security">
                                    <p className="font-bold">Other links:</p>
                                    <ul>
                                        <li>Follow us <a href="https://twitter.com/SOL_Decoder" target="_blank" className="underline">on Twitter</a></li>
                                        <li>Read our <a href="https://docs.soldecoder.app" target="_blank" className="underline">docs here</a> </li>
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
