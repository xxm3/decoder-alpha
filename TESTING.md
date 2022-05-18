
### 1) Search page
- A) search a single word with results (portals) -- make sure data shows and charts show up
  - B) click into a message and view the drill down
  - C) toggle off the chart and on again
  - D) click "next" and "scroll to top"
- E) search a multiple word with results (sol nft)

### 2) Today's mints page
- A) make sure filled out with data, and for the right day (UTC time)

### 3) Testing Fox Token page:
- A) Make sure filled out
- B) make sure search works
- C) test 'add custom token name' (make sure discord alert sent)
- D) test 'track multiple wallets'
- E) expand a chart, make sure both charts fill out
- F) make sure links to FF, Solscan, Twitter and Discord work

### 4) Testing Fox token - doing more advanced testing with wallets (tiny bit optional)
- A) be logged out of wallet and "view my tokens"
- B) be logged out of wallet, and add a custom wallet, then test  "view my tokens"
- C) log in wallet, test "view my tokens"
- D) log in wallet, add 1-2 custom wallets , test "view my tokens"

### 5) Mint stats
- A) Make sure filled out
- B) Make sure preview icons are showing (if appliccable)
- C) Make sure ME and Mint URLs are correct and work

### 6) Stacked line search
- A) search "portals suites" - make sure filled out

## Testing Discord bots
- NOTE: all below should be with `TEST_VEHN_DOJO=true` enabled
- NOTE: make sure any Discord bot you tested above has `* DISCORD BOT` in a multi line comment explaining it

### 7) Discord bots - user entry
- A) test all the bots listed in discord-bots deploy-commands.js

### 8) Discord bots - automated - some of them
- A) enter a new Fox custom name, make sure shows up in Discord (talked more about in 4.B.)
- B) run the daily schedule URL, make sure shows up in Discord

### 9) Discord bots - automated - discord-parser-receiver and our python code (which parses links from discord chat)
(1) if wanting to use the Test RDS, make sure it is running, then update .runtimeconfig.json (search for mydb_test here for creds) (change back after done...)
(2) switch the firebase.json's (to get firestore running locally if needed) (change back after done...)
(3) then run `NODE_ENV=debug TEST_VEHN_DOJO=true npm start (in discord-bots project)`,
(4) go to python directory and run `python3 run_vehn.py debug=True`, this reads from 'vehn dojo - regular-chat-test' (you will need the discord token for this)
(5) type a link in that channel, that you now has a mint on it
(6) see the output in terminal, and see the chat message go to discord-combined-test, and to "me-nft-alerts-and-raw-mint-feed-test" if a mint was found
(7) see firebase output on http://localhost:4001/firestore/data
(8) If want to mess with different sources (to get the @ alerts working), go to run_vehn.py and change the source for Test (change back after done...), or change it within Firebase
(8b) Then see the output in mint-alerts-automated-test

### 10) TEST THE VARIOUS URLs (especially those attached to cronjobs) on the bottom of readme.md

(in the section `## URLs we use ie. URLs to test with` - mostly just test the ones with **** in them)

Special notes:
- when testing foxTokenAnalysis?doScrape=true, make sure the "official token added" was sent to Discord

### 11) Testing on a phone

https://developer.chrome.com/docs/devtools/remote-debugging/

https://prowe214.medium.com/tip-how-to-view-localhost-web-apps-on-your-phone-ad6b2c883a7c#:~:text=On%20your%20mobile%20device's%20browser,don't%20leave%20it%20off.
- https://www.whatismyip.com
- http://24.88.49.<ip>:3000/


### 11) Testing 30 days insertion of data, tomorrow mints

(1) First coming to tomorrow mints if you want to test tomorrow mints, you can use the route http://localhost:5001/nft-discord-relay/us-central1/api/todayRefactor?testWebhook=1&doScrape=1&tomorrow=1
(2) To Test it out these are the query params that we are giving in order to recieve a live response, if we don't provide doScrape we'll just get todays_mints from redis and that wont be the tomorrow mints.
(3) Hit the api and see at discord if you're recieving everything, some fields could be missing or broken will be updating them shortly through the database.
(4) To test out the thirty days data insertion if its working fine we can use the route http://localhost:5001/nft-discord-relay/us-central1/api/testThirty
(5) What this route does it basically fetches everything from todays date ie (18 May - 18 June) of mints and stores all of the data in the db
(6) You can hit the api a couple of times to see if data is the same and it should be since the date has not changed
(7) If you want to check if the date is working fine then you need to change the current date maybe give it of 5 days ahead and see if you get any new mints from changing the date (can be done through backend code or if you know of other possible ways to change your date).
(8) This need more refactors and needs to be integrated with todays mint after approval and final testing oncee its integrated with todays mints things like discord online members, twitter followers, tweet interactions will be inserted accurately.
