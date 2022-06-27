import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { instance } from '../../axios';
import WhitelistCard from '../../components/WhitelistCard';
import { IWhitelist } from '../../types/IWhitelist';
import Loader from '../../components/Loader';
import {IonCol, IonGrid, IonLabel, IonRow} from '@ionic/react';
import './SeamlessDetail.scss';
import { Grid } from '@material-ui/core';

/**
 * The page they see when they are on /seamless, and browsing for whitelists etc..
 */

function WhitelistMarketplace() {

    const [isLoading, setIsLoading] = React.useState(true);
    const [showLive, setShowLive] = useState<boolean>(true);
    const [liveWhiteList,setLiveWhiteList] = useState<IWhitelist[]>([]);
    const [expireWhiteList,setExpireWhiteList] = useState<IWhitelist[]>([]);

    // get all your WL crap
    const { data: whitelists = []  } = useQuery( ['whitelistPartnerships'],
        async () => {
            try {
                setIsLoading(true)
                const { data: whitelists } = await instance.get<IWhitelist[]>( '/getWhitelistPartnerships/me' );
                let whiteListExpire:any = []
                let whiteListLive:any = []
                for(let i = 0; i<whitelists.length; i++){
                    if(whitelists[i].isExpired || !whitelists[i].active){
                        whiteListExpire.push(whitelists[i])
                    }else{
                        whiteListLive.push(whitelists[i])
                    }
                }
                setLiveWhiteList(whiteListLive);
                setExpireWhiteList(whiteListExpire);

                return whitelists;
            } catch (error) {

            }
            finally {
                setIsLoading(false)
            }

        }
    );

    return (

        <>
            {/* introduction */}
            <div className="flex flex-row justify-center w-full mt-9">
                <div className="server-module-bg p-4 px-6 w-full">
                    <div className='w-full  items-center  mb-3'>
                        <div className='text-xl font-semibold mb-3'>Welcome to Seamless!</div>

                        This is an early look at Seamless - SOL Decoder's next joint venture with Communi3. We estimate it is only 10% complete - so plenty upgrades coming.
                        <ul>
                            <li>- You will have to see which DAO the whitelist is for - soon we'll have filters to help. <span className="text-red-500">This is not only for SOL Decoder holders - other DAOs use this, so look at the "Required membership" and "Required Role" section</span></li>
                            <li>- Also coming soon is Twitter integration to make sure you're following, and built in giveaways to have more people join</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* if whitelists avail. */}
            {whitelists && whitelists.length > 0 ?
                <div>

                    {/* tabs on the top (Live vs Expired) */}
                    <div className=' text-xl flex justify-center mt-5'>
                        <div className={`${showLive ? 'seamless-tab-btn-active' : 'seamless-tab-btn-deactive ' } w-32 h-10 `} onClick={()=>setShowLive(true)}>
                            <p>Live ({liveWhiteList?.length})</p>
                        </div>
                        <div className={`${showLive ? 'seamless-tab-btn-deactive ' : 'seamless-tab-btn-active  '} ml-2 w-32 h-10`}onClick={()=>setShowLive(false)}>
                            <p>Expired ({expireWhiteList?.length})</p>
                        </div>
                    </div>

                    <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3  sm:grid-cols-2 gap-6 p-8">
                        {
                            // live
                            showLive ? liveWhiteList && liveWhiteList.length > 0 ? liveWhiteList.map((whitelist:any) => (
                                <WhitelistCard
                                    {...whitelist}
                                    key={Math.random()}
                                    showLive={showLive}
                                />
                            )) : <div className='text-xl'> There are no whitelists available</div> :

                            // expired
                            expireWhiteList && expireWhiteList.length > 0 ? expireWhiteList.map((whitelist:any) => (
                                <WhitelistCard
                                    {...whitelist}
                                    key={Math.random()}
                                    showLive={showLive}
                                />
                            )) :<div className='text-xl'> There are no whitelists available</div>
                        }
                    </div>

                    {/* no whitelists */}
                    <div className={(whitelists?.length < 1 && !isLoading) ? "flex items-center justify-between w-full" : 'flex items-center justify-end w-full'}>
                        {whitelists?.length < 1 && !isLoading && <div className='flex  w-full justify-center align-text-bottom ml-2 mr-2'>
                            <IonLabel className='text-red-500 text-2xl w-full text-center'>No active whitelists are open. Please check back later!</IonLabel>
                        </div>}
                    </div>
                </div>

                // if loading
            :   <>{ isLoading ? <div className='flex justify-center'> <Loader /> </div>
                    // no whitelists
                     : <div className='text-center text-xl mt-6'>There are no whitelists available</div> }
                </> }
        </>
    );

}

export default WhitelistMarketplace;
