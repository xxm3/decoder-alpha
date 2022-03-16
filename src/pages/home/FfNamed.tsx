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

const FfNamed = () => {

    const [present, dismiss] = useIonToast();
    const history = useHistory();

    /**
     * Functions
     */
    const getFfNamed = async () => {
        try {
            const {data} = await instance.get(environment.backendApi + '/getFfNames', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            return data;
        } catch (e) {
            console.error('try/catch in FfNamed.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            let msg = '';

            if (error && error.response) {
                msg = String(error.response.data.body);
            } else {
                msg = 'Unable to connect. Please try again later';
            }

            present({
                message: msg,
                color: 'danger',
                duration: 5000
            });

            if(msg.includes('logging in again')){
                history.push("/login");
            }

            // throw new Error(msg);
        }
    }

    const ffNamedQuery = useQuery(['ffNamed'], getFfNamed, {
        select: (data: any) => {

            // Error handling
            if (data?.error && data.message) {
                throw new Error(String(data.message));
            }
            return {
                ...data,
            }
        },
        retry: false
    })

    /**
     * Use Effects
     */

    /**
     *
     */
    return (
        <div className='bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4'>
            {ffNamedQuery?.isFetching ?
                <div className="flex justify-center items-center">
                    <Loader/>
                </div>
                :
                <>
                    <div className={`font-bold pb-1`}>
                        New Fox WL Token Market Names
                        <Tooltip trigger="mouseenter" position="bottom"
                                 html={<IonItem lines="none" className='max-w-[320px] rounded help-tooltip whitespace-pre-line'>
Alerts currently done through Discord. Visit #self-roles and get the @fox-wl-alerts role. This gives pings when WL tokens get official names by the Famous Fox team, or when a user of SOL Decoder adds a custom name to one.<br/><br/>These are otherwise sent to the #analytics-etc channel in Discord
                                 </IonItem>}>
                                <IonIcon className="rounded-full help-tooltip p-1 text-lg" icon={notifications} />
                        </Tooltip>

                    </div>
                    <div>
                        <ul style={{listStyle: 'disc'}}>
                            {
                                ffNamedQuery?.data?.data?.map((obj: any) => (
                                    <li key={obj.createdAt} className="ml-3">
                                        {/*<Link to={'search/' + obj.msg} className="underline">*/}
                                            {obj.msg.replaceAll("**", "")}
                                            &nbsp; ({moment(obj.createdAt).fromNow()})
                                        {/*</Link>*/}
                                    </li>
                                ))
                            }
                                <li className="ml-3 underline">
                                    <a href="https://discord.com/channels/925207817923743794/951513272132182066" target="_blank">View More in Discord</a>
                                </li>
                        </ul>
                    </div>
                </>}
        </div>
    )
}

export default FfNamed;
