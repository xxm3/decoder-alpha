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
    // @ts-ignore
    return (
        <IonPage className="bg-sky">
            <HeaderContainer mintAddrToParent={mintAddrToParent} showflag={true}/>
            {/* <IonContent className="ion-padding" fullscreen> */}
                {/*
                    TODO:
                    DONE - make the title of the site smaller
                    HalfDone- line up the "type to search" and "search" button
                    DONE - make the "connect to wallet" smaller
                    - completely reformat the list on top:
                    - give it a title of "Possible Mints"
                    - get rid of all icons
                    - make it look closer to the search results - get rid of the "1642430722680" timestamp, get rid of the other timestamp and make it show "5 minutes ago" etc...
                    DONE - get rid of the "S" and rather say "Source: S", followed by the link
                    DONE - make the link a click-able URL
                    - when you type in the search on the "search" page, its searching before you even press enter
                    - on the search page - the "click to toggle" is off by default - should be on
                    - on home page need loading bars for everything
                    completely reformat new collection (and give it a space in the title), and reformat popular collection, to make it look closer to magiceden and make it much smaller
                    reformat in the collection how we're looping over keywords
                    get rid of "Destination" in collection
                */}
                <></>
            <IonContent>
                <IonRow>
                    <IonLabel className="text-7xl text-blue-600">New Collection</IonLabel>
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
                        <Card key={index} url={product.url} source={"Source: " + product.source}
                              timestamp={product.timestamp} readableTimestamp={product.readableTimestamp} />
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
