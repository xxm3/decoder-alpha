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
import { instance } from '../../axios';

const Home = () => {
    // State Variables
    const [userNfts, setUserNfts] = useState([]); // from user wallet
    const [homePageData, setHomePageData] = useState([]); // ie. possible mints...
    const [newCollections, setNewCollection] = useState([]); // from ME
    const [popularCollections, setPopularCollection] = useState([]); // from ME
    const [isLoading, setIsLoading] = useState(false);

    // get data for home page
    const fetchHomePageData = () => {
        setIsLoading(true);
        instance
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
        // fetchHomePageData();
    }, []);

    // HTML etc...
    return (
        // 7ED957 - Green       - Primary
        // 8C52FF - Purple      - Secondary
        // 3B5C6E - Bluish Gray - Background
        // FFFFFF - White       - Tile Text Color

        <IonPage className="bg-background">

            <Header/>

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
