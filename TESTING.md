
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

### 12) Set up the "Manage server" page
Go to .env in backend and fill out:
```
devBotToken    -- secret token of your bot...
devUid    -- your discord ID that you log in the site with
devApplicationId    -- ID of the bot (app or client ID)
devGuildId   -- ID of the server that you log into ... when using the website (ie. your dev server)
devRoleId  -- this is the ID of the role you give to yourself in your Discord, that mkes it so you have "4 nfts" locally
```

Go to .env in frontend and fill out:
```
devClientId     -- ID of the bot (app or client ID)
```

Go to /manageserver and invite the bot to your server using the third link. Make sure to change the "clientId" in the URL with what you see on your discord bot management page (so set that up on the README.md -> " Discord oauth" section

When you start the app, go to ProtectedRoute.tsx and comment out "isDev" ... and in backend start it with `FORCE_DISCORD_LOGIN=true`

### 13) Assign Admin if you have no enough nft to enable bot configure packages
(1) First you login and then go to  https://soldecoder.app/manageserver page
(2) You see available server that you create in  discord
(3) Now select server that you want and click add button
(4) Now you redirect to https://soldecoder.app/servermodule configure bot package page
(5) If you don't have enough NFT and no Roll then you see a 'Add Admin For Your Server' Button on top
(6) Then you can show list of Admin that available
(7) You can assign admin through assign button
(8) Then Admin that you assign is access your bot module but they have 3nf or 4nft otherwise they can't access your bot module packages

### 14) View Live messages
(1) Search any word in header global search
(2) And you can show the list of messages
(3) You can click on message and open a popup in popup you show list of comment of particular messages
(4) In popup top you can see button 'View Live Messages'
(5) If you have 3NFT then you can get live messages from socket
(6) Every 5 second Socket will send data if data is changes from previous data then you can show on top of list new messages
(7) When you click close messages socket will disconnect

### 15) Connect Wallet issue
(1) I am try to connect and disconnect wallet in fox token page
(2) I try with uncomment walletMultiButton.tsx  line 145 function and check
(3) I also change local_host_str = 'localhost' to 'test'
(4) then connect wallet with phantom connect and disconnect
(5) then also connect with multi wallet and also disconnect and complete working

### 16) Token name alerts
(1) Token name alerts should be sent to all of the guilds in the database. If there is a failure for a single guild then the token should not be marked as alerted (property nameAlerted=1) in the database.
(2) The name alerts can be tested by calling the endpoint GET http://localhost:5001/nft-discord-relay/us-central1/api/receiver/alertTokenNames. In the database the tokens which have nameAlerted=0 and have a name will be alerted in the analytics channel (for vehn's dojo that is analytics-etc-test0000).


------


# Testing Status
This file will be used for keeping track of all the stuff that's tested/untested.

### Tokens
- `/token` Command ([Link](https://cdn.discordapp.com/attachments/951655764643168306/978365935813541889/chart.png))

  ![Screenshot for the command](https://cdn.discordapp.com/attachments/975811003554086933/978366148066312192/unknown.png)

  `/token` command is currently fully working and tested.

- `/token_name` Command ([Link](https://cdn.discordapp.com/attachments/951655764643168306/978367103381934090/chart.png))

  ![Screenshot for the command](https://cdn.discordapp.com/attachments/975811003554086933/978367172185321502/unknown.png)

  `/token_name` command is currently fully working and tested.

### Fox Tokens
- `GET /api/receiver/foxTokenAnalysis?doScrape=true` API Endpoint

  HTTP Client returns 200

  ![Screenshot of Thunder HTTP Client](https://cdn.discordapp.com/attachments/975811003554086933/978372132088217720/unknown.png)

  but logs show timeout.

  ![Screenshot of logs](https://cdn.discordapp.com/attachments/975811003554086933/978372210664300584/unknown.png)

  Timeout was set to 300s prior to testing that endpoint - yet that time is insufficient for the endpoint.
  `$env:FUNCTIONS_EMULATOR_TIMEOUT_SECONDS="300s"` (Windows Terminal)

- `GET /api/receiver/alertTokenNames` API Endpoint

  HTTP Client returns 200
  ![Screenshot of Thunder HTTP Client](https://cdn.discordapp.com/attachments/975811003554086933/978373997991440464/unknown.png)

  Alerts were sent to discord:
  [Link to messages](https://discord.com/channels/739978662023135264/951666652691464202/978373015089856593)

  > A bug was encountered, `TypeError: Cannot read properties of undefined (reading 'token')`; and fixed.

### Token Alerts
Token alerts were tested on:

- Test Vehn Dojo
- Test Server

Test went without any issues on Test Vehn Dojo; Token alerts were only alerted once.

Tests on Server didn't post any alerts. This could be due to the fact that all tokens at the time of testing were already alerted. (And yes; the condition of `!process.env.TEST_VEHN_DOJO` was temporarily disabled while testing on test server)

> Further testing is recommended at a later point on a test server.

### Webhook
Token related webhooks are now properly displaying the charts
![Screenshot of webhook message](https://cdn.discordapp.com/attachments/975811003554086933/979483567652479036/unknown.png)

This was tested in Test Vehn Dojo
[Link to message](https://discord.com/channels/739978662023135264/951666652691464202/979482863433027594)

