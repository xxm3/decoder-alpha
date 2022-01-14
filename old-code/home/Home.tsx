import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink} from '@ionic/react';
import {IonList, IonItem, IonCheckbox, IonLabel, IonNote, IonBadge} from '@ionic/react';
import React, {useEffect, useState} from 'react';
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

                {/*
                    TODO:

                    - new card to do pulling from firebase for found mints (also show the source the mint came from)

                    - Be able to show the CM ID next to each of these mints URLs, in frontend (by passing it to the script)
                        - https://gitlab.com/nft-relay-group/functions/-/issues/55 to pull the live data from it
                */}

                <br/> {walletAddress}


            </IonContent>

        </IonPage>
    );
};

export default Home;
