import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {IonButton, IonCard, IonIcon, IonItem, useIonToast} from "@ionic/react";
import {alertOutline, helpOutline, notifications, notificationsOutline, wallet} from "ionicons/icons";
import {Tooltip} from "react-tippy";
import {useHistory} from "react-router";
import './Home.css'
import { useEffect, useState } from 'react';

const RecentAlerts = (props:any) => {

    const [alerts, setAlerts] = useState <any>([]);

    const history = useHistory();

    /**
     * Functions
     */

     
    /**
     * Use Effects
     */
     useEffect(() => {
        instance
            .get(`${environment.backendApi}/recentAlerts`)
            .then((res: any) => setAlerts(res.data.data))
            .catch() // ?;
    }, []);

    /**
     *
     */
    return (
        <>
        {alerts?
                <>
                <div className='secondary-bg-forced m-1 p-4 rounded-xl'>
                    <div className={`font-bold pb-1`}>
                        Recent Alerts
                        <Tooltip
                                trigger="mouseenter" position="bottom"
                                 html={<IonItem lines="none" className='max-w-[320px] rounded help-tooltip whitespace-pre-line'>
                                     Alerts on new names
                                 </IonItem>}>
                                <IonIcon
                                    onClick={() => history.push('/alerts#fnn')}
                                    className="rounded-full help-tooltip p-1 text-lg cursor-pointer" icon={notifications} />
                        </Tooltip>

                    </div>
                    <div>
                        <ul style={{listStyle: 'disc'}}>
                            {
                               alerts && alerts.map((obj: any, index:number) => (

                                    <li key={index} className="ml-3 flex justify-between p-2 flex-col">
                                        <div className='w-full text-left'>
                                            {obj.replaceAll("**", "")}
                                        </div>
                                        <div className='h-px bg-slate-700 w-full mt-2'/>
                                    </li>
                                    
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </>
                :
                <div className="flex justify-center items-center">
                {/*<Loader/>*/}
                {/*Loading. . .*/}
            </div>
               }
        </>
    )
}

export default RecentAlerts;
