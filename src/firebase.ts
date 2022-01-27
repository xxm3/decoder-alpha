import firebase from 'firebase';
import { isDev } from './environments/environment';

const app = firebase.initializeApp({
    apiKey: "AIzaSyAMQYGpOBTeY2fOQYnW-pxZggPfsUXb6bs",
    authDomain: "nft-discord-relay.firebaseapp.com",
    projectId: "nft-discord-relay",
    storageBucket: "nft-discord-relay.appspot.com",
    messagingSenderId: "301342258358",
    appId: "1:301342258358:web:b074b4535552ae0e6ee217",
    measurementId: "G-533CCS7B8D"
});

export const auth = app.auth();

if (isDev) auth.useEmulator('http://localhost:9099');
