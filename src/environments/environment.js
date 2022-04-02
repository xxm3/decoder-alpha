/**
 * For a list of all our constants & env files, see constants.js
 */
export const isDev = process.env.NODE_ENV !== 'production';

export const environment = {
    backendApi: isDev?  'http://localhost:5001/nft-discord-relay/us-central1/api' : 'https://us-central1-nft-discord-relay.cloudfunctions.net/api',

    clientId: '818767746141126656', // client ID for,
	ionicAppUrl : isDev ? "http://localhost:8100" : "https://soldecoder.app"
};

