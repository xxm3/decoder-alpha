import { IonButton } from '@ionic/react';
import useConnectWallet from '../hooks/useConnectWallet';

function WalletButton() {
    const connectWallet = useConnectWallet();

    return (
        <IonButton
            color="success"
            className="text-sm"
            onClick={() => connectWallet(null)}
        >
            Connect Wallet
        </IonButton>
    );
}

export default WalletButton;
