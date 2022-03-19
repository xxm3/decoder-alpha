import React, {useState} from 'react';
import './Home.css';
import moment from "moment";
import {AppComponentProps} from '../../components/Route';
import SearchedWords from './SearchedWords';
import FfNamed from "./FfNamed";

const Home: React.FC<AppComponentProps> = ({contentRef}) => {

    /**
     * States & Variables
     */

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

                            {/*<div className="secondary-bg-forced m-3 relative p-4 rounded-xl">*/}
            {/*<div className="secondary-bg-forced m-1 p-4 rounded-xl">*/}
            {/*    <p className="text-medium text-white font-medium">*/}
            {/*        <b>*/}
            {/*            Welcome to the new SOL Decoder! New info. will be displayed on the home page here in the coming week(s), such as:*/}
            {/*            <br/>- New WL Tokens that were added (both officially by Fox Token, and by users)*/}
            {/*            <br/>- New mints coming out in the next few hours*/}
            {/*            <br/>- The latest 3 Mint alerts, and top Mint alerts we gave this week, and this month*/}
            {/*            <br/>- New & Trending words people put into Discord (ie. new & trending NFTs)*/}
            {/*            <br/>- Recent community searches, and other things as we develop them!*/}
            {/*        </b>*/}
            {/*    </p>*/}
                                {/*<span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">*/}
                                {/*    :)*/}
                                {/*</span>*/}
            {/*</div>*/}


            {/* Recent Community Searches */}
            <div hidden={window.location.hostname !== 'localhost'}>
                <SearchedWords/>
            </div>

            {/*Recent FF Named Stuff*/}
            <FfNamed/>

            {/* if need to tell the user of errors */}

            {/*<div className="m-3 relative bg-red-100 p-4 rounded-xl">*/}
            {/*    <p className="text-lg text-red-700 font-medium">*/}
            {/*        <b>Our Discord ingestion bots decided to take a break from Thurs @ 10:00pm est until Friday @ 9:00am est. They are back up and running now.</b>*/}
            {/*    </p>*/}
            {/*    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">*/}
            {/*        !*/}
            {/*    </span>*/}
            {/*</div>*/}


        </>
    );
};

export default Home;
