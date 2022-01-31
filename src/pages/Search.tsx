import Loader from '../components/Loader';
import React, { useRef } from 'react';
import Display from '../components/search/Display';
import { useState, useEffect, useContext} from 'react';
import { Message } from '../data/messages';
import {
    IonContent,
    IonPage,
    IonButton,
} from '@ionic/react';
import './Search.css';
import faker from 'faker';
import { MessageContext } from '../context/context';


import { environment } from "../environments/environment";
import { useParams } from 'react-router';


import Header from "../components/header/Header";
import { instance } from '../axios';

const Search: React.FC = () => {

    /**
     * States & Variables
     */
    // @ts-ignore
    const { messages, setMessages, setWord } = useContext(MessageContext);
    const [total, setTotal] = useState(0);
    const [width, setWidth] = useState(window.innerWidth);

    // @ts-ignore
    const { id } = useParams();
    const [searchText, setSearchText] = useState(id);

    const [isLoading, setIsLoading] = useState(false);
    const [foundResults, setFoundResults] = useState(false);
    const [error, setError] = useState("");

    const [walletAddress, setWalletAddress] = useState('');

    /**
     * Use Effects
     */
    // resize window
    useEffect(() => {
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    // for searching...
    useEffect(() => {
        doSearch();
    }, [searchText]);

    /**
     * Functions
     */
    // window resize
    window.onresize = () => {
        resizeWidth();
    };
    function resizeWidth() {
        setWidth(window.innerWidth);
    }

    // label stuff for charts
    const generateLabelsDailyCount = () => {
        let date = new Date();
        var dates = [];
        var labels = [];
        labels.push(date.toISOString().split('T')[0]);
        dates.push(date);
        for (let i = 0; i < 9; i++) {
            let nextDay: Date = new Date(dates[i]);
            nextDay.setDate(dates[i].getDate() - 1);
            dates.push(nextDay);
            labels.push(nextDay.toISOString().split('T')[0]);
        }
        return labels.reverse();
    }
    const dispLabelsDailyCount = () => {
        let date = new Date();
        var dates = [];
        var labels = [];
        labels.push(date.toDateString().split(' ').slice(1).join(' '));
        dates.push(date);
        for (let i = 0; i < 9; i++) {
            let nextDay: Date = new Date(dates[i]);
            nextDay.setDate(dates[i].getDate() - 1);
            dates.push(nextDay);
            labels.push(nextDay.toDateString().split(' ').slice(1).join(' '));
        }
        return labels.reverse();
    }
    const labels = generateLabelsDailyCount();

    // data for charts
    // daily count of message per day
    const [chartDataDailyCount, setChartDataDailyCount] = useState({
        labels: dispLabelsDailyCount(),
        datasets: [
            {
                type: 'line' as const,
                label: 'Line Chart',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                fill: false,
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            },
            {
                type: 'bar' as const,
                label: 'Bar Graph',
                backgroundColor: 'rgb(75, 192, 192)',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'white',
                borderWidth: 2,
            }
        ],
    });

    // total mentions per source
    const [chartDataPerSource, setChartDataPerSource] = useState({
        labels: dispLabelsDailyCount(), // TODO
        datasets: [
            {
                type: 'bar' as const,
                label: 'Bar Graph',
                backgroundColor: 'rgb(75, 192, 192)',
                data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
                borderColor: 'white',
                borderWidth: 2,
            }
        ],
    });

    // pass in the search logic to header
    const onClick = async (e: any) => {
        e.preventDefault();
        doSearch();
    }

    // load search data from backend
    const doSearch = async () => {
        try {
            setIsLoading(true);
			const { data: fetchedData } = await instance.post(
				"/search/",
				{
					word: searchText,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

            setTotal(fetchedData.totalCount);

            // repeated on constants.js & Search.tsx
            const numDaysBackGraphs = 10;

            // put backend data into JSON for chart
            // daily count of message per day
            var datasetForChart = Array.from({ length: numDaysBackGraphs }, () => 0);
            for (let i = 0; i < fetchedData.ten_day_count.length; i++) {
                var labels = [];
                labels = generateLabelsDailyCount();
                var idx = labels.findIndex((val) => val === fetchedData.ten_day_count[i].date);
                datasetForChart[idx] = fetchedData.ten_day_count[i].count; // + 1
            }

            // daily count of message per day
            setChartDataDailyCount({
                ...chartDataDailyCount,
                labels: dispLabelsDailyCount(),
                datasets: [
                    {
                        type: 'line' as const,
                        label: 'Line Chart',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        fill: false,
                        data: datasetForChart,
                    },
                    {
                        type: 'bar' as const,
                        label: 'Bar Graph',
                        backgroundColor: 'rgb(75, 192, 192)',
                        data: datasetForChart,
                        borderColor: 'white',
                        borderWidth: 2,
                    }
                ],
            });

            // not sure what below is for...?
            // fetchedData.messages.forEach((msg: any, idx: any) => {
            //     messages[idx] = {
            //         message: msg.message,
            //         id: idx,
            //         time: msg.time,
            //     };
            // });

            // sets the messages for user to view
            let tempMsg: Message[] = [];
            fetchedData.messages.forEach((msg: any, idx: any) => {
                let newMsg: Message = {
                    message: msg.message,
                    id: idx,
                    time: msg.time,
                }
                tempMsg.push(newMsg);
            });

            // set various variables
            setWord(fetchedData.word);
            setMessages(tempMsg);
            setFoundResults(true);
            setIsLoading(false);

        } catch (e: any) {
            console.error("try/catch in Search.tsx: ", e);

            if (e && e.response) {
				setError(String(e.response.data.body));
            } else {
                setError('Unable to connect. Please try again later');
            }

            setIsLoading(false);
            setFoundResults(false);
        }
    }

    // get the wallet address from header
    const mintAddrToParent = (walletAddress: any) => {
        setWalletAddress(walletAddress);
    }

    // for scrolling to top
    const contentRef = useRef<HTMLIonContentElement | null>(null);
    const scrollToTop = () => {
        contentRef.current && contentRef.current.scrollToTop();
    };

    /**
     * Renders
     */

    return (
        <React.Fragment>
            <IonPage id="home-page">
                <IonContent ref={contentRef} scrollEvents={true} fullscreen>
                    {/* Header */}
                    <Header mintAddrToParent={mintAddrToParent} onClick={onClick} showflag={false} />

                    {/* Main Content After Header */}
                    <div className="font-sans bg-gradient-to-b from-bg-primary to-bg-secondary flex justify-center items-center p-2 pt-2 sticky">
                        {/*min-h-screen*/}

                        {/* The Gray Container */}
                        <div className={` ${width <= 640 ? "w-full" : "container"} bg-satin-3 rounded-lg pt-2 pb-5 pr-2 pl-2 h-fit xl:pb-2 2xl:pb-1 lg:pb-3`}>

                            {/* loading bar */}
                            {isLoading && (
                                <div>
                                    <h1 className="flex justify-center items-center font-bold text-xl">Searching for "{searchText}"</h1>
                                    <br/>
                                    <div className="pt-10 flex justify-center items-center">
                                        <Loader/>
                                    </div>
                                </div>)}

                            {/* use this if you want to test the width */}
                            {/*--{width}--*/}

                            {/* chart / search results, based on screen width
                                note that heights of the chart are hardcoded below, while heights of the message list is on the Display.jsx.getMessageListHeight() */}
                            {!isLoading && foundResults && width > 1536 && (
                                <Display chartDataDailyCount={chartDataDailyCount}
                                    height={Number(85)} total={total}
                                    />
                            )}
                            {!isLoading && foundResults && width <= 1536 && width > 1280 && (
                                <Display chartDataDailyCount={chartDataDailyCount}
                                    height={Number(85)} total={total}
                                    />
                            )}
                            {!isLoading && foundResults && width <= 1280 && width > 1024 && (
                                <Display chartDataDailyCount={chartDataDailyCount}
                                    height={Number(85)} total={total}
                                    />
                            )}
                            {!isLoading && foundResults && width <= 1024 && width > 768 && (
                                <Display chartDataDailyCount={chartDataDailyCount}
                                    height={Number(85)} total={total}
                                     />
                            )}
                            {!isLoading && foundResults && width <= 768 && width > 640 && (
                                <Display chartDataDailyCount={chartDataDailyCount}
                                    height={Number(130)} total={total}
                                     />

                            )}
                            {!isLoading && foundResults && width <= 640 && (
                                // <MobileDisplay chartDataDailyCount={chartDataDailyCount} position='right'
                                //     height={Number(175)} total={total} totalCountHeight={30}
                                //  />
                                <Display chartDataDailyCount={chartDataDailyCount}
                                         height={Number(175)} total={total}
                                          />
                            )}

                            {/* error bar */}
                            {!isLoading && !foundResults && error !== '' && (
                                <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                                    <p className="text-lg text-red-700 font-medium"><b>{error}</b></p>
                                    <span
                                        className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">!</span>
                                    {/*<div className="absolute top-0 right-0 flex space-x-2 p-4"></div>*/}
                                </div>
                            )}

                            {/* scroll bar */}
                            {!isLoading && foundResults && total > 5 && (
                                <IonButton onClick={() => scrollToTop()} className="float-right">Scroll to Top</IonButton>
                            )}

                        </div>
                    </div>

                </IonContent>
            </IonPage>
        </React.Fragment>
    );
};

export default Search;
