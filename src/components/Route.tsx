import { IonContent, IonPage } from "@ionic/react"
import React from "react";
import { Route, RouteProps } from "react-router"
import HeaderContainer from "./header/Header"


const AppRoute : React.FC<RouteProps> = (
    { children, render, component, ...rest}
) => {
    return (
        <Route
            {...rest}
            component={undefined}
            children={undefined}
            render={(componentProps) => (
                <IonPage>
                    <IonContent fullscreen>
                        <HeaderContainer />
                        <div className="bg-gradient-to-b from-bg-primary to-bg-secondary flex justify-center items-center p-4 pt-2 sticky">
                            {children
                                ? typeof children === 'function'
                                    ? children(componentProps)
                                    : children
                                : component
                                ? React.createElement(component, componentProps)
                                : render
                                ? render(componentProps)
                                : null}
                        </div>
                    </IonContent>
                </IonPage>
            )}
        />
    );
};

export default AppRoute