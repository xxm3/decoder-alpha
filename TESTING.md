
### Search page
- search a single word with results (portals) -- make sure data shows and charts show up
  - click into a message and view the drill down
  - toggle off the chart and on again
  - click "next" and "scroll to top"
- search a multiple word with results (sol nft)

### Todays mints page
- make sure filled out with data, and for the right day (UTC time)

### Testing Fox Token page:
- Make sure filled out
- make sure search works
- test 'add custom token name'
- test 'track multiple wallets'
- expand a chart, make sure both charts fill out

### Testing Fox token - doing more advanced testing with wallets (tiny bit optional)
- be logged out of wallet and "view my tokens"
- be logged out of wallet, and add a custom wallet, then test  "view my tokens"
- log in wallet, test "view my tokens"
- log in wallet, add 1-2 custom wallets , test "view my tokens"
- ...

### Mint stats
- Make sure filled out

### Stacked line search
- search "portals suites" - make sure filled out

## Testing Discord bots
- NOTE: all below should be with `TEST_VEHN_DOJO=true` enabled
- NOTE: make sure any Discord bot you tested above has `* DISCORD BOT` in a multi line comment explaining it

### Discord bots - user entry
- test all the bots listed in deploy-commands.js

### Discord bots - automated - some of them
- enter a new Fox custom name, make sure shows up in Discord
- run the daily schedule URL, make sure shows up in Discord

### Discord bots - automated - discord-parser-receiver and our python code (which parses links from discord chat)
(1) if wanting to use the Test RDS, make sure it is running, then update .runtimeconfig.json (search for mydb_test here for creds) (change back after done...)
(2) switch the firebase.json's (to get firestore running locally if needed) (change back after done...)
(3) then run `NODE_ENV=debug ENABLE_DISCORD=true TEST_VEHN_DOJO=true firebase emulators:start --inspect-functions`,
(4) go to python directory and run `python3 run_vehn.py debug=True`, this reads from 'vehn dojo - regular-chat-test' (you will need the discord token for this)
(5) type a link in that channel, that you now has a mint on it
(6) see the output in terminal, and see the chat message go to discord-combined-test, and to "me-nft-alerts-and-raw-mint-feed-test" if a mint was found
(7) see firebase output on http://localhost:4001/firestore/data
(8) If want to mess with different sources (to get the @ alerts working), go to run_vehn.py and change the source for Test (change back after done...), or change it within Firebase
(8b) Then see the output in mint-alerts-automated-test
