import React, {useState} from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { IonGrid, IonRow, IonCol} from '@ionic/react';
import './ManageServer.scss';
import { useHistory, useParams } from 'react-router';
import Loader from '../../components/Loader';
import './SeamlessDetail.scss';
import { useQuery } from 'react-query';
import BotServerCard from './components/BotServerCard';

/**
 * The page they see when they click "Initiate Seamless"
 *
 * This lists all of the discords we have. User has to click into one to proceed
 */

const SeamlessDetail: React.FC<AppComponentProps> = () => {
    let history = useHistory();
    const { serverId } = useParams<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverList, setServerList] = useState<any>([]);
    const [selectMultiple, setSelectMultiple] = useState<boolean>(false)

    // this loads up all the discords etc
    const { data: servers = [] } = useQuery<any>(  ['allServers'],
        async () => {
            setIsLoading(true)
            const { data: { guilds },  } = await instance.get('/getAllGuildsData');
            let tmpServerArr = []
            setIsLoading(false)
            for(let i=0; i<guilds.length;i++){
                if(guilds[i].id !== serverId ){
                    tmpServerArr.push(guilds[i])
                }
            }
            setServerList(tmpServerArr);
            return guilds;
        }
    );

    return (
        <>
            <IonGrid>
                <IonRow>
                    <IonCol size="12">
                        <div className='flex flex-row justify-between items-center'>
                            <div className='w-4/5'>
                                <h2 className="ion-no-margin font-bold text-xl"> Seamless - select a DAO</h2>
                                <p className='ion-no-margin'>
                                    A new way to Request a collaboration with one of our partnered servers - select the server you wish to collaborate with in list below, and fill out the collaboration form on the next page.
                                    <br/>
                                    Please make sure that you invited the correct SOL Decoder Bot to your server! You must use the SECOND link when on the <a href="https://soldecoder.app/manageserver" className="underline cursor-pointer">Select a Server</a> page
                                </p>
                            </div>
                            {/* <div className={`seamless-tab-btn-active ${selectMultiple ? 'w-10' : 'w-40'} h-10`} onClick={()=> setSelectMultiple((n)=>!n)}>
                                {selectMultiple ? 'X' : 'Select Multiple'}
                            </div> */}
                        </div>
                    </IonCol>

                    <IonCol ize-xl="12" size-md="12" size-sm="12" size-xs="12"></IonCol>

                    {/*<IonCol ize-xl="12" size-md="12" size-sm="12" size-xs="12">*/}
                    {/*    <div className='font-bold text-xl'>Select a DAO to give whitelists to</div>*/}
                    {/*</IonCol>*/}

                        <>
                            {isLoading ? <Loader/> :
                            <>
                                {serverList && serverList.map((server: any,index:number)=>{
                                    return(
                                        <IonCol size-xl="4" size-md="6" size-sm="6" size-xs="12" key={index} >
                                            <BotServerCard serverData={server} />
                                        </IonCol>
                                    )
                                })}
                            </>}
                        </>
                </IonRow>
            </IonGrid>
        </>
    );
};
// @ts-ignore
export default SeamlessDetail;
