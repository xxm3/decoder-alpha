import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/react';
import { IonList, IonItem, IonCheckbox, IonLabel, IonNote, IonBadge } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './Home.css';
import HeaderContainer from "../../components/header/HeaderContainer";

const Home = () => {

    /**
     * State Variables
     */
    const [walletAddress, setWalletAddress] = useState('');

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

    return (
        <IonPage>
            <HeaderContainer mintAddrToParent={mintAddrToParent} />
            <IonContent className="ion-padding" fullscreen>

                {/* EXAMPLE CARD */}
                <IonCard>
                    <IonCardHeader>
                        <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
                        <IonCardTitle>Card Title</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                        Keep close to Nature's heart... and break clear away, once in awhile,
                        and climb a mountain or spend a week in the woods. Wash your spirit clean.
                    </IonCardContent>
                </IonCard>


            </IonContent>
        </IonPage>
    );
};

export default Home;
