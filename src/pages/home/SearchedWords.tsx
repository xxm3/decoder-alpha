import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {IonCard, useIonToast} from "@ionic/react";
import {useHistory} from "react-router";

const SearchedWords = () => {

    const [present, dismiss] = useIonToast();
    const history = useHistory();

    /**
     * Functions
     */
    const getSearchedWords = async () => {
        try {
            const {data} = await instance.get(environment.backendApi + '/getSearchedWords', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            return data;
        } catch (e) {
            console.error('try/catch in Search.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            let msg = '';
            if (error && error.response) {
                msg = String(error.response.data.body);
            } else {
                msg = 'Unable to connect. Please try again later';
            }

            present({
                message: msg,
                color: 'danger',
                duration: 5000
            });
            if(msg.includes('logging in again')){
                history.push("/login");
            }

            // throw new Error(msg);
        }
    }

    const searchWordsQuery = useQuery(['searchWords'], getSearchedWords, {
        select: (data: any) => {

            // Error handling
            if (data?.error && data.message) {
                throw new Error(String(data.message));
            }
            return {
                ...data,
            }
        },
        refetchOnWindowFocus: true,
        retry: false
    })

    /**
     * Use Effects
     */

    return (
        <div className='bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4'>
            {searchWordsQuery?.isFetching ?
                <div className="flex justify-center items-center">
                    {/*<Loader/>*/}
                    Loading . . .
                </div>
                :
                <>
                    <div className={`font-bold pb-1`}>Recent Community Searches</div>
                    <div>
                        <ul style={{listStyle: 'disc'}}>
                            {
                                searchWordsQuery?.data?.data?.map((word: any) => (
                                    <li key={word.createdAt} className="ml-3">
                                        <Link to={'search/' + word.searchterm} className="underline">
                                            {word?.searchterm?.length > 20 ?
                                                word.searchterm.substring(0, 20) + "..." :
                                                word.searchterm}
                                            {/*&nbsp; ({moment(word.createdAt).fromNow()})*/}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </>}
        </div>
    )
}

export default SearchedWords
