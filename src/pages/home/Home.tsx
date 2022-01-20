import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink} from '@ionic/react';
import {pin} from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
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
import {environment} from "../../environments/environment";
import {setTimeout} from "timers";
import moment from "moment";
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import {Connection, programs} from '@metaplex/js';
const Home = () => {

    /**
     * State Variables
     */
        // TODO-vinit: need this error fixed - https://sentry.io/answers/unique-key-prop/
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
                    })
                        .catch((err) => {
                            console.error("error when getting arweave data: " + err);
                        });
                }
            }

            // console.log("modified user nfts: ", modifiedUserNfts);

            // @ts-ignore
            setUserNfts(modifiedUserNfts);
        }


    const getCmidDetails = async () => {
        // const { metadata: { Metadata } } = programs;
        const {metaplex: {Store, AuctionManager}, metadata: {Metadata}, auction: {Auction}, vault: {Vault}} = programs;


        // const connection = new Connection('mainnet-beta');
        // const tokenPublicKey = '9udKMALG9vYXvwdQK6CUfXdsn4SiWwWtzTyMpzLF7g41';

        // try {
        //     const ownedMetadata = await Metadata.load(connection, tokenPublicKey);
        //     console.log(ownedMetadata);
        // } catch(err) {
        //     console.error('Failed to fetch metadata');
        //     console.error(err);
        // }

        // const connection = new Connection('devnet');
        // const tokenPublicKey = 'Gz3vYbpsB2agTsAwedtvtTkQ1CG9vsioqLW3r9ecNpvZ';
        //
        // const metadata = await Metadata.load(connection, tokenPublicKey);
        // const auction = await Auction.load(connection, tokenPublicKey);
        // const vault = await Vault.load(connection, tokenPublicKey);
        // const auctionManager = await AuctionManager.load(connection, tokenPublicKey);
        // const store = await Store.load(connection, tokenPublicKey);
        // console.log(metadata);
        // console.log(auction);
        // console.log(vault);
        // console.log(auctionManager);
        // console.log(store);


    };
    getCmidDetails();


    /**
     * Renders
     */

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setIsLoading(true);

        axios
            .get(environment.backendApi + '/homeData')
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
                console.error("error when getting home page data: " + err);
            });
    };
    const getDateAgo = function (time: any){
        return moment(time).fromNow();
    }
    // @ts-ignore
    return (
        <IonPage className="bg-sky">

            <HeaderContainer mintAddrToParent={mintAddrToParent} showflag={true} onClick={undefined}/>
            <IonContent>
                <IonRow>
                    <IonLabel className="text-6xl text-blue-600">New Collection</IonLabel>
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
                            newcollections.map((collection: any, index: any) => (
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

                    <IonRow>
                        <IonLabel className="text-7xl text-blue-600">Popular Collection</IonLabel>
                    </IonRow>
                    <IonRow>
                        {
                            popularcollections.map((collection: any, index: any) => (
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
                <IonLabel className="text-6xl text-blue-600">Possible Mints</IonLabel>
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
                            <Card key={index} url={product.url} readableTimestamp={getDateAgo(product.timestamps)} source={product.source}/>
                        </>
                    ))}
                    <IonCard>
                        <IonItem>
                            <IonIcon icon={pin} slot="start" />
                            <IonLabel>ion-item in a card, icon left, button right</IonLabel>
                            <IonButton fill="outline" slot="end">View</IonButton>
                        </IonItem>
                        <IonCardContent>
                            This is content, without any paragraph or header tags,
                            within an ion-cardContent element.
                        </IonCardContent>
                    </IonCard>

                    {/* <IonCard>
                                <IonItem href="#" className="ion-activated">
                                    <IonIcon icon={wifi} slot="start" />
                                    <IonLabel>Card Link Item 1 activated</IonLabel>
                                </IonItem>

                                <IonItem href="#">
                                    <IonIcon icon={wine} slot="start" />
                                    <IonLabel>Card Link Item 2</IonLabel>
                                </IonItem>

                                <IonItem className="ion-activated">
                                    <IonIcon icon={warning} slot="start" />
                                    <IonLabel>Card Button Item 1 activated</IonLabel>
                                </IonItem>

                                <IonItem>
                                    <IonIcon icon={walk} slot="start" />
                                    <IonLabel>Card Button Item 2</IonLabel>
                                </IonItem>
                            </IonCard> */}
                            <>
                                <Card key={index} url={product.url} readableTimestamp={product.timestamp}
                                      source={product.source}/>
                            </>
                </div>
            </IonContent>


            {/*show user's NFTs*/}
            <h3>User NFTs:</h3>
            <IonCard>
                <IonContent>
                    <IonRow className="bg-lime-700" hidden={userNfts.length === 0}>
                        {
                            userNfts.map((collection: any, index: any) => (
                                <IonCol>
                                    {collection.name}
                                    <br/>
                                    <img style={{height: "100px"}} src={collection.img}/>
                                </IonCol>
                            ))}
                    </IonRow>
                </IonContent>
            </IonCard>

        </IonPage>
    );
};

export default Home;
