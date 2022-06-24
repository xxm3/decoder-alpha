import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { instance } from '../../axios';
import WhitelistCard from '../../components/WhitelistCard';
import { IWhitelist } from '../../types/IWhitelist';
import Loader from '../../components/Loader';
import {IonLabel} from '@ionic/react';
import './SeamlessDetail.scss';

function WhitelistMarketplace() {

    const [isLoading, setIsLoading] = React.useState(true)
    const [showLive, setShowLive] = useState<boolean>(true);
    const[liveWhiteList,setLiveWhiteList] = useState<IWhitelist[]>([])
    const[expireWhiteList,setExpireWhiteList] = useState<IWhitelist[]>([])

    const { data: whitelists = []  } = useQuery( ['whitelistPartnerships'],
        async () => {
            try {
                setIsLoading(true)
                const { data: whitelists } = await instance.get<IWhitelist[]>( '/getWhitelistPartnerships/me' );
                let whiteListExpire:any = []
                let whiteListLive:any = []
                for(let i = 0; i<whitelists.length; i++){
                    if(whitelists[i].isExpired){
                        whiteListExpire.push(whitelists[i])
                    }else{
                        whiteListLive.push(whitelists[i])
                    }
                }
                setLiveWhiteList(whiteListLive)
                setExpireWhiteList(whiteListExpire)

                return  whitelists;
            } catch (error) {
                console.error(error)
            }
            finally {
                setIsLoading(false)
            }

        }
    );

    return (

        <>

            <div className="flex flex-row justify-center w-full mt-9">
                <div className="server-module-bg p-4 px-6 w-full">
                    <div className='w-full  items-center  mb-3'>
                        <div className='text-xl font-semibold mb-3'>Welcome to Seamless!</div>

                        This is an early look at Seamless - SOL Decoder's next joint venture with Communi3. We estimate it is only 10% complete - so plenty upgrades coming.
                        <ul>
                            <li>- You will have to copy/paste to join the new mint Discord manually - soon we'll have a link to help with this</li>
                            <li>- You will have to see which DAO the whitelist is for - soon we'll have filters to help</li>
                            <li>- Also coming soon is Twitter integration to make sure you're following, and built in giveaways to have more people join</li>
                        </ul>
                    </div>
                </div>
            </div>

            {whitelists && whitelists.length > 0 ?
                <div>
                    <div className=' text-xl flex justify-center mt-5'>
                        <div className={`${showLive ? 'seamless-tab-btn-active' : 'seamless-tab-btn-deactive ' } w-32 h-10 `} onClick={()=>setShowLive(true)}><p>Live({liveWhiteList?.length})</p></div>
                        <div className={`${showLive ? 'seamless-tab-btn-deactive ' : 'seamless-tab-btn-active  '} ml-2 w-32 h-10`}onClick={()=>setShowLive(false)}><p>Expired ({expireWhiteList?.length})</p></div>
                    </div>
                    <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 md:gap-6 gap-4 p-10">
                        {showLive ? liveWhiteList && liveWhiteList.length > 0 ? liveWhiteList.map((whitelist:any) => (
                                <WhitelistCard {...whitelist} key={Math.random()} showLive={showLive} />
                            )) : <div className='text-xl'> There is no data available</div> :
                            expireWhiteList && expireWhiteList.length > 0 ? expireWhiteList.map((whitelist:any) => (
                                <WhitelistCard {...whitelist} key={Math.random()} showLive={showLive} />
                            )) :<div className='text-xl'> There is no data available</div>
                        }
                    </div>
                    <div className={(whitelists?.length < 1 && !isLoading) ? "flex items-center justify-between w-full" : 'flex items-center justify-end w-full'}>
                        {whitelists?.length < 1 && !isLoading && <div className='flex  w-full justify-center align-text-bottom ml-2 mr-2'>
                            <IonLabel className='text-red-500 text-2xl w-full text-center'>No active whitelists are open. Please check back later!</IonLabel>
                        </div>}
                    </div>


{/*=======*/}
{/*        <div>*/}

{/*            /!*<div className="text-xl font-medium text-ellipsis flex flex-row items-center">Seamless</div>*!/*/}

{/*            <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 md:gap-6 gap-4 p-10">*/}

{/*                <div hidden={!isLoading}>*/}
{/*                    <Loader />*/}
{/*>>>>>>> cb205f5fc4e265ac094544ca8da21cac5f861d43*/}


                </div>
            :   <>{ isLoading ?
                     <div className='flex justify-center'> <Loader /> </div>
                     :
                     <div className='text-center text-xl mt-6'>There is no Data available</div> }
                </> }
        </>
    );

}

export default WhitelistMarketplace;
