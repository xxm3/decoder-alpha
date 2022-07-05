import React, {useEffect, useState} from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { IonGrid, IonRow, IonCol, IonInput} from '@ionic/react';
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
    const [searchValue, setSearchValue] = useState<any>('');
    const [twitterSort, setTwitterSort] = useState<String>('');
    const [discordSort, setDiscordSort] = useState<String>('');


    // this loads up all the discords etc
    const { data: servers = [] } = useQuery<any>(  ['allServers'],
        async () => {
            setIsLoading(true)
            const { data: { guilds },  } = await instance.get(`/getAllGuildsData?guildId=${serverId}`);
            let tmpServerArr = []
            setIsLoading(false)
            for(let i=0; i<guilds.length;i++){
                if(guilds[i].id !== serverId ){
                    tmpServerArr.push(guilds[i])
                }
            }
            // setServerList(tmpServerArr);
            return tmpServerArr;
            // return guilds;
        }
    );

        // searching
    useEffect(() => {
        if(searchValue && servers){
            const filtered = servers.filter((server:any) => Object.values(server).some(val => typeof val === "string" && val.toLowerCase().includes(searchValue.toLowerCase())));
            setServerList(filtered)
        }else{
                setServerList(servers)
        }
    }, [searchValue,servers])

    // sorting by twitter
    useEffect(() => {
      if(twitterSort){
        const twitterSorting = [...servers].sort((a, b) =>twitterSort === 'twitter Up'? b.twitter_followers - a.twitter_followers:a.twitter_followers - b.twitter_followers);
        setServerList(twitterSorting)
      }
    }, [twitterSort,servers])
    // sorting by discord
    useEffect(() => {
      if(discordSort){
        const discordSorting = [...servers].sort((a, b) =>discordSort === 'discord Up'? b.discord_members - a.discord_members:a.discord_members - b.discord_members);
        setServerList(discordSorting)
      }
    }, [discordSort,servers])



    return (
        <>
            <IonGrid>
                <IonRow>
                    <IonCol size="12">
                        <div className='flex flex-row justify-between items-center'>
                            <div className='w-4/5'>
                                <h2 className="ion-no-margin font-bold text-xl"> Seamless - select a DAO to give whitelists to</h2>
                                <p className='ion-no-margin'>
                                    Select the server you wish to collaborate with in list below, and fill out the collaboration form on the next page.
                                    <br/><br/>
                                    Please make sure that you invited the correct SOL Decoder Bot to your server! You must use the SECOND link when on the <a href="https://soldecoder.app/dao" className="underline cursor-pointer">Select a Server</a> page.
                                    <br/><br/>
                                    After inviting this bot, make sure to drag the "SOL Decoder" role higher than your whitelist role.
                                </p>
                            </div>
                            {/* <div className={`seamless-tab-btn-active ${selectMultiple ? 'w-10' : 'w-40'} h-10`} onClick={()=> setSelectMultiple((n)=>!n)}>
                                {selectMultiple ? 'X' : 'Select Multiple'}
                            </div> */}
                        </div>
                    </IonCol>

                    {/*TODO-ruchita: this doesn't seem to work? search dont work, sort by twiteter/disc no work */}

                <IonCol size="12" className='mt-4'>
                    <div className='flex flex-col'>
                        {/*<div className='text-xl'>Select a DAO to give whitelists to</div>*/}
                        <div className='flex flex-row w-1/2'>
                            <IonInput
                                value={searchValue}
                                className='w-1/5 border-2 mt-2'
                                onIonChange={(e) => { setSearchValue( e.detail.value) }}
                                type="text"
                                placeholder='Project Name'/>
                                <div className='flex-row flex items-center cursor-pointer' onClick={()=>{
                                    setDiscordSort('')
                                    if(twitterSort === ''){
                                        setTwitterSort('twitter Up')
                                    }else if(twitterSort === 'twitter Up'){
                                        setTwitterSort('twitter Down')
                                    }else{
                                        setTwitterSort('twitter Up')
                                    }
                                }}>
                                    <div className='flex flex-col mr-2 ml-4' >
                                        <button className={`${twitterSort === 'twitter Up' ? 'opacity-100':'opacity-30'}`}>▲</button>
                                        <button className={`${twitterSort === 'twitter Down' ? 'opacity-100':'opacity-30'}`}>▼</button>
                                    </div>
                                    <p>Twitter Followers</p>
                                </div>
                                <div className='flex-row flex items-center cursor-pointer' onClick={()=>{
                                    setTwitterSort('')
                                    if(discordSort === ''){
                                        setDiscordSort('discord Up')
                                    }else if(discordSort === 'discord Up'){
                                        setDiscordSort('discord Down')
                                    }else{
                                        setDiscordSort('discord Up')
                                    }
                                }}>
                                    <div className='flex flex-col mr-2 ml-4'>
                                        <button className={`${discordSort === 'discord Up' ? 'opacity-100':'opacity-30'}`}>▲</button>
                                        <button className={`${discordSort === 'discord Down' ? 'opacity-100':'opacity-30'}`}>▼</button>
                                    </div>
                                    <p>Discord Member</p>
                                </div>
                        </div>
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
