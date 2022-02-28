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
                        <>
                            <IonGrid className="w-screen h-screen flex flex-col relative">
                                <IonRow>
                                    <IonCol size="12">
                                        <HeaderContainer />
                                    </IonCol>
                                </IonRow>
                                <IonRow className="flex-grow">
                                    <IonCol size="12" className="flex h-full">
                                        <Sidebar collapsible />
                                        <IonContent className="h-full">
											<IonGrid>
												<IonRow>
													<IonCol size="12" className="flex justify-center">	
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
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </>
                    </IonPage>
                </>
            )}
        />
    );
};

export default AppRoute