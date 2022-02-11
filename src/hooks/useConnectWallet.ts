import { useIonAlert } from '@ionic/react';
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setWallet } from '../redux/slices/walletSlice';


function useConnectWallet() {
	const dispatch = useDispatch()
	const [present] = useIonAlert();
	const connectWallet = useCallback(async (obj : { onlyIfTrusted : boolean} | null) => {
		
			// @ts-ignore
			const { solana } = window;
			if (solana) {
				if (solana.isPhantom) {
					const response = await solana.connect(obj);
					console.log('onload - Connected with Public Key:', response.publicKey.toString());
	
					// Set the user's publicKey in state to be used later!
					dispatch(setWallet(response.publicKey.toString()));
				}else{
					await present('Please get a Phantom Wallet!', [{text: 'Ok'}]);
				}
			} else {
				await present('Please get a Phantom Wallet!', [{text: 'Ok'}]);
			}
	}, [dispatch, present])
	return connectWallet
}

export default useConnectWallet