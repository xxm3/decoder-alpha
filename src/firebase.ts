import firebase from "firebase";

const isDev = process.env.NODE_ENV === "development";

const app = firebase.initializeApp({
	apiKey: "TEST_API_KEY", // fake API key only for development purposes
});

export const auth = app.auth();

if (isDev) auth.useEmulator("http://localhost:9099");
