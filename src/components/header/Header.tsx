import './Header.css';
import React, {useEffect, useState, FC, useMemo } from "react";
import {
    IonButton,
    IonHeader,
    IonRouterLink,
    IonIcon,
    IonToolbar,
    IonItem,
    IonSearchbar
} from "@ionic/react";
import {useHistory} from 'react-router';
import { search, closeOutline } from 'ionicons/icons';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

// @ts-ignore
const HeaderContainer = ({mintAddrToParent, showflag, onClick}) => {

    /**
     * States & Variables
     */
    let history = useHistory();
    const [walletAddress, setWalletAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

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
                }
            } else {
                alert('Get a Phantom Wallet 👻'); // TODO: cleanup
            }
        } catch (error) {
            console.error(error);
        }
    };

    // checkIfWalletIsConnected();
    // if (walletAddress) {
    //     // Call Solana program here.
    //     // Set state
    //     console.log("ue - wallet set");
    //
    //     setWalletAddress(walletAddress);
    //     setIsWalletConnected(true);
    // }

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

    /**
     * Renders
     */

    // @ts-ignore
    return (
        <React.Fragment>
            <IonHeader className="m-4 ">
                <IonToolbar className="bg-card rounded-lg">
                    <IonItem>
                    <IonRouterLink className="text-2xl" routerLink="/"
                        hidden={width < 750 && showMobileSearch}>
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
                                        hidden={width < 750 && !showMobileSearch} />

                        {/* search button for big screens, to do the actual search*/}
                        {width >= 750 && (
                            // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                            <div className="xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1"
                                    onClick={() => handleSearch(searchValue)}>
                                <IonIcon slot="icon-only" icon={search} className=" " />
                            </div>
                        )}

                        {/* mobile search stuff */}
                        {width < 750 && (
                        <>
                            {/* show search button, for mobile screens */}
                            <div className="xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1"
                                 // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                    onClick={mobileSearchClicked} hidden={showMobileSearch}>
                                <IonIcon slot="icon-only" icon={search} className=" " />
                            </div>
                            {/* do the actual search, for mobile screens */}
                            <div className="xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1"
                                 // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                    onClick={() => handleSearch(searchValue)} hidden={!showMobileSearch}>
                                <IonIcon slot="icon-only" icon={search} className=" " />
                            </div>

                            {/*hide search*/}
                            <div className=""
                                 // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                onClick={mobileSearchClicked}>
                                <IonIcon slot="icon-only" icon={closeOutline} className=" xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1" hidden={!showMobileSearch} />
                            </div>
                        </>
                        )}



                        {/*wallet stuff*/}

                        {/*{!isWalletConnected && width >= 750 && (*/}
                        {/*    <>*/}
                        {/*        /!*<span style={{width: '75px'}}> </span>*!/*/}
                        {/*        <IonButton color="success" className="absolute inset-y-0 right-0 mr-8 mt-4" onClick={() => connectWallet()}>*/}
                        {/*            Connect Wallet*/}
                        {/*        </IonButton>*/}
                        {/*    </>*/}
                        {/*)}*/}
                        {/*{isWalletConnected && width >= 750 && (*/}
                        {/*    <>*/}
                        {/*        /!*TODO: cleanup, and need disconnect etc... *!/*/}
                        {/*        <span className="absolute inset-y-0 right-0 mr-8 mt-4" >{walletAddress}</span>*/}
                        {/*    </>*/}
                        {/*)}*/}



                        {/* hamburger, to connect wallet on mobile */}

                        {/*
                            TO.DO: don't implement - will be implemented in https://gitlab.com/nft-relay-group/frontend-app/-/issues/16
                        */}
                        {/*{width < 750 && (*/}
                        {/*    <div className="xs:flex items-center px-2 rounded-lg space-x-4 mx-auto bg-success-1">*/}
                        {/*        <IonIcon slot="icon-only" icon={menuOutline} className="rounded-b-3xl"/>*/}
                        {/*    </div>*/}
                        {/*})*/}

                    </div>
                    </IonItem>
                </IonToolbar>
            </IonHeader>
        </React.Fragment>
    );
};

export default HeaderContainer;
