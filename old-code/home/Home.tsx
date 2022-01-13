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
                    - fix match[2] error... more try catch (and/or that pmn2s thing...)

                    - monitor & post about chromium error...

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


                <br/> {walletAddress}


            </IonContent>

        </IonPage>
    );
};

export default Home;
