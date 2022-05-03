import React, {useEffect, useState} from 'react';
import './Home.css';
import moment from "moment";
import {AppComponentProps} from '../../components/Route';
import SearchedWords from './SearchedWords';
import FfNamed from "./FfNamed";
import RecentAlerts from './RecentAlerts';
import Whitelist from './Whitelist';
import {useLocation} from 'react-router-dom';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';

const Home: React.FC<AppComponentProps> = ({contentRef}) => {


    /**
     * States & Variables
     */
        // const [alerts, setAlerts] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    // const useQuery = () => new URLSearchParams(useLocation().search);
    // const query = useQuery();
    // const devMode = query.get('devMode');

    /**
     * Use Effects
     */
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true)
        }
    }, [window.innerWidth])

    // useEffect(() => {
    //     instance
    //         .get(`${environment.backendApi}/recentAlerts`)
    //         .then((res: any) => setAlerts(res.data))
    //         .catch() // ?;
    // }, []);
    /**
     * Functions
     */

    /**
     * Renders
     */

    return (
        <>
            {isMobile ?
                <>
                    {/*FOR MOBILE*/}
                    {/*<Whitelist/>*/}

                    <FfNamed/>

                    {/*TODO: FIX ME CMON */}
                    {/*<RecentAlerts/>*/}
                </> : <>

                    {/*FOR DESKTOP*/}
                    {/*<Whitelist />*/}

                    <div className='flex flex-row w-full'>
                        <div className='w-1/2 '>

                            {/*Recent FF Named Stuff*/}
                            <FfNamed/>

                        </div>
                        <div className='w-1/2'>

                            {/*TODO: FIX ME CMON */}

                            {/* recent alerts */}
                            {/*<RecentAlerts/>*/}

                        </div>
                    </div>

                </>
            }

            {/* for user to get used-the-site- role */}
            {/*<div hidden={!devMode}>*/}

            {/* Recent Community Searches */}
            {/*<div hidden={window.location.hostname !== 'localhost'}>*/}
            {/*    <SearchedWords/>*/}
            {/*</div>*/}


            {/* if need to tell the user of errors */}
            {/*<div className="m-3 relative bg-red-100 p-4 rounded-xl">*/}
            {/*    <p className="text-lg text-red-700 font-medium">*/}
            {/*        <b>Our Discord ingestion bots decided to take a break from Thurs @ 10:00pm est until Friday @ 9:00am est. They are back up and running now.</b>*/}
            {/*    </p>*/}
            {/*    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">*/}
            {/*        !*/}
            {/*    </span>*/}
            {/*</div>*/}


            {/*<div className="m-3 relative bg-red-100 p-4 rounded-xl">*/}
            {/*    <p className="text-lg text-red-700 font-medium">*/}
            {/*        <b>Our Discord bot to record your "used-the-site" role progress is currently on a coffee break. You may still follow all steps and you'll be automatically tagged later. Please don't ask us in chat "when will I get my role I did all steps?". It's down right now :)</b>*/}
            {/*    </p>*/}
            {/*    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">*/}
            {/*        !*/}
            {/*    </span>*/}
            {/*</div>*/}


        </>
    );
};

export default Home;
