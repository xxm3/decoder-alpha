import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { instance } from '../../axios';
import WhitelistCard from '../../components/WhitelistCard';
import { IWhitelist } from '../../types/IWhitelist';
import Loader from '../../components/Loader';
import {IonCol, IonGrid, IonLabel, IonRow} from '@ionic/react';
import './SeamlessDetail.scss';

/**
 * The page they see when they are on /seamless, and browsing for whitelists etc..
 */

function WhitelistMarketplace() {

    const [isLoading, setIsLoading] = useState(true);
    const [isTabButton, setIsTabButton] = useState<String>('myDoa');
    const [liveWhiteList,setLiveWhiteList] = useState<IWhitelist[]>([]);
    const [expireWhiteList,setExpireWhiteList] = useState<IWhitelist[]>([]);
    const [myDoaWhiteList,setMyDoaWhiteList] = useState<IWhitelist[]>([]);
    const [myClaimWhiteList,setMyClaimWhiteList] = useState<IWhitelist[]>([]);

    const uid = localStorage.getItem('uid')
    let userId:any
    useEffect(() => {
        if(uid){
            userId = parseInt(uid)
        }
    }, [])
    const server = localStorage.getItem('servers')
    let serverArray = server &&  JSON.parse(server)

    // get all your WL crap
    const { data: whitelists = []  } = useQuery( ['whitelistPartnerships'],

        async () => {


                try {
                    setIsLoading(true)
                    const { data: whitelists } = await instance.post( '/getWhitelistPartnerships/me',{servers: serverArray});
                    let whiteListExpire:any = []
                    let whiteListLive:any = []
                    let whiteListMyDoa:any = []
                    let whiteListMyClaim:any = []
                    for(let i = 0; i < whitelists.length; i++){

                        if(whitelists[i].isExpired || !whitelists[i].active){
                            whiteListExpire.push(whitelists[i])
                        }else if(whitelists[i].myLiveDAO === true){
                            whiteListMyDoa.push(whitelists[i])
                        }else if(!whitelists[i].isExpired){
                            whiteListLive.push(whitelists[i])
                        } else if( whitelists[i].claims.length > 0){
                            if(whitelists[i].claims[0].user){
                                if(whitelists[i].claims[0].user.discordId === userId){
                                    whiteListMyClaim.push(whitelists[i])
                                }
                            }
                        }
                    }
                    setLiveWhiteList(whiteListLive);
                    setExpireWhiteList(whiteListExpire);
                    setMyDoaWhiteList(whiteListMyDoa)
                    setMyClaimWhiteList(whiteListMyClaim)

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
                            <li>- You will have to see which DAO the whitelist is for - soon we'll have filters to help. <span className="text-red-500">This is not only for SOL Decoder holders - other DAOs use this, so look at the "Must be member in" and "Required Role" section</span></li>
                            <li>- Also coming soon is Twitter integration to make sure you're following, and built in giveaways to have more people join</li>
                            <li>- Want to learn more? <a className="underline cursor-pointer font-bold" href="https://medium.com/@sol-decoder/sol-decoder-presents-seamless-32251a4deb43" target="_blank">
                                Read our Medium article here</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* if whitelists avail. */}
            {whitelists && whitelists.length > 0 ?
                <div>

                    {/* tabs on the top (Live vs Expired) */}
                    <div className=' text-xl flex justify-center mt-5'>
                        <div className={`${isTabButton === 'myDoa' ? 'seamless-tab-btn-active' : 'seamless-tab-btn-deactive ' } w-50 h-10 `} onClick={()=>setIsTabButton('myDoa')}>
                            {/* <p>Live - My DAOs ({myDoaWhiteList?.length})</p> */}
                            <div className="text-sm md:text-base p-2 md:px-4 w-full">Live - My DAOs</div>
                            <div className=" bg-black/[.4] py-2 px-4 ">{myDoaWhiteList?.length}</div>

                        </div>
                        <div className={`${isTabButton === 'live' ? 'seamless-tab-btn-active' : 'seamless-tab-btn-deactive' } ml-2 w-36 h-10 `} onClick={()=>setIsTabButton('live')}>
                            {/* <p>Live ({liveWhiteList?.length})</p> */}
                            <div className="text-sm md:text-base p-2 md:px-4 w-full">Live - All</div>
                            <div className=" bg-black/[.4] py-2 px-4 ">{liveWhiteList?.length}</div>
                        </div>
                        <div className={`${isTabButton === 'expire' ? 'seamless-tab-btn-active' : 'seamless-tab-btn-deactive'} ml-2 w-32 h-10`}onClick={()=>setIsTabButton('expire')}>
                            {/* <p>Expired ({expireWhiteList?.length})</p> */}
                            <div className="text-sm md:text-base p-2 md:px-4 w-full">Expired</div>
                            <div className=" bg-black/[.4] py-2 px-4 ">{expireWhiteList?.length}</div>
                        </div>
                    </div>

                    {/* expire */}
                    {isTabButton === 'expire' ||  isTabButton === 'myClaim' ?
                        <div className='flex justify-center mt-4'>
                            <div className={`${isTabButton === 'myClaim' ? 'seamless-tab-btn-active' : 'seamless-tab-btn-deactive'} ml-2 w-60 h-10 text-xl `} onClick={()=>setIsTabButton('myClaim')}>
                                {/* <p>View my claim mints ({myClaimWhiteList?.length})</p> */}
                                <div className="text-sm md:text-base p-2 md:px-4 w-full">View My Claim Mints</div>
                            <div className=" bg-black/[.4] py-2 px-4 ">{myClaimWhiteList?.length}</div>
                            </div>
                        </div> :  ''

                    }

                    {/* my Doa live */}
                    {isTabButton === 'myDoa' &&
                        <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3  sm:grid-cols-2 gap-6 p-8">
                            {
                                myDoaWhiteList.length > 0 ? myDoaWhiteList.map((whitelist:any) => {
                                    return(<WhitelistCard {...whitelist}  key={Math.random()}/>)
                                }) : <div className='text-xl'> There are no whitelists available</div>
                            }
                        </div>
                    }

                    {/* live */}
                    {isTabButton === 'live' &&
                        <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3  sm:grid-cols-2 gap-6 p-8">
                            {
                                liveWhiteList.length > 0 ? liveWhiteList.map((whitelist:any) => {
                                   return(<WhitelistCard {...whitelist}  key={Math.random()}/>)
                                }) : <div className='text-xl'> There are no whitelists available</div>
                            }
                        </div>
                    }

                    {/* expire */}
                    {isTabButton === 'expire' &&
                        <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3  sm:grid-cols-2 gap-6 p-8">
                            {
                                expireWhiteList.length > 0 ? expireWhiteList.map((whitelist:any) => {
                                 return(<WhitelistCard {...whitelist}  key={Math.random()}/>)
                                }) : <div className='text-xl'> There are no whitelists available</div>
                            }
                        </div>
                    }

                    {/* myClaim */}
                    {isTabButton === 'myClaim' &&
                        <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3  sm:grid-cols-2 gap-6 p-8">
                            {
                                myClaimWhiteList.length > 0 ?  myClaimWhiteList.map((whitelist:any) => {
                                 return(<WhitelistCard {...whitelist}  key={Math.random()}/>)
                                }) : <div className='text-xl'> There are no whitelists available</div>
                            }
                        </div>
                    }


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
