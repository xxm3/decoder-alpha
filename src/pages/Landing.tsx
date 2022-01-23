import { IonButton, IonContent, IonPage } from "@ionic/react";
import { Redirect } from "react-router";
import { useUser } from "../context/UserContext";

import { auth } from "../firebase";

// The "Landing" page to which all unauthenticated users are redirected to
function Landing() {
	const user = useUser();
	const next = new URLSearchParams(window.location.search).get(
		"next"
	) as string;

	// if user is already authenticated redirect them to the last page they were on if any. or otherwise to the home page
	return user ? (
		<Redirect to={next || "/"} />
	) : (
		<IonPage>
			<IonContent>
				<IonButton
					onClick={() => {
						// for testing purposes. ONLY FOR DEVELOPMENT
						auth.signInAnonymously();
					}}
				>
					Login with Discord
				</IonButton>
			</IonContent>
		</IonPage>
	);
}

export default Landing;
