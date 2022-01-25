/**
 * For a list of all our constants & env files, see constants.js
 */
export const environment = {
	// backendApi: "https://us-central1-nft-discord-relay.cloudfunctions.net/api", // when on firebase

	backendApi: "http://localhost:5001/nft-discord-relay/us-central1/api", // firebase functions emulator - only needs local when you make changes to the API, and you need to test

	// npm start - only needs local when you make changes to the API, and you need to test
	// change things between environment.js & app.js
	// backendApi: 'http://localhost:4000'
};
