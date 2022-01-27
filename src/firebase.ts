import firebase from 'firebase';
import { isDev } from './environments/environment';

const app = firebase.initializeApp({
    apiKey: 'TEST_API_KEY', // fake API key only for development purposes
});

export const auth = app.auth();

if (isDev) auth.useEmulator('http://localhost:9099');
