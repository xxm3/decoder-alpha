/**
 * For a list of all our constants & env files, see constants.js
 */
export const isDev = process.env.NODE_ENV !== 'production';

export const environment = {
    backendApi: isDev
        ? 'http://localhost:5001/nft-discord-relay/us-central1/api' // firebase functions emulator - only needs local when you make changes to the API, and you need to test
        : 'https://us-central1-nft-discord-relay.cloudfunctions.net/api',
    clientId: '927008889092857898',
};

