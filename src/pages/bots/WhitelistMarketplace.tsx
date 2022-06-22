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
