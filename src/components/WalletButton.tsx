import {IonButton, IonIcon, useIonToast} from '@ionic/react';
import useConnectWallet from '../hooks/useConnectWallet';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from "../redux/store";
import {useEffect, useMemo, useRef, useState} from 'react';
import {
    Tooltip,
} from 'react-tippy';
import {chevronDown, chevronUp, wallet} from 'ionicons/icons';
import {setWallet} from '../redux/slices/walletSlice';
import useOnScreen from '../hooks/useOnScreen';


function WalletButton() {
    const connectWallet = useConnectWallet();
    const walletAddress = useSelector(
        (state: RootState) => state.wallet.walletAddress
    );
    const [present, dismiss] = useIonToast();
    const smallerWallet = useMemo(
        () =>
            walletAddress
                ? walletAddress.substring(0, 4) +
                '...' +
                walletAddress.substring(walletAddress.length - 4)
                : '',
        [walletAddress]
    );

    const walletButtonRef = useRef<HTMLIonButtonElement>(null);
    const [showDropdown, setShowDropdown] = useState(false)

    const isOnScreen = useOnScreen(walletButtonRef);
    useEffect(() => {
        if (!isOnScreen) {
            setShowDropdown(false)
        }
    }, [isOnScreen])

    const dispatch = useDispatch();

    const dcWallet = () => {
        // @ts-expect-error
        window.solana.disconnect();
        dispatch(setWallet(null));

        present({
            message: 'Wallet disconnected. Refresh the page if connecting a new wallet, to get "Fox Token Market - View My Tokens" to show properly',
            color: 'success',
            duration: 10000
        });
    }

    return (
        <>
            <Tooltip
                open={showDropdown}
                onRequestClose={() => setShowDropdown(false)}
                html={
                    <div className="bg-bg-tertiary py-3 flex flex-col space-y-4">
                        <IonButton onClick={() => dcWallet()} color="inherit"
                                   className="border-transparent shadow-none bg-inherit rounded hover:bg-blue-500">
                            <div className="flex space-x-2 py-1.5">
                                <IonIcon icon={wallet}/>
                                <p>Disconnect Wallet</p>
                            </div>
                        </IonButton>


                    </div>
                }
                trigger="click" position={"bottom"} disabled={!walletAddress}>

                {/*TODO: after connecting, the dropdown immediatley shows ... also part of "DC wllet" shows off screen ... also click DC then f5, still connected */}
                <IonButton
                    color="primary"
                    ref={walletButtonRef}
                    className="text-sm space-x-1"
                    onClick={() => {
                        if (!walletAddress) connectWallet(null);
                        else setShowDropdown(show => !show);
                    }}
                >
                    <p>{walletAddress ? smallerWallet : "Connect Wallet"}</p>
                    <IonIcon hidden={!walletAddress} icon={showDropdown ? chevronUp : chevronDown}/>
                </IonButton>
            </Tooltip>

        </>
    );
}

export default WalletButton;
