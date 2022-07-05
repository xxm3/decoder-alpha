import React, {useEffect, useState} from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { IonButton, IonGrid, IonRow, IonCol, IonCard,  IonText, IonCheckbox, useIonToast, IonInput,} from '@ionic/react';
import './ManageServer.scss';
import { useHistory, useParams } from 'react-router';
import Loader from '../../components/Loader';
import './SeamlessDetail.scss';
import { useQuery } from 'react-query';
import { setMultipleList } from '../../redux/slices/whitelistSlice';
import { useDispatch } from 'react-redux';
import BotServerCard from './components/BotServerCard';

/**
 * The page they see when they click "Initiate Seamless"
 *
 * This lists all of the discords we have. User has to click into one to proceed
 */

export interface selcetServer{
    id: string
    name: string
     discordGuildId:string
    }

const SeamlessDetail: React.FC<AppComponentProps> = () => {
    let history = useHistory();
    const dispatch = useDispatch()
    const [present] = useIonToast();
    const { serverId } = useParams<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverList, setServerList] = useState<any>([]);
    const [multipleflag, setmultipleflag] = useState<boolean>(false)
    const [selectMultipleWhiteList, setSelectMultipleWhiteList] = useState<selcetServer[]>([])
    const [searchValue, setSearchValue] = useState<any>('');
    const [twitterSort, setTwitterSort] = useState<String>('');
    const [discordSort, setDiscordSort] = useState<String>('');
    const [sortCard,setSortCard] = useState<String>('')


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
      if(twitterSort === 'twitter Up'){
        const twittweAscending = [...servers].sort((a, b) => b.twitter_followers - a.twitter_followers);
        console.log(twittweAscending);
        setServerList(twittweAscending)
      }else if(twitterSort === 'twitter Down'){
        const twittweAscending = [...servers].sort((a, b) => a.twitter_followers - b.twitter_followers);
        console.log(twittweAscending);
        setServerList(twittweAscending)

      }
    }, [twitterSort,servers])
        // sorting by discord
    useEffect(() => {
      if(discordSort === 'discord Up'){
        const twittweAscending = [...servers].sort((a, b) => b.discord_members - a.discord_members);
        console.log(twittweAscending);
        setServerList(twittweAscending)
      }else if(discordSort === 'discord Down'){
        const twittweAscending = [...servers].sort((a, b) => a.discord_members - b.discord_members);
        console.log(twittweAscending);
        setServerList(twittweAscending)

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
                            {!multipleflag &&  
                            <div className={`seamless-tab-btn-active w-40 h-10`} onClick={()=> setmultipleflag((n)=>!n)}>
                            Select Multiple
                            </div>
                            }
                            {/*  */}
                            {multipleflag &&  
                            <div className='flex justify-between ml-2'>
                            <div className={`seamless-tab-btn-active w-32 h-10 mr-2`} onClick={()=> {
                                setSelectMultipleWhiteList([])
                                setmultipleflag((n)=>!n)
                            }}>
                            cancel
                            </div>
                            <div className={`seamless-tab-btn-active w-32 h-10`} onClick={()=> {
                                if(selectMultipleWhiteList.length===0){
                                    present({
                                        message: 'Please Select Atleast 1 server',
                                        color: 'danger',
                                        duration: 10000,
                                    });
                                    return
                                }
                                dispatch(setMultipleList(selectMultipleWhiteList))
                                history.push({pathname:`/add_multiple_white_list`,state:serverId})
                                setSelectMultipleWhiteList([])
                                setmultipleflag((n)=>!n)
                                // history.push('/add_multiple_white_list')

                                // setmultipleflag((n)=>!n)
                            }}>
                            Submit
                            </div>
                            </div>
                            }
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
                                    let selectFlag = selectMultipleWhiteList.find(data=>data.id===server.id)
                                    server.selectFlag = selectFlag?true:false;
                                    return(
                                        <IonCol size-xl="4" size-md="6" size-sm="6" size-xs="12" key={server.id} >
                                            <BotServerCard serverData={server} multipleflag={multipleflag} setSelectMultipleWhiteList={setSelectMultipleWhiteList} selectMultipleWhiteList={selectMultipleWhiteList} classes={`h-full ${server.selectFlag&&'activeCardWrapper'}` } />
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
