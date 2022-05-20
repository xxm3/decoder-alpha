import { css } from '@emotion/react';
import {
    IonCol,
    IonContent,
    IonGrid,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonRow,
    IonSplitPane,
    IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/nav/Sidebar';
import HeaderContainer from '../../components/nav/Header';
import CreateWalletPage from './CreateWalletPage';
import './CreateWallet.scss';

function CreatetWalletLayout() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const smallHeaderWidth = 1024; // w

    useEffect(() => {
        // resize window stuff

        window.addEventListener(
            'resize',
            () => {
                if (window.innerWidth < 768) {
                    setShowMobileMenu(true);
                } else {
                    setShowMobileMenu(false);
                }
            },
            true
        );
        return () => {
            window.removeEventListener('resize', (event) => {
                setShowMobileMenu(false);
            });
        };
    }, []);

    return (
        <IonPage>
            <IonGrid className="w-screen h-screen flex flex-col relative">
                {/* header */}
                {showMobileMenu && (
                    <IonToolbar>
                        <div className="justify-between space-x-4 flex items-center">
                            <div className="flex items-center space-x-4">
                                <IonMenuButton
                                    color="white"
                                    menu="sidebar"
                                    className="md:hidden ion-no-padding"
                                    css={css`
                                        font-size: 32px;
                                    `}
                                />
                            </div>
                        </div>
                    </IonToolbar>
                )}

                {/*  */}
                <IonRow className="flex-grow">
                    <IonCol size="12" className="flex h-full">
                        <IonSplitPane
                            when="md"
                            contentId="main"
                            css={css`
                                @media only screen and (min-width: 768px) and (max-width: 992px) {
                                    --side-min-width: none;
                                }
                            `}
                        >
                            {/* SIDEBAR */}
                            <IonMenu menuId="sidebar" contentId="main">
                                <Sidebar />
                            </IonMenu>
                            {/* CONTENT */}
                            <IonContent className="h-full" id="main">
                                <CreateWalletPage />
                            </IonContent>
                        </IonSplitPane>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    );
}

export default CreatetWalletLayout;
