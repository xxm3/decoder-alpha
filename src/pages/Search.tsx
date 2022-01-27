import Loader from '../components/search/Loader';
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
// import MobileDisplay from '../components/search/MobileDisplay';
import { environment } from "../environments/environment";
import { useParams } from 'react-router';
import Header from "../components/header/Header";

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

    // chart stuff
    const generateLabels = () => {
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
    const dispLabels = () => {
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
    const labels = generateLabels();

    // data for charts
    const [chartData, setChartData] = useState({
        labels: dispLabels(),
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

    const onClick = async (e: any) => {
        e.preventDefault();
        doSearch();
    }

    // load search data from backend
    const doSearch = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(environment.backendApi + '/search/', {
                method: 'POST',
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "word": searchText,
                })
            });

            let fetchedData = await res.json().then(data => {
                return data;
            });

            if (res.status !== 200 || fetchedData?.error) {
                setIsLoading(false);
                setFoundResults(false);

                setError('Unable to connect. Please try again later');

                throw fetchedData;
            }

            let sample = fetchedData;
            setTotal(sample.totalCount);

            // repeated on constants.js & Search.tsx
            const numDaysBackGraphs = 10;
            var datasetForChart = Array.from({ length: numDaysBackGraphs }, () => 0);
            for (let i = 0; i < sample.ten_day_count.length; i++) {
                var labels = [];
                labels = generateLabels();
                var idx = labels.findIndex((val) => val === sample.ten_day_count[i].date);
                datasetForChart[idx] = sample.ten_day_count[i].count; // + 1
            }

            setChartData({
                ...chartData,
                labels: dispLabels(),
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
            sample.messages.forEach((msg: any, idx: any) => {
                messages[idx] = {
                    message: msg.message,
                    id: idx,
                    time: msg.time,
                };
            });

            // setShowHelp(false);
            setFoundResults(true);

            let tempMsg: Message[] = [];
            sample.messages.forEach((msg: any, idx: any) => {
                let newMsg: Message = {
                    message: msg.message,
                    id: idx,
                    time: msg.time,
                }
                tempMsg.push(newMsg);
            });
            setWord(sample.word);
            setMessages(tempMsg);

            setIsLoading(false);
        } catch (e: any) {
            console.error("try/catch in Search.tsx: ", e);

            if (e && e.body) {
                setError(String(e.body));
            } else {
                setError('Unable to connect. Please try again later');
            }

            setIsLoading(false);
            setFoundResults(false);
        }
    }

    const mintAddrToParent = (walletAddress: any) => {
        setWalletAddress(walletAddress);
    }

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
                    <div className="font-sans bg-gradient-to-b from-bg-primary to-bg-secondary flex justify-center items-center p-4 pt-2 sticky">
                        {/*min-h-screen*/}

                        {/* The Gray Container */}
                        <div className={` ${width <= 640 ? "w-full" : "container"} bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>

                            {/* loading bar */}
                            {isLoading && (
                                <div>
                                    <h1>Searching for {searchText}</h1>
                                    <div className="pt-10 flex justify-center items-center">
                                        <Loader/>
                                    </div>
                                </div>)}

                            {/* use this if you want to test the width */}
                            {/*--{width}--*/}

                            {/* chart / search results, based on screen width
                                note that heights of the chart are hardcoded below, while heights of the message list is on the Display.jsx.getMessageListHeight() */}
                            {!isLoading && foundResults && width > 1536 && (
                                <Display chartData={chartData} position='bottom'
                                    height={Number(35)} total={total} totalCountHeight={18} showPie={false}
                                     width={width}/>
                            )}
                            {!isLoading && foundResults && width <= 1536 && width > 1280 && (
                                <Display chartData={chartData}  position='bottom'
                                    height={Number(45)} total={total} totalCountHeight={22} showPie={false}
                                    width={width}/>
                            )}
                            {!isLoading && foundResults && width <= 1280 && width > 1024 && (
                                <Display chartData={chartData} position='bottom'
                                    height={Number(60)} total={total} totalCountHeight={25} showPie={false}
                                    width={width}/>
                            )}
                            {!isLoading && foundResults && width <= 1024 && width > 768 && (
                                <Display chartData={chartData} position='bottom'
                                    height={Number(80)} total={total} totalCountHeight={28} showPie={false}
                                    width={width} />
                            )}
                            {!isLoading && foundResults && width <= 768 && width > 640 && (
                                <Display chartData={chartData} position='bottom'
                                    height={Number(130)} total={total} totalCountHeight={35} showPie={false}
                                    width={width} />

                            )}
                            {!isLoading && foundResults && width <= 640 && (
                                // <MobileDisplay chartData={chartData} position='right'
                                //     height={Number(175)} total={total} totalCountHeight={30} showPie={false}
                                //  />
                                <Display chartData={chartData} position='bottom'
                                         height={Number(175)} total={total} totalCountHeight={35} showPie={false}
                                         width={width} />
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
