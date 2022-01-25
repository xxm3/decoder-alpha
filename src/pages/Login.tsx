import {IonButton, IonContent, IonPage} from "@ionic/react";
import {useEffect, useMemo, useState} from "react";
import {Redirect} from "react-router";
import {instance} from "../axios";
import Loader from "../components/Loader";
import {useUser} from "../context/UserContext";
import {auth} from "../firebase";

// The "Login" page to which all unauthenticated users are redirected to
function Login() {
    const user = useUser();
    const {next, code, discordError} = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const next = params.get("next") || params.get("state") || "/";
        const discordError = params.get("error_description");
        return {code, next, discordError};
    }, []);

    const [error, setError] = useState(discordError);
    const [loading, setLoading] = useState(!!code);
    useEffect(() => {
        if (code && !error && !user) {
            instance
                .post(
                    "/getToken",
                    {code},
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then(({data}) => {
                    console.log(data);
                    return auth.signInWithCustomToken(data.body);
                })
                .catch((e) => {
                    console.log(e);
                    if (e.response?.status === 403)
                        setError("You aren't authorized to view this site. Please get the correct role within our Discord - ");
                    else setError("Something went wrong. Please try again");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [code, error, user]);
    // if user is already authenticated redirect them to the last page they were on if any. or otherwise to the home page
    return user ? (
        <Redirect to={next}/>
    ) : (
        <IonPage>
            <IonContent>
                <div className="w-screen min-h-screen flex flex-col  justify-center items-center">
                    {!loading ? (
                        <>
                            <p className="text-red-500 my-4 text-2xl">
                                {error}
                            </p>
                            <IonButton
                                onClick={() => {
                                    const params = new URLSearchParams();
                                    params.set(
                                        "redirect_uri",
                                        `http://localhost:3000/login`
                                    );
                                    params.set("state", next);
                                    const url = `https://discord.com/api/oauth2/authorize?client_id=818767746141126656&response_type=code&scope=identify&${params.toString()}`;
                                    window.location.href = url;
                                }}
                            >
                                Login with Discord
                            </IonButton>
                        </>
                    ) : (
                        <div className="h-48 w-48">
                            <Loader/>
                        </div>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Login;
