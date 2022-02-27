import { IonCol, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react"
import React from "react";
import { Route, RouteProps } from "react-router"
import HeaderContainer from "./nav/Header"
import Sidebar from "./nav/Sidebar";


const AppRoute : React.FC<RouteProps> = (
    { children, render, component, ...rest}
) => {
    return (
        <Route
            {...rest}
            component={undefined}
            children={undefined}
            render={(componentProps) => (
                <>
                    <IonPage>
                        <IonContent fullscreen>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="12" className="ion-no-padding">
                                        <HeaderContainer />
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol className="hidden md:block" sizeLg="3" sizeMd="1.25" sizeXl="2">
                                        <Sidebar />
                                    </IonCol>
                                    <IonCol sizeLg="9" sizeMd="10.75" sizeXl="10">
                                        <div className="flex justify-center items-center pt-2">
                                            {children
                                                ? typeof children === 'function'
                                                    ? children(componentProps)
                                                    : children
                                                : component
                                                ? React.createElement(
                                                      component,
                                                      componentProps
                                                  )
                                                : render
                                                ? render(componentProps)
                                                : null}
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonContent>
                    </IonPage>
                </>
            )}
        />
    );
};

export default AppRoute