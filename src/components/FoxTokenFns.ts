import axios from "axios";
import {environment} from "../environments/environment";
import {instance} from "../axios";

export async function getLiveFoxTokenData(mySplTokens: any) {

    /**
     * NOTE: below repeated on foxTokenParser.js & FoxTokenFns.js
     * (some slight differences in each)
     */
    let rawTokenData: any;
    let verifiedTokenData: any;
    let prettyData: any = {};
    let customNamesAry: any;
    let oldNamedAry: any;

    // get the data
    const headers = {
        // 'Referer': "https://famousfoxes.com/",
        // "Origin": "https://famousfoxes.com/"
    };

    // get token data directly from FF
    await axios.get('https://dens.famousfoxes.com/cache.json', {headers: headers}).then((data) => {
        rawTokenData = data.data;
    });
    // get whitelisted named data from FF
    await axios.get('https://dens.famousfoxes.com/whitelist.json', {headers: headers}).then((data) => {
        verifiedTokenData = data.data;
    });
    // get custom names we added to our site, from ourselves
    await instance.get(environment.backendApi + '/receiver/foxTokenCustomNames', {headers: headers}).then((data) => {
        customNamesAry = data.data;
    });
    // get names that could be old as well (ie. token from a month ago that isn't traded, but we could still look up data on)
    await instance.get(environment.backendApi + '/receiver/foxTokenOldNamed', {headers: headers}).then((data) => {
        oldNamedAry = data.data;
    });

    const addressToSkip = ['4NUoCXBsCVUXPyQL3UmMU3dRUZ3WNQgY1USC7eAY8zSG', '14AnHZYk1CvtTCq5jvYMX7Fx7pnWDmgQJvADxP9Q4jYN', 'GzpRsvnKXKz586kRLkjdppR4dUCFwHa2qaszKkPUQx6g',
        'CdQseFmnPh2JBiz5747dJ6oYXK9NKnbdFRfiXTcZuaXT', 'DSkMMc8AYiXQMTMuBCjj3PLfW9nPUy8MiRCbt6FWwUks', 'ASHTTPcMddo7RsYHEyTv3nutMWvK8S4wgFUy3seAohja',
        'FnVPD3fRutXcibEHDYP1gv8kuYJx2SNCi2EizcAsR4wN', 'YLTrJGCqZpwZZbCN2D3KTg4PuGBofto8ciqYdPoQEgd', 'PHnyhLEnsD9SiP9tk9kHHKiCxCTPFnymzPspDqAicMe',
        '8z1jFyg9heBFvKVvqMHJQ4UXQqomNpYZHWCsEJhQYaBd', 'GkiLvPrtfzaCm4m8qS8XCzFmSk2uJrP5vcVnhFBk6P7j', 'Caw4P6ypHsU2grSUHEUPAKa2g6g5qT1YRcQDJXLRMfDr',
        '2hvKBnhXZVvZadKX5QKkiyU7pVXXe5ZNMZhAoeXJdHxj', 'GkCYKY6iLuNjoRmNuBHDRMUtcUCSE5buiQpPeq9iuq5u', 'PZkvackT12qPefdXNPrQr51cPfsMfSZBjm812kjn1H3'];

    // loop through the 5,000 tokens FF has
    for (let r in rawTokenData) {

        // skip some data that has huge amounts of count
        if (addressToSkip.indexOf(rawTokenData[r].mint) !== -1) {
            continue;
        }

        const curTokenPrice = rawTokenData[r].cost / 1000000000;

        const curTokenAry = {
            cost: curTokenPrice,
            count: rawTokenData[r].count
        }

        // see if we have this token in our object that tracks all mints
        // prettyData.7aEkSoizm3CKqVGe4nK1ovVTyapJ4cdJf5hQgr66Xrcv = { name: '<if set>', floorPrice: 1, listedTokens: [{cost: 1, count: 4}, {...}] }
        if (prettyData[rawTokenData[r].mint]) {

            // set floor price if needed
            if (curTokenPrice < prettyData[rawTokenData[r].mint].floorPrice) {
                prettyData[rawTokenData[r].mint].floorPrice = curTokenPrice;
            }

            // push new listed tokens
            prettyData[rawTokenData[r].mint].listedTokens.push(curTokenAry);

            // already exists so push it
        } else {
            prettyData[rawTokenData[r].mint] = {
                floorPrice: curTokenPrice,
                listedTokens: [curTokenAry]
            }
        }
    }

    let prettyDataMorePopulated: any = {};
    for (const [key, value] of Object.entries(prettyData)) {

        // add total # listings
        prettyData[key].totalTokenListings = 0;
        for (let t in prettyData[key].listedTokens) {
            prettyData[key].totalTokenListings += prettyData[key].listedTokens[t].count;
        }

        // remove things with only 1 listing entirely...
        if (prettyData[key].listedTokens.length >= 2) {

            // go through the token listings - remove anything more than 30% higher than floor
            // let newListedTokens = [];
            // for (let l in prettyData[key].listedTokens) {
            //     if (prettyData[key].listedTokens[l].cost <= (prettyData[key].floorPrice * 1.3)) {
            //         newListedTokens.push(prettyData[key].listedTokens[l]);
            //     }
            // }
            // prettyData[key].listedTokens = newListedTokens

            prettyDataMorePopulated[key] = prettyData[key];
        }
    }

    // loop through it to add in the names
    for (const [key, value] of Object.entries(prettyDataMorePopulated)) {

        // else loop through the OFFICIAL NAMES array we got from FF
        for (let v in verifiedTokenData) {
            if (verifiedTokenData[v].mint === key) {
                prettyDataMorePopulated[key].name = verifiedTokenData[v].name;
                break;
            }
        }

        // else loop through our CUSTOM names array
        for(let c in customNamesAry){
            if(customNamesAry[c].token === key){

                // only do things if doesn't have official name
                if(!prettyDataMorePopulated[key].name) {
                    // prettyDataMorePopulated[key].name = customNamesAry[c].customName;
                    if (!prettyDataMorePopulated[key].customName) {
                        prettyDataMorePopulated[key].customName = customNamesAry[c].customName;
                    } else {
                        prettyDataMorePopulated[key].customName += ", " + customNamesAry[c].customNam;
                    }

                    break;
                }
            }
        }
    }

    // hnghhhh loop yet again to see anything with custom names and add emoji
    for(let k in prettyDataMorePopulated){
        if(prettyDataMorePopulated[k].customName){
            prettyDataMorePopulated[k].name = prettyDataMorePopulated[k].customName + ' 👪';
        }
    }

    // order it!
    const orderedPrettyData: any = Object.fromEntries(
        Object.entries(prettyDataMorePopulated).sort((x: any, y: any) => y[1].floorPrice - x[1].floorPrice)
    );

    // hnghhh convert to array
    let finalAry: any = [];
    for (const [key, value] of Object.entries(orderedPrettyData)) {

        // nodejs version stores the history here too...

        finalAry.push({
            token: key,
            floorPrice:orderedPrettyData[key].floorPrice,
            name: orderedPrettyData[key].name ? orderedPrettyData[key].name : '',
            listedTokens: orderedPrettyData[key].listedTokens,
            totalTokenListings: orderedPrettyData[key].totalTokenListings
        });
    }

    // loop through table data (all fox tokens)... to eventually add which of these are your SPL tokens
    if(mySplTokens.length > 0){
        for (let i in finalAry) {
            // loop through user tokens
            for (let y in mySplTokens) {
                // if match
                // @ts-ignore
                if (mySplTokens[y].token === finalAry[i].token) {
                    // then ADD data
                    if (!finalAry[i].whichMyWallets) {
                        finalAry[i].whichMyWallets = shortenedWallet(mySplTokens[y].myWallet);
                    }
                    else {
                        finalAry[i].whichMyWallets += ", " + shortenedWallet(mySplTokens[y].myWallet);
                    }

                    break;
                }
            }
        }
    }

    // get names that could be old as well (ie. token from a month ago that isn't traded, but we could still look up data on)
    for (let o in oldNamedAry) {
        let tokenFoundInData = false;

        for(let f in finalAry){
            if(oldNamedAry[o].token === finalAry[f].token){
                tokenFoundInData = true;
                break;
            }
        }

        if(!tokenFoundInData){
            oldNamedAry[o].name = oldNamedAry[o].name + " (not listed in FF anymore)";
            oldNamedAry[o].floorPrice = "";
            // oldNamedAry[o].totalTokenListings = "";
            finalAry.push(oldNamedAry[o]);
        }
    }

    return finalAry;
}

