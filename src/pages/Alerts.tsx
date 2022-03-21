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
import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

function StackedSearch({foo, onSubmit}: any) {

    /**
     * States & Variables
     */
    const [present, dismiss] = useIonToast();
    const [formAddAlertToken, setFormAddAlertToken] = useState('');
    const [formLoadingAddAlertToken, setFormLoadingAddAlertToken] = useState(false); // form loading

    const walletAddress = useSelector(
        (state: RootState) => state.wallet.walletAddress
    );

    // const [alertNewTokensModalOpen, setAlertNewTokensModalOpen] = useState(false); // model open or not

    /**
     * Use Effects
     */

    // fill in their wallet from 'connect wallet', if set...
    useEffect(() => {
        // @ts-ignore
        setFormAddAlertToken(walletAddress);
    }, [walletAddress]);

    /**
     * Functions
     */
    // const clickedAlertNewTokens = (val: boolean) => {
    //     setAlertNewTokensModalOpen(val);
    //     // setPopoverOpened(null);
    // }

    // in the form for multiple wallets - submit button clicked
    const addAlertsTokenSubmit = (enable: boolean) => {

        if (!formAddAlertToken || formAddAlertToken.length !== 44) {
            present({
                message: 'Error - please enter a single, valid SOL wallet address',
                color: 'danger',
                duration: 5000
            });
            return;
        }

        setFormLoadingAddAlertToken(true);

        try {
            setFormLoadingAddAlertToken(false); // loading false
            setFormAddAlertToken(''); // clear the form
            // setMultWalletAryFromCookie(cookies.get('multWalletsAry')); // set array to show user on frontend

            instance
                .post(environment.backendApi + '/receiver/foxSales', {
                    token: formAddAlertToken,
                    enable: enable
                })
                .then((res) => {
                    const data = res.data;

                    // console.log(data);

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

            // TODO: 10 thing twitter (...perform one miss period ... no alerts to wallet.... mintalert first)...ask michael > post twitter ...... send Jay

            // TODO: need test daily mint hourly... for a day

            /**
             * TODO-m: alerts!
             *
             * able to tell where alert going to (discord or web)
             *
             * test by sending me tokens!
             *
             * update docs.sol ... and the temp cookie (after renaming the cookie) (so we can tell people about alerts)
             *
             * look for enable:enable ... able to remove the alert (unsub etc...)
             * home page to view recent alerts?
             *
             * ... join dead kings disc
             */

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

            <div hidden={true} className="secondary-bg-forced m-1 p-4 rounded-xl">
                <h4 className={`font-medium ${window.location.href.includes('fnt') ? 'text-red-600 font-medium' : ''}`}>
                    Alerts on New WL Tokens to your Wallet
                </h4>

                <div
                    className="ml-3 mr-3 mb-2 relative mt-2 bg-gradient-to-b from-bg-primary to-bg-secondary p-3 rounded-xl">
                    <div className="font-medium">
                        <p>
                            This alerts you when any WL Token (that is also listed on Fox Token Market) gets added to your
                            wallet. Add a single SOL wallet address below.
                        </p>
                    </div>
                </div>

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


                    {/*<IonButton*/}
                    {/*    color="primary"*/}
                    {/*    className="mt-5"*/}
                    {/*    hidden={formLoadingAddAlertToken}*/}
                    {/*    onClick={() => addAlertsTokenSubmit(true)}*/}
                    {/*>*/}
                    {/*    Submit*/}
                    {/*</IonButton>*/}

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
            </div>


            <hr className="m-5" />

            <h3 className="text-xl font-medium mb-3">Discord Managed Alerts</h3>

            <div className="secondary-bg-forced m-1 p-4 rounded-xl">
                {/*bg-yellow-800*/}
                <h4 className={`font-medium ${window.location.href.includes('fnn') ? 'text-red-600 font-medium' : ''}`}>
                    New Fox WL Token Market Names
                </h4>
                The <a href="https://discord.com/channels/925207817923743794/951513272132182066" target="_blank" className="underline">#analytics-etc</a> channel in Discord
                and the home page of the site shows when WL tokens get official names by the Famous Fox team,
                or when a user of SOL Decoder adds a custom name to one.
                <br/>
                Visit <a href="https://discord.com/channels/925207817923743794/938996145529712651 target=_blank" className="underline">#self-roles</a> in Discord and get the <b>@fox-wl-alerts</b> role to get alerts when this happens
            </div>

            <div className="secondary-bg-forced m-1 p-4 rounded-xl">
                <h4 className={`font-medium ${window.location.href.includes('ma') ? 'text-red-600 font-medium' : ''}`}>
                    Mint Alerts (parsed from Discord)
                </h4>
                The <a href="https://discord.com/channels/925207817923743794/925215482561302529" target="_blank" className="underline">#mint-alerts-automated</a> channel in Discord
                and the <Link to={'mintstats'} className="underline">Mint Stats</Link> page of the site is a live feed that parses links from the discords we watch. It alerts when any link could contain a new mint, before or while it is released. The mint must be linked from two discords before it shows up. On Discord, Candy Machine ID and mint details are also posted, if found.
                <br/>
                Visit <a href="https://discord.com/channels/925207817923743794/938996145529712651 target=_blank" className="underline">#self-roles</a> in Discord and get the <b>@Minter</b> role to get alerts when this happens
            </div>

        </>
    );
}

export default StackedSearch;

