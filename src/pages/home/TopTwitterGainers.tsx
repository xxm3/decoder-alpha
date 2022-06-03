import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import {Link, useLocation} from "react-router-dom";
import {IonCard, useIonToast} from "@ionic/react";
import {useHistory} from "react-router";

const TopTwitterGainers = () => {

    const [present, dismiss] = useIonToast();
    const history = useHistory();

    /**
     * Functions
     */
    const getSearchedWords = async () => {
        try {
            const {data} = await instance.get(environment.backendApi + '/getSearchedWords', { headers: { 'Content-Type': 'application/json', },})
            return data;
        } catch (e) {
            console.error('try/catch in Search.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            let msg = '';
            if (error?.response) {
                msg = String(error.response.data.body);
            } else {
                msg = 'Unable to connect. Please try again later';
            }
            present({
                message: msg,
                color: 'danger',
                duration: 5000,
                buttons: [{ text: 'X', handler: () => dismiss() }],
            });
            
        }
    }

    const topSearchWordsQuery = useQuery(['searchWords'], getSearchedWords, {
        select: (data: any) => {
            if (data?.error && data.message) {
                throw new Error(String(data.message));
            }
            return {
                ...data,
            }
        },
        retry: false
    })

    /**
     * Use Effects
     */

    return (
        <div className="secondary-bg-forced m-1 p-4 rounded-xl mt-6">
            {topSearchWordsQuery?.isFetching ?
                <div className="flex justify-center items-center">
                    Loading . . .
                </div>
                :
                <>
                    <div className={`font-bold pb-1 tracking-wider text-xl`}>Top Twitter Gainers - 24h</div>
                    <div className='flex flex-row justify-between'>
                        <div>Shrouded</div>
                        <div>+150k</div>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <div>Shrouded</div>
                        <div>+150k</div>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <div>Shrouded</div>
                        <div>+150k</div>
                    </div>
                </>}
        </div>
    )
}
export default TopTwitterGainers
