import {
    IonButton,
    IonHeader,
    IonRouterLink,
    IonIcon,
    IonToolbar,
    useIonAlert,
} from "@ionic/react";
import {useEffect, useMemo, useState} from "react";
import {useHistory, useParams} from 'react-router';
import {
    arrowBack, search
} from 'ionicons/icons';
import { queryClient } from "../../queryClient";
import SearchBar from "../SearchBar";


const HeaderContainer = () => {

    /**
     * States & Variables
     */
    const { id } = useParams<{ id ?: string;}>()
    let history = useHistory();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const smallHeaderWitdh = 768; // what size browser needs to be, before header goes small mode
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
            if(window.innerHeight > smallHeaderWitdh){
                setShowMobileSearch(false)
            }
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
        if(val.length === 0) return;
        const queryKey = ["messages", id];
        queryClient.resetQueries(queryKey);
        console.log(val, encodeURIComponent(val));
        history.push(`/search/${encodeURIComponent(val)}`);

        // setSearchValue(''); // reset it
    }


    /**
     * Renders
     */

    return (
        <>

            <IonHeader className="p-4">
                <IonToolbar className="bg-card px-4 rounded-lg related">
                    <div className="justify-between space-x-8 flex items-center relative">
                        <IonRouterLink className="text-2xl" routerLink="/"
                            hidden={showMobileSearch}
                        >
                            SOL Decoder
                        </IonRouterLink>

					    <div className={`flex-grow flex items-center ${showMobileSearch ? "space-x-8" : "md:max-w-xl justify-end md:justify-start"}`}>
                            {showMobileSearch && <IonIcon slot="icon-only" icon={arrowBack} className="text-3xl cursor-pointer hover:opacity-80" onClick={() => setShowMobileSearch(false)}/>}
                            <div className={`flex-grow ${showMobileSearch ? "max-w-xl" : "hidden md:block"}`}>
                                <SearchBar onSubmit={handleSearch} initialValue={decodeURIComponent(id ?? "")} placeholder='Search to see graphs, Discord messages, and tweets' />
                            </div>
                            {!showMobileSearch && <IonIcon slot="icon-only" icon={search} className="md:hidden cursor-pointer text-2xl hover:opacity-80" onClick={() => setShowMobileSearch(true)} />}
                        </div>
                        {!showMobileSearch && (!isWalletConnected  ? (
                                <>
                                    <IonButton color="success" className="text-sm" onClick={() => connectWallet(null)}>
                                        Connect Wallet
                                    </IonButton>
                                </>
                            )
                           : (
                                <>
                                    <span className="" >{smallerWallet}</span>
                                </>
                            ))}
                        {/* <span style={{width: '75px'}}> </span>

                        <div className="xs:flex items-center rounded-lg overflow-hidden px-2 py-1 ">

                            <IonSearchbar className="xs-flex text-base text-gray-400 flex-grow outline-none px-2"
                                            type="text"
                                            value={searchValue}
                                            onKeyPress={handleKeyDown}
                                            onIonChange={e => setSearchValue(e.detail.value!)}
                                            animated placeholder="Type to search" disabled={isLoading}
                                            style={{width: '450px'}}
                                            hidden={width < smallHeaderWitdh && !showMobileSearch} />

                            {width >= smallHeaderWitdh && (
                                // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                <div className="text-2xl xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1 pb-1 pt-1 cursor-pointer"
                                        onClick={() => handleSearch(searchValue)}>
                                    <IonIcon slot="icon-only" icon={search} className=" " />
                                </div>
                            )}


                            {width < smallHeaderWitdh && (
                            <div className="">
                                <div className="text-2xl xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1 pb-1 pt-1 cursor-pointer"
                                    // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                    onClick={() => handleSearch(searchValue)} hidden={!showMobileSearch}>
                                    <IonIcon slot="icon-only" icon={search} className=" " />
                                </div>

                                <div className="text-2xl xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1 pb-1 pt-1 cursor-pointer
                                    absolute inset-y-0 right-0 mr-20 mt-4 "
                                    // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                        onClick={mobileSearchClicked} hidden={showMobileSearch}>
                                    <IonIcon slot="icon-only" icon={search} className=" " />
                                </div>

                                <div className="absolute inset-y-0 right-0 mr-8 mt-4 "
                                    // xs:flex p-1 rounded-lg space-x-4 mx-auto bg-success-1 absolute inset-y-0 right-0 my-4 mr-44
                                    onClick={mobileSearchClicked}>
                                    <IonIcon slot="icon-only" icon={closeOutline}
                                            className="text-2xl xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1 ml-2 pb-1 pt-1 cursor-pointer" hidden={!showMobileSearch} />
                                </div>
                            </div>
                            )}

                            {!isWalletConnected && width >= smallHeaderWitdh && (
                                <>
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

                            {width < smallHeaderWitdh && (
                                <div className="text-2xl xs:flex items-center px-2 rounded-lg space-x-4 mx-auto bg-success-1 ml-2 pb-1 pt-1 cursor-pointer
                                            absolute inset-y-0 right-0 mr-8 mt-4 "
                                    hidden={showMobileSearch}>
                                    <IonIcon slot="icon-only" icon={menuOutline} className="rounded-b-3xl"  />
                                </div>
                            )}

                        </div> */}
                    </div>
                </IonToolbar>
            </IonHeader>
        </>
    );
};

export default HeaderContainer;
