import { useWallet } from '@solana/wallet-adapter-react';
import {
    useWalletModal,
    WalletConnectButton,
    WalletModalButton,
} from '@solana/wallet-adapter-react-ui';
import React, {
    FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Button, ButtonProps } from './Button';
import { Tooltip } from 'react-tippy';
import { setWallet } from '../../../redux/slices/walletSlice';
import { useDispatch } from 'react-redux';


export const WalletMultiButton: FC<ButtonProps> = ({ children, ...props }) => {
    const { publicKey, wallet, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(false);
    const ref = useRef<HTMLUListElement>(null);
    const dispatch = useDispatch()

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const content = useMemo(() => {
        if (children) return children;
        if (!wallet || !base58) return null;
        return base58.slice(0, 4) + '..' + base58.slice(-4);
    }, [children, wallet, base58]);

    useEffect(() => {
      if(base58){
        dispatch(setWallet(base58))
      }else{
        dispatch(setWallet(null))
        
      }
    }, [base58])
    

    const openDropdown = useCallback(() => {
        setActive(true);
    }, []);

    const closeDropdown = useCallback(() => {
        setActive(false);
    }, []);

    const openModal = useCallback(() => {
        setVisible(true);
        closeDropdown();
    }, [closeDropdown]);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) return;

            closeDropdown();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, closeDropdown]);

    if (!wallet)
        return <WalletModalButton {...props}>{children}</WalletModalButton>;
    if (!base58)
        return <WalletConnectButton {...props}>{children}</WalletConnectButton>;

    return (
        <Tooltip
            open={true}
            html={
                <ul
                    aria-label="dropdown-list"
                    className={`wallet-adapter-dropdown-list ${
                        active && 'wallet-adapter-dropdown-list-active'
                    }`}
                    ref={ref}
                    role="menu"
                >
                    <li
                        onClick={disconnect}
                        className="wallet-adapter-dropdown-list-item"
                        role="menuitem"
                    >
                        Disconnect
                    </li>
                </ul>
            }
            trigger="click"
            position={'bottom'}
        >
            <Button
                aria-expanded={active}
                className="wallet-adapter-button-trigger"
                style={{
                    pointerEvents: active ? 'none' : 'auto',
                    ...props.style,
                }}
                onClick={openDropdown}
                {...props}
            >
                {content}
            </Button>
        </Tooltip>
        // <div className="wallet-adapter-dropdown">
        //     <Button
        //         aria-expanded={active}
        //         className="wallet-adapter-button-trigger"
        //         style={{ pointerEvents: active ? 'none' : 'auto', ...props.style }}
        //         onClick={openDropdown}
        //         {...props}
        //     >
        //         {content}
        //     </Button>
        //     <ul
        //         aria-label="dropdown-list"
        //         className={`wallet-adapter-dropdown-list ${active && 'wallet-adapter-dropdown-list-active'}`}
        //         ref={ref}
        //         role="menu"
        //     >
        //         <li onClick={disconnect} className="wallet-adapter-dropdown-list-item" role="menuitem">
        //             Disconnect
        //         </li>
        //     </ul>
        // </div>
    );
};
