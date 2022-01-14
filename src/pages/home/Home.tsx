import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';
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


            </IonContent>
        </IonPage>
    );
};

export default Home;
