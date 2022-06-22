import React from 'react';
import { useQuery } from 'react-query';
import { instance } from '../../axios';
import WhitelistCard from '../../components/WhitelistCard';
import { IWhitelist } from '../../types/IWhitelist';
import Loader from '../../components/Loader';
import TargetServerCard from '../../components/TargetServerCard';

function WhitelistMarketplace() {
    const { data: whitelists = [] } = useQuery(
        ['whitelistPartnerships'],
        async () => {
            const { data: whitelists } = await instance.get<IWhitelist[]>(
                '/whitelistPartnerships/me'
            );
            return whitelists;
        }
    );
    return (
        <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 md:gap-6 gap-4 p-10">

            <div hidden={whitelists.length > 0}>
                <Loader />
            </div>

            {whitelists.map((whitelist) => (
                <WhitelistCard {...whitelist} key={whitelist.id}/>
            ))}
            {/* {whitelists.map((whitelist) => (
                <TargetServerCard {...whitelist} key={whitelist.id}/>
            ))} */}

        </div>
    );
}

export default WhitelistMarketplace;
