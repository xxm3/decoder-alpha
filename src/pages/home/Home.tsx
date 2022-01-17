import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';
import { pin, wifi, wine, warning, walk, colorFill } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import {
    IonList,
    IonItem,
    IonCheckbox,
    IonLabel,
    IonNote,
    IonBadge,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/react';
import axios from 'axios';
import './Home.css';
import HeaderContainer from "../../components/header/HeaderContainer";
import { attachProps } from '@ionic/react/dist/types/components/utils';
import Card from './Card';
import CollectionCard from './CollectionCard';

const Home = () => {

    /**
     * State Variables
     */
    const [walletAddress, setWalletAddress] = useState('');

    const [products, setProducts] = useState([]);
    const [newcollections, setNewCollection] = useState([]);
    const [popularcollections, setPopularCollection] = useState([]);
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
        axios
            .get('https://us-central1-nft-discord-relay.cloudfunctions.net/api/homeData')
            .then((res) => {
                setProducts(res.data.data.possibleMintLinks[0]);
                setNewCollection(res.data.data.new_collections);
                setPopularCollection(res.data.data.popular_collections);
                console.log("res1----------------", products);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <IonPage className="bg-sky">
            <HeaderContainer mintAddrToParent={mintAddrToParent} showflag={true}/>
            {/* <IonContent className="ion-padding" fullscreen> */}
                {/*
                    TODO:
                    - reenable this, just link to search for now
                    - test out wallet, comment both this and above line into the ticket

                    - new card to do pulling from firebase for found mints ... Even if something has one single link - we can show it here
                        - do now or TODO - show the source the mint came from

                    - fix the DB so it stores a single mint multiple times... not just one and done

                    - fix Jessica script so it deletes files after creating
                    - Be able to show the CM ID next to each of these mints URLs, in frontend (by passing it to the script)
                    - https://gitlab.com/nft-relay-group/functions/-/issues/55 to pull the live data from it

                */}
                <></>
            <IonContent>
                <IonRow>
                    <IonLabel className="text-7xl text-blue-600">NewCollection</IonLabel>
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
                        <IonLabel className="text-7xl text-blue-600">PopularCollection</IonLabel>
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
            </IonContent>
            {/* </IonContent> */}
            {/* <IonHeader>
                <IonToolbar>
                <IonTitle></IonTitle>
                </IonToolbar>
            </IonHeader> */}

            <IonContent>
                {
                    products.map((product: any, index: any) => (
                        <Card key={index} url={product.url} source={product.source} timestamp={product.timestamp} readableTimestamp={product.readableTimestamp} />
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
            </IonContent>
        </IonPage>
    );
};

export default Home;
