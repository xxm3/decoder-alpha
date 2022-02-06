import {
    IonButton,
    IonHeader,
    IonRouterLink,
    IonIcon,
    IonToolbar,
    IonSearchbar,
    useIonAlert,
    IonItem
} from "@ionic/react";
import React, {useEffect, useMemo, useState} from "react";
import {useHistory, useParams} from 'react-router';
import {
    search,
    closeOutline,
    menuOutline
} from 'ionicons/icons';
import { queryClient } from "../../queryClient";


const HeaderContainer = () => {

    /**
     * States & Variables
     */
    const { id } = useParams<{ id ?: string;}>()
    let history = useHistory();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState(id ?? '');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    const smallHeaderWitdh = 930; // what size browser needs to be, before header goes small mode
    const [present] =   useIonAlert(); // ion alert

    const smallerWallet = useMemo(() =>
        walletAddress ? walletAddress.substring(0, 4) + '...' + walletAddress.substring(walletAddress.length - 4)
            : '', [walletAddress])

    // onload useEffect
    useEffect(() => {
        const onLoad = async () => {
            // connecting SOL wallet
            try {
                await connectWallet({onlyIfTrusted: true});
            } catch (error) {
                console.error(error);
            }
        };

        // resize window stuff
        function resizeWidth() {
            setWidth(window.innerWidth);
        }

        window.addEventListener("resize", resizeWidth);
        onLoad();
        return () => {
            window.removeEventListener('load', onLoad)
            window.removeEventListener("resize", resizeWidth)
        };
    }, []);

    // connect to your SOL wallet - called when clicking "connect Wallet". And called onLoad
    const connectWallet = async (obj: any) => {
        // @ts-ignore
        const { solana } = window;
        if (solana) {
            if (solana.isPhantom) {
                const response = await solana.connect(obj);
                console.log('onload - Connected with Public Key:', response.publicKey.toString());

                // Set the user's publicKey in state to be used later!
                setWalletAddress(response.publicKey.toString());
                setIsWalletConnected(true);
            }else{
                await present('Please get a Phantom Wallet!', [{text: 'Ok'}]);
            }
        } else {
            await present('Please get a Phantom Wallet!', [{text: 'Ok'}]);
        }
    };

    // does the search functionality
    function handleSearch(val: string) {
        const queryKey = ["messages", id];
        queryClient.resetQueries(queryKey);
        history.push(`/search/${val}`);

        // setSearchValue(''); // reset it
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

    return (
        <>

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
                                <IonButton color="success" className="absolute inset-y-0 right-0 mr-8 mt-4 cursor-pointer" onClick={() => connectWallet(null)}>
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
                                <IonIcon slot="icon-only" icon={menuOutline} className="rounded-b-3xl"  />
                                {/*onClick={openMenu}*/}
                            </div>
                        )}

                    </div>
                    </IonItem>
                </IonToolbar>
            </IonHeader>
        </>
    );
};

export default HeaderContainer;
