import { IonContent, IonPage } from "@ionic/react"
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
                    
                        <IonPage className="px-10">
							<HeaderContainer />
                            <IonContent fullscreen>
                                <div className="flex">
									<div className="hidden md:block"><Sidebar /></div>
                                	<div className="flex justify-center items-center pt-2 sticky">
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
                                </div>
                            </IonContent>
                        </IonPage>
                </>
            )}
        />
    );
};

export default AppRoute