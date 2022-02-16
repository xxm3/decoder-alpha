
## frontend-app

### To develop
1. cd into the folder
2. Run `npm install` at the root of your directory
3. Run `npm run start` to start the project
4. Start coding!

Visit the site - http://localhost:3000

Note: This connects to the backend locally. That backend would need access to the RDS database, and appropriate secrets configured.
If you haven't done that, then you can skip that by going to environmenet.js, and switching the two "backendApi". Just don't keep that in there permanently

### To deploy to Prod
1. Run `npm run test-mocha && npm run build && firebase deploy --only hosting`
3. View site on https://nft-discord-relay.web.app/
4. Stats on https://console.firebase.google.com/u/1/project/nft-discord-relay/hosting/sites


# Style Guide

1. When making a new page, use either
   - The AppRoute component for unprotected pages (i.e pages that can be accessed by an unauthenticated user)
   - The ProtectedRoute component for protected pages (i.e pages that can't be accessed by an unauthenticated user)
   - And keep in mind that there's no need to use the `IonPage` component  at the root of your page (You will know why if you look through the code of the AppRoute component at `components/Route.tsx`)