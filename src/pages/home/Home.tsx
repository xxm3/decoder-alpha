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

            </IonContent>
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
        </IonPage>
    );
};

export default Home;
