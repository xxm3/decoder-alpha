import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { instance } from '../../axios';
import { environment } from '../../environments/environment';
import { IonIcon, useIonToast } from "@ionic/react";
import { checkbox, square } from 'ionicons/icons';
import { Link } from 'react-router-dom';

const Whitelist = () => {

    const [present] = useIonToast();

    const convertWordCase = (word: string) => {
        const replaced = word.replace(/([A-Z])/g, " $1");
        return replaced.charAt(0).toUpperCase() + replaced.slice(1);
    }
    /**
     * Functions
     */
    const getUserWhitelistData = async () => {
        try {
            const { data } = await instance.get(`${environment.backendApi}/getUserWhitelistData`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return data;
        } catch (e) {
            console.error('try/catch in Whitelist.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };
            const msg = error?.response ? String(error.response.data.body) : 'Unable to connect. Please try again later';
            present({
                message: msg,
                color: 'danger',
                duration: 5000
            });
        }
    }

    const userWhitelistDataQuery = useQuery(['whitelistData'], getUserWhitelistData, {
        select: (data: any) => {
            // Error handling
            if (data?.error && data.message) {
                throw new Error(String(data.message));
            }
            // types REPEATED on user_whitelist.js and Whitelist.tsx
            const steps = [['performedSearch', '/'], ['viewedMyToken', 'foxtoken'], ['viewedMintStats', 'mintstats'], ['didStackedSearch', 'stackedsearch'], ['viewedTodaysMints', 'schedule'], ['viewedFoxTokenPage', 'foxtoken']];
            const results = steps.map(step => ({
                step: step[0],
                link: step[1],
                label: convertWordCase(step[0]),
                value: data.data[step[0]]
            }));
            return [
                ...results,
            ]
        },
        // refetchOnWindowFocus: true,
        retry: false
    }) as any;

    /**
     * Use Effects
     */

    return (
        // bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4
        <div className="secondary-bg-forced m-1 p-4 rounded-xl">
            {userWhitelistDataQuery?.isFetching ?
                <div className="flex justify-center items-center">
                    {/*<Loader/>*/}
                    Loading . . .
                </div>
                :
                <>
                    <div className={`font-bold pb-1`}>Whitelist Progress</div>
                    <div>Below you are able to view your progress towards your whitelist. Once you complete all the steps, you will be granted the
                        "used-the-site" role in the discord. </div>
                    <div>
                        <ul style={{ listStyle: 'disc' }}>
                            {
                                userWhitelistDataQuery?.data.map((step: any) => (
                                    <li key={step.step} className="ml-3 mt-2">
                                        <Link className="underline" to={step.link}>{step.label}</Link>: &nbsp; {<IonIcon icon={step.value ? checkbox : square} />}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </>}
        </div>
    )
}

export default Whitelist
