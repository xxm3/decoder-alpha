import { IonLabel } from '@ionic/react';
import { Grid, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import './MarketPlace.scss';

function MarketPlace() {
    const Card = () => {
        return (
            <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
                <div className="w-64 rounded-lg m-5 bg-sections-bslgray text-center mb-10">
                    {/* image */}
                    <div className="flex mx-auto mb-4">
                        <div className="image-box rounded-lg">
                            <img src="./assets/market-place/image1.webp" />
                        </div>
                    </div>
                    <div className="c-card-body px-2">
                        {/* text content */}
                        <h2>Stoned Ape Crew</h2>
                        <p className="pt-2 sub-text">
                            Lorem ipsum, dolor sit amet consectetur
                        </p>
                        <div className="seperator my-4"></div>
                        <div className="c-table">
                            <div className="flex items-center justify-between py-1">
                                <div className="c-badge"></div>
                                <div>Ends in 2h</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="text-gray-400">
                                    Ticket price
                                </div>
                                <div>$4.75</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="text-gray-400">
                                    WinnersTicket price
                                </div>
                                <div>16</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="text-gray-400">Price</div>
                                <div>0</div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="text-gray-400">
                                    Your Tickets
                                </div>
                                <div>3</div>
                            </div>
                        </div>

                        <div className="mb-3 mt-5 p-2 px-5 winner-btn w-fit rounded-md mx-auto">
                            View Winners
                        </div>
                    </div>
                </div>
            </Grid>
        );
    };
    return (
        <div className="market-wrapper">
            <div className="flex justify-center mt-6">
                <IonLabel className="text-4xl font-bold">Market Place</IonLabel>
            </div>
            <div className="flex justify-center mt-6 flex-row ">
                <button
                    className="w-32 mr-2 mt-2 sm:mt-5 text-base  px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn"
                >
                    Live
                </button>
                <button
                    className="w-32 ml-2 mt-2 sm:mt-5 text-base px-5 py-2 font-medium tracking-wide shadow-lg text-white capitalize hover:opacity-75 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out tab-btn"
                >
                    Close
                </button>
            </div>
            <div className="flex justify-center m-10">
                <div className="justify-center w-full flex flex-col">
                    <div className="flex  sm:flex-row justify-center flex-wrap">
                        <Grid
                            container
                            spacing={4}
                            className="flex justify-self-center"
                        >
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarketPlace;
