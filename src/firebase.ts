import { instance } from './axios';
import { notifications } from 'ionicons/icons';
import { initializeApp } from "firebase/app";
import { environment, isDev } from './environments/environment';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const app = initializeApp({
    apiKey: "AIzaSyAMQYGpOBTeY2fOQYnW-pxZggPfsUXb6bs",
    authDomain: "nft-discord-relay.firebaseapp.com",
    projectId: "nft-discord-relay",
    storageBucket: "nft-discord-relay.appspot.com",
    messagingSenderId: "301342258358",
    appId: "1:301342258358:web:b074b4535552ae0e6ee217",
    measurementId: "G-533CCS7B8D"
});

export const auth = getAuth(app);

if (isDev) connectAuthEmulator(auth, 'http://localhost:9099');


export const messaging = getMessaging(app);
// https://firebase.google.com/docs/cloud-messaging/js/client

onMessage(messaging, (payload) => {
    if (!payload?.notification) return;
    const { title, body } = payload.notification;
    // Create new browser notification
    new Notification(title as string, {
        body,
        icon: '/assets/site-logos/logo-transparent.png',
        image: '/assets/site-logos/logo-transparent.png',
    });
});

getToken(messaging, {
    vapidKey: "BN0qlY8sox-k4Pxrw26P5rv0vyX-04zNHf0z_jWBQikTnw14b4b4Vd_37-jpNozwvDgajgyQuwnbb0jC1HMAamM"
})
    .then((currentToken) => {
        if (currentToken) {
            instance.post(`${environment.backendApi}/setUserFcmToken`, {currentToken});
        } else {
            console.error('No registration token available. Request permission to generate one.');
        }
    }).catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
    });
