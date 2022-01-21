message could send that guy on professor....

sorry for bothering again =D I got that working, neat stuff. Just wondering your opinion - how do you think someone would start this on a running nodejs server though? I want to have a website where someone can put in a CM ID, and it returns the mint info.

from what I've seen with the code, this requries you to be logged in with your wallet. and my nodejs server




below code gets errors that i googled from the package.. wasn't any solution




// import { PublicKey } from '@solana/web3.js';
// import { useWallet } from '@solana/wallet-adapter-react';
// import * as anchor from '@project-serum/anchor';
// import { MintLayout, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
// import { SystemProgram } from '@solana/web3.js';
// import {
//     LedgerWalletAdapter,
//     PhantomWalletAdapter,
//     SlopeWalletAdapter,
//     SolflareWalletAdapter,
//     SolletExtensionWalletAdapter,
//     SolletWalletAdapter,
//     TorusWalletAdapter,
// } from '@solana/wallet-adapter-wallets';
// import {
//     WalletModalProvider,
//     WalletDisconnectButton,
//     WalletMultiButton
// } from '@solana/wallet-adapter-react-ui';
// import { clusterApiUrl } from '@solana/web3.js';
// import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
// import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

// Default styles that can be overridden by your app
// require('@solana/wallet-adapter-react-ui/styles.css');
// import {Connection, programs} from '@metaplex/js';

// TO.DO
const wallet = useWallet();
const getCmidDetails = async () => {

    // TO.DO: pass in
    const candyMachineId = "6FKrA68HvuNa5GRqZiGzRrSBXWou8tmv1HT73PBPWwiC"; // relic
    const candyPk = new anchor.web3.PublicKey(candyMachineId);

    const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
        'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ',
    );

    // TO.DO: ssc
    // const connection = new anchor.web3.Connection(rpcHost ? rpcHost : anchor.web3.clusterApiUrl('devnet'));
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('mainnet-beta'));

    const anchorWallet = {
        publicKey: wallet.publicKey,
        signAllTransactions: wallet.signAllTransactions,
        signTransaction: wallet.signTransaction,
    }

    // TO.DO: no red
    const provider = new anchor.Provider(connection, anchorWallet, {
        preflightCommitment: 'recent',
    });

    const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider);
    const program = new anchor.Program(idl, CANDY_MACHINE_PROGRAM, provider);

    const state: any = await program.account.candyMachine.fetch(candyPk);
    const itemsAvailable = state.data.itemsAvailable.toNumber();
    const itemsRedeemed = state.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;

    console.log(state);
};
// getCmidDetails();