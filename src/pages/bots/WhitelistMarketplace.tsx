import React from 'react';
import { useQuery } from 'react-query';
import { instance } from '../../axios';
import WhitelistCard from '../../components/WhitelistCard';
import { IWhitelist } from '../../types/IWhitelist';
import Loader from '../../components/Loader';
import {IonLabel} from '@ionic/react';

function WhitelistMarketplace() {

    const [isLoading, setisLoading] = React.useState(true)

    const { data: whitelists = [] } = useQuery(
        ['whitelistPartnerships'],
        async () => {

            try {
                const { data: whitelists } = await instance.get<IWhitelist[]>(
                    '/whitelistPartnerships/me'
                );
                return whitelists;
            } catch (error) {
                console.error(error)
            }
            finally {
                setisLoading(false)
            }

        }
    );

    return (
        <div>

            {/*<div className="text-xl font-medium text-ellipsis flex flex-row items-center">Seamless</div>*/}

            <div className="flex flex-row justify-center w-full mt-9">
                <div className="server-module-bg p-4 px-6 w-full">
                    <div className='w-full  items-center  mb-3'>
                        <div className='text-xl font-semibold mb-3'>Welcome to Seamless!</div>

                        This is an early look at Seamless - SOL Decoder's next joint venture with Communi3. We estimate it is only 10% complete - so plenty upgrades coming.
                        <ul>
                            <li>- You will have to copy/paste to join the new mint Discord manually - soon we'll have a link to help with this</li>
                            <li>- You will have to see which DAO the whitelist is for - soon we'll have filters to help. <span className="text-red-500">This is not only for SOL Decoder holders - other DAOs use this, so look at the "Required membership" and "Required Role" section</span></li>
                            <li>- Also coming soon is Twitter integration to make sure you're following, and built in giveaways to have more people join</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 md:gap-6 gap-4 p-10">

                <div hidden={!isLoading}>
                    <Loader />
                </div>

                {whitelists.map((whitelist) => (
                    <WhitelistCard {...whitelist} key={Math.random()} />
                ))}

            </div>
            <div className={(whitelists?.length < 1 && !isLoading) ? "flex items-center justify-between w-full" : 'flex items-center justify-end w-full'}>
                {whitelists?.length < 1 && !isLoading && <div className='flex  w-full justify-center align-text-bottom ml-2 mr-2'>
                    <IonLabel className='text-red-500 text-2xl w-full text-center'>No active whitelists are open. Please check back later!</IonLabel>
                </div>}
            </div>
        </div>
    );

}

export default WhitelistMarketplace;
