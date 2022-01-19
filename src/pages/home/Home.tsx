import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';
import { pin } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import {
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
    IonIcon,
    IonRow,
    IonCol,
} from '@ionic/react';
import axios from 'axios';
import './Home.css';
import HeaderContainer from "../../components/header/HeaderContainer";
import Card from './Card';
import CollectionCard from './CollectionCard';
import Loader from "../../components/search/Loader";
import {setTimeout} from "timers";
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

const Home = () => {

    /**
     * State Variables
     */
    const [walletAddress, setWalletAddress] = useState('');
    const [products, setProducts] = useState([]);
    const [newcollections, setNewCollection] = useState([]);
    const [popularcollections, setPopularCollection] = useState([]);
    const [userNfts, setUserNfts] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    /**
     * Actions
     */
    // called from the child, after their wallet is connected
    const mintAddrToParent = (walletAddress: any) => {
        // console.log(`----got wallet address from child: '${walletAddress}'`);
        setWalletAddress(walletAddress);
        getNfts(walletAddress);
    }

    /**
     * UseEffects
     */
    const getNfts = async (passedWalletAddress: string) => {
        // from https://github.com/NftEyez/sol-rayz

        // const address = "...";
        // const publicAddress = await resolveToWalletAddress(address);

        const publicAddress = passedWalletAddress;
        // console.log(`---looking up nft for address '${publicAddress}'`)

        const nftArray = await getParsedNftAccountsByOwner({
            publicAddress,
        });

        // @ts-ignore
        setUserNfts(nftArray);

        console.log("found user nfts: ", nftArray);
    }


    /**
     * Renders
     */

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setIsLoading(true);
        axios
            .get('https://us-central1-nft-discord-relay.cloudfunctions.net/api/homeData')
            .then((res) => {
                setProducts(res.data.data.possibleMintLinks[0]);
                setNewCollection(res.data.data.new_collections);
                setPopularCollection(res.data.data.popular_collections);
                // console.log("res1----------------", products);

                setIsLoading(false);
                // setTimeout(() => { setIsLoading(false); }, 2000);
            })
            .catch((err) => {
                setIsLoading(false);
                // setTimeout(() => { setIsLoading(false); }, 2000);
                console.error(err);
            });
    };

    // @ts-ignore
    return (
        <IonPage className="bg-sky">

            <HeaderContainer mintAddrToParent={mintAddrToParent} showflag={true} onClick={undefined}/>
            <IonContent>
                <IonRow>
                    <IonLabel className="text-7xl text-blue-600">New Collection</IonLabel>
                </IonRow>

                {/* loading bar */}
                {isLoading && (
                    <div className="pt-10 flex justify-center items-center">
                        <Loader/>
                    </div>
                )}

                <div hidden={isLoading}>



                    <IonRow className="bg-lime-700">
                        {
                            userNfts.map((collection: any ,index: any) =>(
                                <IonCol >
                                    {{ collection.data.name }}
                                </IonCol>
                            ))}
                    </IonRow>




                    <IonRow className="bg-lime-700">
                        {
                            newcollections.map((collection: any ,index: any) =>(
                            <IonCol >
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

                    <IonRow>
                            <IonLabel className="text-7xl text-blue-600">Popular Collection</IonLabel>
                    </IonRow>
                    <IonRow>
                        {
                            popularcollections.map((collection: any, index: any)=>(
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

            <IonContent>
                <IonLabel className="text-7xl text-blue-600 fixed">Possible Mints</IonLabel>
                {/* loading bar */}
                {isLoading && (
                    <div className="pt-10 flex justify-center items-center">
                        <Loader/>
                    </div>
                )}

                <div hidden={isLoading}>
                    {
                        products.map((product: any, index: any) => (
                        <>
                            <Card key={index} url={product.url} readableTimestamp={product.timestamp} source={product.source}/>
                        </>
                    ))}
                </div>
            </IonContent>

        </IonPage>
    );
};

export default Home;
