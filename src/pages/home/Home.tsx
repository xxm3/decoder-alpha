import React, {useState} from 'react';
import './Home.css';
import moment from "moment";
import {AppComponentProps} from '../../components/Route';
import SearchedWords from './SearchedWords';
import FfNamed from "./FfNamed";
import Whitelist from './Whitelist';
import {useLocation} from 'react-router-dom';

const Home: React.FC<AppComponentProps> = ({contentRef}) => {

    /**
     * States & Variables
     */
    // const useQuery = () => new URLSearchParams(useLocation().search);
    // const query = useQuery();
    // const devMode = query.get('devMode');

    /**
     * Use Effects
     */

    /**
     * Functions
     */

    /**
     * Renders
     */

    return (
        <>

            {/*Recent FF Named Stuff*/}
            <FfNamed />


            {/* for user to get used-the-site- role */}
            {/*<div hidden={!devMode}>*/}
                <Whitelist />
            {/*</div>*/}



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


            <div className="m-3 relative bg-red-100 p-4 rounded-xl">
                <p className="text-lg text-red-700 font-medium">
                    <b>Our Discord bot to record your "used-the-site" role progress is currently down. It will be fixed later today (Wed Mar 23rd). Plenty of time to get the role, so no rush!</b>
                </p>
                <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                    !
                </span>
            </div>


        </>
    );
};

export default Home;
