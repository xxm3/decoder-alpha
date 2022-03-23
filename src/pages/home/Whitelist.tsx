import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { instance } from '../../axios';
import { environment } from '../../environments/environment';
import { IonIcon, useIonToast } from "@ionic/react";
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import Help from '../../components/Help';

const Whitelist = () => {

    const [present] = useIonToast();

    // Convert camelCase string to Title Case (e.g performedSearch -> Performed Search)
    const convertWordCase = (word: string): string => {
        const replaced = word.replace(/([A-Z])/g, " $1");
        return replaced.charAt(0).toUpperCase() + replaced.slice(1);
    }

    /**
     * Functions
     */
    const getUserClickedData = async () => {
        try {
            const { data } = await instance.get(`${environment.backendApi}/getUserClickedData`, {
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

    const userWhitelistDataQuery = useQuery(['whitelistData'], getUserClickedData, {
        select: (data: any) => {
            // Error handling
            if (data?.error && data.message) {
                throw new Error(String(data.message));
            }

            // types REPEATED on user_whitelist.js and Whitelist.tsx
            const steps = [
                ['performedSearch', '/'],
                ['viewedTodaysMints', 'schedule'],
                ['viewedFoxTokenPage', 'foxtoken'],
                ['viewedMyToken', 'foxtoken'],
                ['viewedMintStats', 'mintstats'],
                ['didStackedSearch', 'stackedsearch'],
            ];

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
        refetchOnWindowFocus: true,
        retry: false
    }) as any;

    const getStepHelp = (type: any): string => {
        switch (type) {
            case 'performedSearch':
                return 'Do a search from the header of the site (which returns results from all the discords/twitters we monitor)';
            case 'viewedTodaysMints':
                return 'View the "Today\'s Mints page" (which returns a schedule of the day\'s mints)';
            case 'viewedFoxTokenPage':
                return 'View the "Fox WL Token" page (which shows a table of whitelist tokens you can buy/sell)';
            case 'viewedMyToken':
                return 'On the "Fox WL Token" page, click the "View My Tokens" button (which is on the top right of the table) to filter the table. Note your wallet must be connected, or you can click the "Add Multiple Wallets" button to manually add 1-3 wallets';
            case 'viewedMintStats':
                return 'View the "Mint Stats" page (which shows statistics on the mints we automatically parsed from discord)';
            case 'didStackedSearch':
                return 'Perform a search on the "Stacked Line Search" page (which compares multiple words against each other)';
        }
        return '';
    }

    /**
     * Use Effects
     */

    // @ts-ignore
    return (
        <div >
            {userWhitelistDataQuery?.isFetching ?
                <div className="flex justify-center items-center">
                    {/*<Loader/>*/}
                    {/*Loading . . .*/}
                </div>
                :
                <>

                    {/* TODO: google docs whitelist (for twitter) ... with invite bot */}

                    {/*TODO: need a 830pm cronjob on old PC ... to spit to daily mints.. that @ me and vahag (told him)...*/}
                    {/*// TODO-mike: need test daily mint hourly... for a day*/}

                    {/*// TODO: join dead kings disc ... plus mirror foxn(or maybe nm... mirror turtle) */}

                    {/*
                        TODO: whitelist optimization
                        user clicks view my token... need alert pop up or something...
                        add mult wallets -> add manual wallet(s)
                        debug why taking so long....
                         implement ??? or implmenet "hey  you did everythign but not whitelist.. here's how?" ... or implement "gratz you just got it!"
                    */}
                    {/*-{userWhitelistDataQuery?.data}-*/}
                    {/*hidden={userWhitelistDataQuery?.data?.didAllSiteFunctions}*/}
                    <div className="secondary-bg-forced m-1 p-4 rounded-xl">
                        <div className={`font-bold pb-1`}>"used-the-site" role progress</div>
                        <div>Use the below features to be granted the "used-the-site" role in Discord, which is required to get/keep whitelist. See <b>#whitelist-faq</b> in Discord for more details</div>
                        <div>
                            <div style={{ listStyle: '' }}>
                                {
                                    userWhitelistDataQuery?.data?.map((step: any) => (
                                        <div key={step.step} className="ml-0 mt-2">
                                            <IonIcon className="text-green-500" hidden={step.value === false} icon={checkmarkCircleOutline} />
                                            <IonIcon className="text-red-500" hidden={step.value === true} icon={closeCircleOutline} />

                                            <Link hidden={step.link === '/'} className='underline ml-1' to={step.link}>{step.label}</Link>
                                            <span hidden={step.link !== '/'} className='ml-1'>{step.label}</span>
                                            <span className="ml-1">
                                                <Help description={getStepHelp(step.step)} />
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </>}
        </div>
    )
}

export default Whitelist;
