import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {IonCard} from "@ionic/react";

const FfNamed = () => {

    /**
     * Functions
     */
    const getFfNamed = async () => {
        try {
            const {data} = await instance.get(environment.backendApi + '/getFfNames', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            return data;
        } catch (e) {

            console.error('try/catch in FfNamed.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            if (error && error.response) {
                throw new Error(String(error.response.data.body));
            } else {
                throw new Error('Unable to connect. Please try again later');
            }
        }
    }

    const ffNamedQuery = useQuery(['ffNamed'], getFfNamed, {
        select: (data: any) => {

            // Error handling
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

    /**
     *
     */
    return (
        <div className='bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4'>
            {ffNamedQuery?.isFetching ?
                <div className="flex justify-center items-center">
                    <Loader/>
                </div>
                :
                <>
                    <div className={`font-bold pb-1`}>New Fox WL Token Market Names</div>
                    <div>
                        <ul style={{listStyle: 'disc'}}>
                            {
                                ffNamedQuery?.data?.data?.map((obj: any) => (
                                    <li key={obj.createdAt} className="ml-3">
                                        {/*<Link to={'search/' + obj.msg} className="underline">*/}
                                            {obj.msg}
                                            &nbsp; ({moment(obj.createdAt).fromNow()})
                                        {/*</Link>*/}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </>}
        </div>
    )
}

export default FfNamed;
