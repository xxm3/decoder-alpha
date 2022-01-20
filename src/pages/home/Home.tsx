import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';
import { pin} from 'ionicons/icons';
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
import moment from "moment";
const Home = () => {

    /**
     * State Variables
     */
    const [walletAddress, setWalletAddress] = useState('');
    const [products, setProducts] = useState([]);
    const [newcollections, setNewCollection] = useState([]);
    const [popularcollections, setPopularCollection] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    /**
     * Actions
     */
    const mintAddrToParent = (walletAddress: any) => {
        setWalletAddress(walletAddress);
    }

    /**
     * UseEffects
     */
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
                console.log("res1----------------", products);
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            })
            .catch((err) => {
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
                console.log(err);
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
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Home;
