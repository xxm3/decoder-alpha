import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink} from '@ionic/react';
import { IonItem, IonLabel, IonCard, IonCardContent, IonIcon, IonRow, IonCol } from '@ionic/react';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Home.css';
import HeaderContainer from "../../components/header/HeaderContainer";
import Card from './Card';
import CollectionCard from './CollectionCard';
import Loader from "../../components/search/Loader";
import {environment} from "../../environments/environment";
import moment from "moment";
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner
} from "@nfteyez/sol-rayz";

// import { PublicKey } from '@solana/web3.js';
// import { useWallet } from '@solana/wallet-adapter-react';
// import * as anchor from '@project-serum/anchor';
// import { MintLayout, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
// import { SystemProgram } from '@solana/web3.js';
// import {
//     LedgerWalletAdapter,
//     PhantomWalletAdapter,
//     SlopeWalletAdapter,
//     SolflareWalletAdapter,
//     SolletExtensionWalletAdapter,
//     SolletWalletAdapter,
//     TorusWalletAdapter,
// } from '@solana/wallet-adapter-wallets';
// import {
//     WalletModalProvider,
//     WalletDisconnectButton,
//     WalletMultiButton
// } from '@solana/wallet-adapter-react-ui';
// import { clusterApiUrl } from '@solana/web3.js';
// import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
// import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

// Default styles that can be overridden by your app
// require('@solana/wallet-adapter-react-ui/styles.css');
// import {Connection, programs} from '@metaplex/js';

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


    // TO.DO
    // const wallet = useWallet();
    // const getCmidDetails = async () => {
    //
    //     // TO.DO: pass in
    //     const candyMachineId = "6FKrA68HvuNa5GRqZiGzRrSBXWou8tmv1HT73PBPWwiC"; // relic
    //     const candyPk = new anchor.web3.PublicKey(candyMachineId);
    //
    //     const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
    //         'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ',
    //     );
    //
    //     // TO.DO: ssc
    //     // const connection = new anchor.web3.Connection(rpcHost ? rpcHost : anchor.web3.clusterApiUrl('devnet'));
    //     const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('mainnet-beta'));
    //
    //     // const anchorWallet = {
    //     //     publicKey: wallet.publicKey,
    //     //     signAllTransactions: wallet.signAllTransactions,
    //     //     signTransaction: wallet.signTransaction,
    //     // }
    //     //
    //     // // TO.DO: no red
    //     // const provider = new anchor.Provider(connection, anchorWallet, {
    //     //     preflightCommitment: 'recent',
    //     // });
    //     //
    //     // const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);
    //     // const program = new anchor.Program(idl, CANDY_MACHINE_PROGRAM, provider);
    //     //
    //     // const state: any = await program.account.candyMachine.fetch(candyPk);
    //     // const itemsAvailable = state.data.itemsAvailable.toNumber();
    //     // const itemsRedeemed = state.itemsRedeemed.toNumber();
    //     // const itemsRemaining = itemsAvailable - itemsRedeemed;
    //     //
    //     // console.log(state);
    // };
    // getCmidDetails();




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


    // // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    // const network = WalletAdapterNetwork.Devnet;
    //
    // // You can also provide a custom RPC endpoint.
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    //
    // // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // // of wallets that your users connect to will be loaded.
    // const wallets = useMemo(
    //     () => [
    //         new PhantomWalletAdapter(),
    //         new SlopeWalletAdapter(),
    //         new SolflareWalletAdapter(),
    //         new TorusWalletAdapter(),
    //         new LedgerWalletAdapter(),
    //         new SolletWalletAdapter({ network }),
    //         new SolletExtensionWalletAdapter({ network }),
    //     ],
    //     [network]
    // );


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

            {/*<ConnectionProvider endpoint={endpoint}>*/}
            {/*    <WalletProvider wallets={wallets} autoConnect>*/}
            {/*        <WalletModalProvider>*/}
            {/*            <WalletMultiButton />*/}
            {/*            <WalletDisconnectButton />*/}
            {/*            { /* Your app's components go here, nested within the context providers. */ }*/}
            {/*        </WalletModalProvider>*/}
            {/*    </WalletProvider>*/}
            {/*</ConnectionProvider>*/}


        </IonPage>
    );
};

export default Home;