export function shortenedWallet(wallet: string){
    return wallet.substring(0, 4) +
        '...' +
        wallet.substring(wallet.length - 4);
}

// OLD GET TABLE DATA
// instance
//     .get(environment.backendApi + '/receiver/foxTokenAnalysis')
//     .then((res) => {
//
//         const data = res.data.data;
//         // const newData = [];
//         //
//         //
//         // for(let i in data){
//         //     if(data[i].customName){
//         //         newData.push(data[i]);
//         //     }
//         // }
//
//         // console.log(mySplTokens);
//
//         // loop through table data (all fox tokens)... to eventually add which of these are your SPL tokens
//         for (let i in data) {
//             // loop through user tokens
//             for (let y in mySplTokens) {
//                 // if match
//                 // @ts-ignore
//                 if (mySplTokens[y].token === data[i].token) {
//                     // then ADD data
//                     // @ts-ignore
//                     if (!data[i].whichMyWallets) {
//                         data[i].whichMyWallets = shortenedWallet(mySplTokens[y].myWallet);
//                     }
//                     // @ts-ignore
//                     else {
//                         data[i].whichMyWallets += ", " + shortenedWallet(mySplTokens[y].myWallet);
//                     }
//
//                     break;
//                 }
//             }
//         }
//
//         setTableData(data);
//         setFullTableData(data);
//     })
//     .catch((err) => {
//         console.error("error when getting fox token data: " + err);
//     });
