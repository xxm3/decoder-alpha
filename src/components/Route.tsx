import { IonCol, IonContent, IonGrid, IonMenu, IonPage, IonRow, IonSplitPane } from "@ionic/react"
import React, { useRef } from "react";
import { Route, RouteComponentProps, RouteProps } from "react-router"


export interface AppComponentProps extends RouteComponentProps {
	contentRef: React.MutableRefObject<HTMLIonContentElement | null>["current"]
}
const AppRoute : React.FC<RouteProps> = (
    { children, render, component, ...rest}
) => {
	const contentRef = useRef<HTMLIonContentElement | null>(null);

    return (
        <Route
            {...rest}
            component={undefined}
            children={undefined}
            render={(originalProps) => {
				const componentProps : AppComponentProps = {
					...originalProps,
					contentRef : contentRef.current,
				}
                return (<>
                    <IonPage>
                        <IonContent ref={contentRef}>
                        	<IonGrid>
	                            <IonRow>
	                                <IonCol
	                                    size="12"
	                                    className="flex justify-center px-4"
	                                >
                                        {/*justify-center*/}

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
                </>)
			}}
        />
    );
};

export default AppRoute
