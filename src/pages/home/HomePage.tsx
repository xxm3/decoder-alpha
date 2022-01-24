import { IonPage } from '@ionic/react';
import { IonLabel, IonRow} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Home.css';
import Header from '../../components/header/Header';
import {environment} from "../../environments/environment";
import moment from "moment";
import Tile from "../../pages/home/Tile"
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner
} from "@nfteyez/sol-rayz";
import {Connection, programs} from '@metaplex/js';

const Home = () => {
    // State Variables
    const [walletAddress, setWalletAddress] = useState('');
    const [userNfts, setUserNfts] = useState([]); // from user wallet
    const [homePageData, setHomePageData] = useState([]); // ie. possible mints...
    const [newCollections, setNewCollection] = useState([]); // from ME
    const [popularCollections, setPopularCollection] = useState([]); // from ME
    const [isLoading, setIsLoading] = useState(false);

    // Actions
    // called from the child, after their wallet is connected
    const mintAddrToParent = (walletAddress: any) => {
        // console.log(`----got wallet address from child: '${walletAddress}'`);
        setWalletAddress(walletAddress);
        getNfts(walletAddress);
    }

    // gets the user's nft's from their wallet
    // from https://github.com/NftEyez/sol-rayz
    const getNfts = async (passedWalletAddress: string) => {
        const publicAddress = passedWalletAddress;
        const rawNftArray = await getParsedNftAccountsByOwner({
            publicAddress,
        });
        // console.log("raw user nfts: ", rawNftArray);
        let modifiedUserNfts: any = [];
        for (let i in rawNftArray) {
            const uri = rawNftArray[i].data.uri;
            if (uri.indexOf("arweave") !== -1) {
                let moreData: any = {};
                await axios.get(uri).then((res) => {
                    // push unique collections only
                    // @ts-ignore
                    if (!modifiedUserNfts.map(item => item.name).includes(res.data.collection.name)) {
                        modifiedUserNfts.push({
                            img: res.data.image,
                            name: res.data.collection.name
                        });
                    }
                }).catch((err) => {
                    console.error("error when getting arweave data: " + err);
                });
            }
            // console.log("modified user nfts: ", modifiedUserNfts);
            // @ts-ignore
            setUserNfts(modifiedUserNfts);
        }
    }

    // get data for home page
    const fetchHomePageData = () => {
        setIsLoading(true);
        axios
            .get(environment.backendApi + '/homeData')
            .then((res) => {
                setHomePageData(res.data.data.possibleMintLinks[0]);
                setNewCollection(res.data.data.new_collections);
                setPopularCollection(res.data.data.popular_collections);
                // console.log("res1----------------", homePageData);

                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                console.error("error when getting home page data: " + err);
            });
    };

    // UseEffects
    useEffect(() => {
        fetchHomePageData();
    }, []);

    useEffect(() => {
        fetchHomePageData();
    }, []);

    // HTML etc...
    return (
        // 7ED957 - Green       - Primary
        // 8C52FF - Purple      - Secondary
        // 3B5C6E - Bluish Gray - Background
        // FFFFFF - White       - Tile Text Color
        <IonPage className="bg-background">
            <Header mintAddrToParent={mintAddrToParent} showflag={true} onClick={undefined}/>
            {/* New Collections */}
            <div className="rounded-lg m-4 bg-background">
                <IonLabel className="text-2xl text-secondary">New Collections</IonLabel>
                <IonRow>
                    {/* All the tiles go here */}
                    <Tile name="Lorem Ipsum" description="Lorem ipsum saden example damn bro" author="author coolguy" image="https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png" link="https://youtube.com"></Tile>
                </IonRow>
            </div>

            {/* Popular Collections */}
            <div className="rounded-lg m-4">
                <IonLabel className="text-2xl text-secondary">Popular Collections</IonLabel>
                <IonRow>
                    {/* All the tiles go here */}
                    <Tile name="" description="" author="" image="" link=""></Tile>
                </IonRow>
            </div>
        </IonPage>
    );
}

export default Home;
