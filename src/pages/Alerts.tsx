import {ChartData} from "chart.js";
import React, {useEffect, useMemo, useState} from "react";
import {instance} from "../axios";
import {dispLabelsDailyCount, getDailyCountData} from "../util/charts";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import {Chart} from "react-chartjs-2";
import Help from "../components/Help";
import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonTitle,
    IonToolbar, useIonToast
} from "@ionic/react";
import {close} from "ionicons/icons";
import {environment} from "../environments/environment";

function StackedSearch({ foo, onSubmit }: any) {

    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();
    const [formAddAlertToken, setFormAddAlertToken] = useState('');
    const [formLoadingAddAlertToken, setFormLoadingAddAlertToken] = useState(false); // form loading

    const [alertNewTokensModalOpen, setAlertNewTokensModalOpen] = useState(false); // model open or not

    /**
     * Use Effects
     */

    /**
     * Functions
     */
    const clickedAlertNewTokens = (val: boolean) => {
        setAlertNewTokensModalOpen(val);
        // setPopoverOpened(null);
    }

    // in the modal for multiple wallets - submit button clicked
    const addAlertsTokenSubmit = (enable: boolean) => {

        if (!formAddAlertToken || formAddAlertToken.length !== 44) {
            present({
                message: 'Error - please enter a single, valid SOL wallet address',
                color: 'danger',
                duration: 5000
            });
            return;
        }

        // TODO: fill in their wallet from 'connect wallet', if set...

        setFormLoadingAddAlertToken(true);

        try {
            setFormLoadingAddAlertToken(false); // loading false
            setFormAddAlertToken(''); // clear the form
            // setMultWalletAryFromCookie(cookies.get('multWalletsAry')); // set array to show user on frontend

            instance
                .post(environment.backendApi + '/receiver/foxSales', {
                    token: formAddAlertToken,
                    enable: enable // TODO: able to remove the alert (unsub etc...)
                })
                .then((res) => {
                    const data = res.data;

                    // TODO:
                    console.log(data);

                    present({
                        message: 'Successfully added the alert',
                        color: 'success',
                        duration: 5000
                    });

                }).catch(err => {

                console.error(err);
                setFormLoadingAddAlertToken(false); // loading false

                present({
                    message: 'An error occurred when adding the Alert',
                    color: 'danger',
                    duration: 5000
                });
            });

            // TODO: able to tell where alert going to (discord or web)

            // TODO: home page to view alerts?

            // TODO: !! test by sending me tokens!

            // TODO: update docs.sol ... and the temp cookie (after renaming the cookie)

        } catch (err) {
            console.error(err);
            setFormLoadingAddAlertToken(false); // loading false

            present({
                message: 'An error occurred when adding the Alert',
                color: 'danger',
                duration: 5000
            });
        }
    }

    /**
     * Renders
     */
    return (
        <>

            {/*
                modal - set alerts on your tokens
            */}
            <IonModal
                isOpen={alertNewTokensModalOpen}
                onDidDismiss={() => clickedAlertNewTokens(false)}
            >
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            Add Alerts for new Tokens
                            <a
                                className="float-right text-base underline cursor-pointer"
                                onClick={() => clickedAlertNewTokens(false)}
                            >
                                <IonIcon icon={close} className="h-6 w-6"/>
                            </a>
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="">
                    <div
                        className="ml-3 mr-3 mb-2 relative mt-2 bg-gradient-to-b from-bg-primary to-bg-secondary p-3 rounded-xl">
                        <div className="font-medium">
                            <p>
                                This alerts you when any WL Token (that is also listed on Fox Token Market) gets added to your wallet. Add a single SOL wallet address below.
                            </p>
                        </div>
                    </div>

                    {/*<div*/}
                    {/*    hidden={!multWalletAryFromCookie}*/}
                    {/*    className="ml-3 mr-3 mb-5 relative bg-gradient-to-b from-bg-primary to-bg-secondary p-3 rounded-xl"*/}
                    {/*>*/}
                    {/*    <div className="font-medium">*/}
                    {/*        <span className="font-bold">*/}
                    {/*                Wallets Added:*/}
                    {/*            </span>*/}
                    {/*        <ul>*/}
                    {/*            {multWalletAryFromCookie*/}
                    {/*                ? multWalletAryFromCookie*/}
                    {/*                    .split(',')*/}
                    {/*                    .map(function (wallet: any) {*/}
                    {/*                        return <li key={wallet}>- {wallet}</li>;*/}
                    {/*                    })*/}
                    {/*                : ''}*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="ml-3 mr-3">
                        <IonItem>
                            <IonLabel position="stacked" className="font-bold">
                                SOL Wallet Address
                            </IonLabel>
                            <IonInput
                                onIonChange={(e) =>
                                    setFormAddAlertToken(e.detail.value!)
                                }
                                value={formAddAlertToken}
                                placeholder="ex. 91q2zKjAATs28sdXT5rbtKddSU81BzvJtmvZGjFj54iU"
                            ></IonInput>
                        </IonItem>

                        <IonButton
                            color="success"
                            className="mt-5"
                            hidden={formLoadingAddAlertToken}
                            onClick={() => addAlertsTokenSubmit(true)}
                        >
                            Submit
                        </IonButton>
                        {/*<IonButton*/}
                        {/*    hidden={!multWalletAryFromCookie}*/}
                        {/*    color="danger"*/}
                        {/*    className="mt-5"*/}
                        {/*    onClick={() => resetMultWallets()}*/}
                        {/*>*/}
                        {/*    Reset Stored Wallets*/}
                        {/*</IonButton>*/}

                        <div hidden={!formLoadingAddAlertToken}>Loading...</div>
                    </div>
                </IonContent>
            </IonModal>

        </>
    );
}
export default StackedSearch;

