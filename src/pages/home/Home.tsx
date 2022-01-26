import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink} from '@ionic/react';
import { IonItem, IonLabel, IonCard, IonCardContent, IonIcon, IonRow, IonCol } from '@ionic/react';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Home.css';
import Header from '../../components/header/Header';
import Card from './Card';
import CollectionCard from './CollectionCard';
import Loader from "../../components/search/Loader";
import {environment} from "../../environments/environment";
import moment from "moment";
import { pin } from 'ionicons/icons';
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner
} from "@nfteyez/sol-rayz";
import {Connection, programs} from '@metaplex/js';

const Home = () => {

    /**
     * States & Variables
     */
    const [walletAddress, setWalletAddress] = useState('');
    const [userNfts, setUserNfts] = useState([]); // from user wallet
    const [homePageData, setHomePageData] = useState([]); // ie. possible mints...
    const [newCollections, setNewCollection] = useState([]); // from ME
    const [popularCollections, setPopularCollection] = useState([]); // from ME

    const [isLoading, setIsLoading] = useState(false);

    /**
     * Use Effects
     */
    useEffect(() => {
        fetchHomePageData();
    }, []);

    useEffect(() => {
        fetchHomePageData();
    }, []);

    /**
     * Functions
     */
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

    const getDateAgo = function (time: any){
        return moment(time).fromNow();
    }

    /**
     * Renders
     */

    return (

        <IonPage className="bg-sky">

            <Header mintAddrToParent={mintAddrToParent} showflag={true} onClick={undefined}/>

            <IonContent className="bg-gradient-to-b ">
                <h1 style={{'paddingLeft': '30px'}}>More content coming soon! Use the search above in meantime</h1>
                <br/>


                {/* Possible Mints */}
                <IonCard hidden={true}>
                    <IonLabel className="text-4xl text-blue-600">Possible Mints</IonLabel>

                    {/* loading bar */}
                    {isLoading && (
                        <div className="pt-10 flex justify-center items-center">
                            <Loader/>
                        </div>
                    )}
                    <div hidden={isLoading}>
                        {homePageData.map((product: any, index: any) => (
                            <>
                                <Card key={index} url={product.url} readableTimestamp={getDateAgo(product.timestamp)} source={product.source}/>
                            </>
                        ))}
                    </div>
                </IonCard>

            </IonContent>









            {/* SHITTY FORMATTED CODE: */}

            <div hidden={true}>
            <IonContent>
                <IonRow>
                    <IonLabel className="text-4xl text-blue-600">New Collection</IonLabel>
                </IonRow>

                {/* loading bar */}
                {isLoading && (
                    <div className="pt-10 flex justify-center items-center">
                        <Loader/>
                    </div>
                )}
                <div hidden={isLoading}>

                    {/* New Collections */}
                    <IonRow className="bg-lime-700">
                        {newCollections.map((collection: any, index: any) => (
                            <IonCol>
                                <CollectionCard key={index}
                                                name={collection.name}
                                                description={collection.description}
                                                image={collection.image}
                                                website={collection.website}
                                                twitter={collection.twitter}
                                                discord={collection.discord}
                                                categories={collection.categories}
                                                splitName={collection.splitName}
                                                link={collection.link}
                                                timestamp={collection.timestamp}
                                                readableTimestamp={collection.readableTimestamp}
                                />
                            </IonCol>
                        ))}
                    </IonRow>

                    {/* Popular Collections */}
                    <IonRow>
                        <IonLabel className="text-4xl text-blue-600">Popular Collection</IonLabel>
                    </IonRow>

                    <IonRow>
                        {popularCollections.map((collection: any, index: any) => (
                            <IonCol>
                                <CollectionCard key={index}
                                                name={collection.name}
                                                description={collection.description}
                                                image={collection.image}
                                                website={collection.website}
                                                twitter={collection.twitter}
                                                discord={collection.discord}
                                                categories={collection.categories}
                                                splitName={collection.splitName}
                                                link={collection.link}
                                                timestamp={collection.timestamp}
                                                readableTimestamp={collection.readableTimestamp}
                                />
                            </IonCol>
                        ))}
                    </IonRow>

                </div>
            </IonContent>



            {/* user's NFTs */}
            <h3>User NFTs:</h3>
            <IonCard>
                <IonContent>
                    <IonRow className="bg-lime-700" hidden={userNfts.length === 0}>
                        {userNfts.map((collection: any, index: any) => (
                            <IonCol>
                                {collection.name}
                                <br/>
                                <img style={{height: "100px"}} src={collection.img} alt="" />
                            </IonCol>
                        ))}
                    </IonRow>
                </IonContent>
            </IonCard>
            </div>

        </IonPage>
    );
}

export default Home;
