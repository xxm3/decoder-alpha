import React from 'react';
import { useQuery } from 'react-query';
import { instance } from '../../axios';
import WhitelistCard from '../../components/WhitelistCard';
import { IWhitelist } from '../../types/IWhitelist';

function WhitelistMarketplace() {
    const { data: whitelists = [] } = useQuery(
        ['whitelistPartnerships'],
        async () => {
            const { data: whitelists } = await instance.get<IWhitelist[]>(
                '/whitelistPartnerships/all'
            );
            return whitelists;
        }
    );
    return (
        <div className="grid justify-center 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 md:gap-6 gap-4 p-10">
            {whitelists.map((whitelist) => (
                <WhitelistCard {...whitelist} key={whitelist.id}/>
            ))}
        </div>
    );
}

export default WhitelistMarketplace;
