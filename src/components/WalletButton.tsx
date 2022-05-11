import {IonButton, IonIcon, IonItem,  IonList, useIonToast} from '@ionic/react';
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
import "./WalletButton.css"
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
            duration: 10000,
            buttons: [{ text: 'hide', handler: () => dismiss() }],
        });
    }

    return (
        <>
            <Tooltip
                open={showDropdown}
                onRequestClose={() => setShowDropdown(false)}
                html={
                    <IonList lines="none" className="py-1 dropdown-list rounded items-center space-y-2 overflow-x-hidden">
                       <IonItem color="inherit">
                       	 <IonButton
							onClick={() => dcWallet()}
							color="inherit"
	                        className="border-transparent h-3/4 flex space-x-2 px-2 mx-0 w-full shadow-none hover:bg-primary-tint">
	                            <>
	                                <IonIcon icon={wallet}/>
	                                <p>Disconnect Wallet</p>
	                            </>
	                        </IonButton>
                       </IonItem>
                    </IonList>
                }
                trigger="click" position={"bottom"} disabled={!walletAddress}>

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
