import './Header.css';
import React, {useEffect, useState, FC, useMemo } from "react";
import {
    IonButton,
    IonHeader,
    IonRouterLink,
    IonIcon,
    IonToolbar,
    IonItem,
    IonSearchbar, useIonAlert, IonMenu, IonTitle, IonContent, IonList
} from "@ionic/react";
import {useHistory} from 'react-router';
import { search, closeOutline, menuOutline } from 'ionicons/icons';
// @ts-ignore
import { menuController } from 'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/index.esm.js';

// @ts-ignore
const HeaderContainer = ({mintAddrToParent, showflag, onClick}) => {

    /**
     * States & Variables
     */
    let history = useHistory();
    const [walletAddress, setWalletAddress] = useState(null);
    const [smallerWallet, setSmallerWallet] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    const smallHeaderWitdh = 930; // what size browser needs to be, before header goes small mode
    const [present] =   useIonAlert(); // ion alert

    /**
     * Use Effects
     */
    // resizing window
    useEffect(() => {
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    // connecting SOL wallet - called on load
    useEffect(() => {
        // console.log("in load ue");
        const onLoad = async () => {
            // console.log("in onload");
            await checkIfWalletIsConnected();
        };
        onLoad();
        // window.addEventListener('load', onLoad);
        // return () => window.removeEventListener('load', onLoad);
    }, []);
    useEffect(() => {
        if (walletAddress) {
            // Call Solana program here.
            console.log("ue - wallet set");

            setWalletAddress(walletAddress);
            setIsWalletConnected(true);

            // @ts-ignore
            const lastFour = walletAddress.substring(walletAddress.length - 4);
            // @ts-ignore
            setSmallerWallet(walletAddress.substr(0,4) + '...' + lastFour);
        }
    }, [walletAddress]);

    /**
     * Functions
     */
    // resizing the window
    window.onresize = () => {
        resizeWidth();
    };

    function resizeWidth() {
        setWidth(window.innerWidth);
    }

    // for connecting to SOL wallet - called on load
    const checkIfWalletIsConnected = async () => {
        try {
            // @ts-ignore
            const {solana} = window;
            if (solana) {
                if (solana.isPhantom) {
                    const response = await solana.connect({onlyIfTrusted: true});
                    console.log('CIWIC - Connected with Public Key:', response.publicKey.toString());

                    /*
                     * Set the user's publicKey in state to be used later!
                     */
                    setWalletAddress(response.publicKey.toString());
                    setIsWalletConnected(true);

                    // send the wallet address to the parent
                    mintAddrToParent(walletAddress);
                }else{
                    await present('Please get a Phantom Wallet!', [{text: 'Ok'}]);
                }
            } else {
                await present('Please get a Phantom Wallet!', [{text: 'Ok'}]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // connect to your SOL wallet - called when clicking "connect Wallet"
    const connectWallet = async () => {
        // @ts-ignore
        const {solana} = window;
        if (solana) {
            const response = await solana.connect();

            console.log('CW - Connected with Public Key:', response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
            setIsWalletConnected(true);
        }
    };

    // does the search functionality
    function handleSearch(val: any) {
        if (typeof (val) !== "undefined" && val !== '') {
            history.push(`/search/${val}`);
            window.location.reload();
        } else {
            history.push('/');
        }
    }

    // when typing into the search bar
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setSearchValue(e.target.value!);
            handleSearch(e.target.value);
        }
    }

    // clicked on search button, when on mobile
    const mobileSearchClicked = () => {
        setShowMobileSearch(!showMobileSearch);
    }

    const openMenu = () => {
        console.log("...");

        // @ts-ignore
        window.menuController = menuController;
        menuController.open();
    }

    /**
     * Renders
     */

    // @ts-ignore
    return (
        <React.Fragment>


            <IonMenu side="start" menuId="first">
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonTitle>Start Menu</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonItem>Menu Item</IonItem>
                        <IonItem>Menu Item</IonItem>
                        <IonItem>Menu Item</IonItem>
                        <IonItem>Menu Item</IonItem>
                        <IonItem>Menu Item</IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>



            <IonHeader className="m-4 ">
                <IonToolbar className="bg-card rounded-lg">
                    <IonItem>
                    <IonRouterLink className="text-2xl" routerLink="/"
                        hidden={width < smallHeaderWitdh && showMobileSearch}>
                        SOL Decoder
                    </IonRouterLink>

                    <span style={{width: '75px'}}> </span>

                    <div className="xs:flex items-center rounded-lg overflow-hidden px-2 py-1 ">

                        {/* search bar */}
                        <IonSearchbar className="xs-flex text-base text-gray-400 flex-grow outline-none px-2"
                                        type="text"
                                        value={searchValue}
                                        onKeyPress={handleKeyDown}
                                        onIonChange={e => setSearchValue(e.detail.value!)}
                                        animated placeholder="Type to search" disabled={isLoading}
                                        style={{width: '450px'}}
                                        hidden={width < smallHeaderWitdh && !showMobileSearch} />

                        {/* search button for big screens, to do the actual search*/}
                        {width >= smallHeaderWitdh && (
                            // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                            <div className="text-2xl xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1 pb-1 pt-1 cursor-pointer"
                                    onClick={() => handleSearch(searchValue)}>
                                <IonIcon slot="icon-only" icon={search} className=" " />
                            </div>
                        )}

                        {/* mobile search stuff */}
                        {width < smallHeaderWitdh && (
                        <div className="">
                            {/* do the actual search, for mobile screens */}
                            <div className="text-2xl xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1 pb-1 pt-1 cursor-pointer"
                                // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                 onClick={() => handleSearch(searchValue)} hidden={!showMobileSearch}>
                                <IonIcon slot="icon-only" icon={search} className=" " />
                            </div>

                            {/* show search button, for mobile screens */}
                            <div className="text-2xl xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1 pb-1 pt-1 cursor-pointer
                                absolute inset-y-0 right-0 mr-20 mt-4 "
                                 // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                    onClick={mobileSearchClicked} hidden={showMobileSearch}>
                                <IonIcon slot="icon-only" icon={search} className=" " />
                            </div>

                            {/*hide search*/}
                            <div className="absolute inset-y-0 right-0 mr-8 mt-4 "
                                 // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                onClick={mobileSearchClicked}>
                                <IonIcon slot="icon-only" icon={closeOutline}
                                         className="text-2xl xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1 ml-2 pb-1 pt-1 cursor-pointer" hidden={!showMobileSearch} />
                            </div>
                        </div>
                        )}



                        {/*wallet stuff*/}
                        {!isWalletConnected && width >= smallHeaderWitdh && (
                            <>
                                {/*<span style={{width: '75px'}}> </span>*/}
                                <IonButton color="success" className="absolute inset-y-0 right-0 mr-8 mt-4 cursor-pointer" onClick={() => connectWallet()}>
                                    Connect Wallet
                                </IonButton>
                            </>
                        )}
                        {isWalletConnected && width >= smallHeaderWitdh && (
                            <>
                                <span className="absolute inset-y-0 right-0 mr-8 mt-4" >{smallerWallet}</span>
                            </>
                        )}

                        {/* hamburger, to connect wallet on mobile */}
                        {width < smallHeaderWitdh && (
                            <div className="text-2xl xs:flex items-center px-2 rounded-lg space-x-4 mx-auto bg-success-1 ml-2 pb-1 pt-1 cursor-pointer
                                        absolute inset-y-0 right-0 mr-8 mt-4 "
                                 hidden={showMobileSearch}>
                                <IonIcon slot="icon-only" icon={menuOutline} className="rounded-b-3xl" onClick={openMenu} />
                            </div>
                        )}

                    </div>
                    </IonItem>
                </IonToolbar>
            </IonHeader>
        </React.Fragment>
    );
};

export default HeaderContainer;
