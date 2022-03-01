import { IonCol, IonContent, IonGrid, IonMenu, IonPage, IonRow, IonSplitPane } from "@ionic/react"
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
                        <IonContent>
                        	<IonGrid>
	                            <IonRow>
	                                <IonCol
	                                    size="12"
	                                    className="flex justify-center"
	                                >
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