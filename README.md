
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

### How to code certain things

DO put new things into COMPONENTS to make the code easier to read / manage

DON'T use :any

DON'T use ts-ignore

To link to other pages:
`<IonRouterLink href="/schedule" className="pr-7 underline text-inherit">Today's Mints</IonRouterLink>`

To make calls to the backend:
- use React query for data fetching. Look at how the Search.tsx page implements React Query to understand how it works
- React query reduces a lot of work that goes into managing loading, error states , caching, not sending the same requests at the same time, etc

For example:
```
const fetchSearchMessages = async () => {
        try {
            const { data } = await instance.post<SearchResponse>(
                '/searchMessages/',
                {
                    word: searchText,
                    pageNumber: currentPage
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return data;
        } catch (e) {
            console.error('try/catch in Search.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            let msg = '';

            if (error && error.response) {
                msg = String(error.response.data.body);
            } else {
                msg = 'Unable to connect. Please try again later';
            }

            present({
                message: msg,
                color: 'danger',
                duration: 5000
            });
            if(msg.includes('logging in again')){
                history.push("/login");
            }

            // throw new Error(msg);
        }
    }

const messageQuery = useQuery([searchText,currentPage], fetchSearchMessages, {
        keepPreviousData : true,
        select : (data: any) => {
            // in case couldn't search on this

            if (data?.error && data.body) {
                throw new Error(String(data.body));
            }
            if(data?.totalCount > 100) {
                data.hasMore = true;
            }
            return {
                ...data,
            }
        },
        retry : false
    })

# error handling
messageQuery.isError || messageQuery?.data?.error

# loading
 {graphQuery?.isFetching ? <div className=" m-16 flex justify-center items-center"><Loader /></div> :

# data
{(messageQuery?.data?.totalCount

```

To do dropdowns:
- See WalletButton.tsx and how it uses `<Tooltip>`

To do tooltips:
- MessageListItem.tsx with its <ReactTooltip /> and data-tip
- ... or nevermind do <Tooltip

To do alert popups:
- See useConnectWallet.ts and how it uses `useIonAlert()`

To use modals
- See FoxToken.tsx and its IonModal

To use toasts
- See FoxToken.tsx and its toasts
- https://ionicframework.com/docs/api/toast

Global states....
- see state.walletAddress... (to get)
- see dispatch(setWallet... (to set)


To hide something on mobile: give below class
```
hidden sm:block
```
Another example:
```
<span className="hidden xl:block">{record.token}</span>
<span className="xl:hidden">
{shortenedWallet(record.token)}
</span>
```

Redirecting users:
```
let history = useHistory();

history.push("/login");
```

Error handling on connections to our backend:

When using react query stuff:
- see the try/catch within Ffnamed.tsx - getFfNamed()

When using the old way of instance.get:
- see Schedule.tsx

---

If want to refresh a query when you go back to the window, or click back into the page:
```
 refetchOnWindowFocus: true,
```


#### Links to read
- For Error handling using reactQuery -  https://react-query.tanstack.com/guides/query-functions#handling-and-throwing-errors
- For pagination using react Query -  https://react-query.tanstack.com/guides/paginated-queries
- For reactQuery selector - https://react-query.tanstack.com/guides/migrating-to-react-query-3#query-data-selectors

...

...


### Style guide

#### How to style a new page, when you create it

When you want an even darker section under there (ie. a "card"):
```
<div className={`bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4 mb-2`}>
```

To have a title of a section:
```
<div className={`font-bold pb-1 ${width <= 640 ? 'w-full' : 'w-96 '}`}>Compare multiple words on a line graph</div>
```

When you need a searchbar:
```
<SearchBar...
```

When you need a loading bar:
```
<Loader...
```

When you need a button indicating a PRIMARY action:
```
 <IonButton color="success" className="text-sm" >
    Submit
</IonButton>
```
