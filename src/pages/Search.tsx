import Loader from '../components/search/Loader';
import React, { useRef } from 'react';
import Display from '../components/search/Display';
import { useState, useEffect, useContext} from 'react';
import { Message } from '../data/messages';

import {
    IonContent,
    IonPage,
    IonSearchbar,
    IonButton,
    IonIcon
} from '@ionic/react';
import './Search.css';
import faker from 'faker';
import { setTimeout } from 'timers';
import { MessageContext } from '../context/context';
import MobileDisplay from '../components/search/MobileDisplay';
import { environment } from "../environments/environment";
import { useParams, useHistory } from 'react-router';
import HeaderContainer from "../components/header/HeaderContainer";

const Search: React.FC = () => {

    // @ts-ignore

    const { messages, setMessages, setWord } = useContext(MessageContext);
    const [total, setTotal] = useState(0);
    const history = useHistory();
    const [showHelp, setShowHelp] = useState(true);
    const [width, setWidth] = useState(window.innerWidth);
    
    window.onresize = () => {
        resizeWidth();
    };

    function resizeWidth() {
        setWidth(window.innerWidth);
    }
    
    // @ts-ignore
    const { id } = useParams();
    const [searchText, setSearchText] = useState(id);

    const [isLoading, setIsLoading] = useState(false);
    const [foundResults, setFoundResults] = useState(false);
    const [error, setError] = useState("");

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
    // const [messages, setMessages] = useState<Message[]>([]);


    const [doughnutData, setDoughnutData] = useState({
        labels: labels,
        datasets: [
            // {
            //     label: '# of Votes',
            //     data: [12, 19, 3, 5, 2, 3],
            //     backgroundColor: [
            //         'rgba(255, 99, 132, 0.8)',
            //         'rgba(54, 162, 235, 0.8)',
            //         'rgba(255, 206, 86, 0.8)',
            //         'rgba(75, 192, 192, 0.8)',
            //         'rgba(153, 102, 255, 0.8)',
            //         'rgba(255, 159, 64, 0.8)',
            //     ],
            //     borderColor: [
            //         'rgba(255, 99, 132, 1)',
            //         'rgba(54, 162, 235, 1)',
            //         'rgba(255, 206, 86, 1)',
            //         'rgba(75, 192, 192, 1)',
            //         'rgba(153, 102, 255, 1)',
            //         'rgba(255, 159, 64, 1)',
            //     ],
            //     borderWidth: 2,
            // },
        ],
    });

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

    const doSearch = async () => {

        try {
            setIsLoading(true);

            // testing CORS stuff...
            // await fetch(environment.backendApi + '/receiver/urlParser?url=https://google.com/', { method: 'GET' });


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

            setDoughnutData({
                ...doughnutData,
                // labels: sample.ten_day_count.map(x => x.date),
                // datasets: [
                //     {
                //         label: '10 days count',
                //         data: sample.ten_day_count.map(x => x.count),
                //         backgroundColor: [
                //             'rgba(255, 99, 132, 0.8)',
                //             'rgba(54, 162, 235, 0.8)',
                //             'rgba(255, 206, 86, 0.8)',
                //             'rgba(75, 192, 192, 0.8)',
                //             'rgba(153, 102, 255, 0.8)',
                //             'rgba(255, 159, 64, 0.8)',
                //         ],
                //         borderColor: [
                //             'rgba(255, 99, 132, 1)',
                //             'rgba(54, 162, 235, 1)',
                //             'rgba(255, 206, 86, 1)',
                //             'rgba(75, 192, 192, 1)',
                //             'rgba(153, 102, 255, 1)',
                //             'rgba(255, 159, 64, 1)',
                //         ],
                //         borderWidth: 2,
                //     },
                // ]
            });

            // const handleKeyDown = (event: any) => {
            //     if (event.key === 'Enter') {
            //         onClick(event);
            //     }
            // }

            // repeated on constants.js & Search.tsx
            const numDaysBackGraphs = 10;
            var datasetForChart = Array.from({ length: numDaysBackGraphs }, () => 0);
            for (let i = 0; i < sample.ten_day_count.length; i++) {
                var labels = [];
                labels = generateLabels();
                var idx = labels.findIndex((val) => val === sample.ten_day_count[i].date);
                datasetForChart[idx] = sample.ten_day_count[i].count;
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

            // console.log(messages);

            setShowHelp(false);
            setTimeout(() => {
                setFoundResults(true);
            }, 2000);

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

            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
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

    useEffect(() => {
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    useEffect(() => {
        doSearch();
    }, [searchText]);
    const [walletAddress, setWalletAddress] = useState('');

    /**
     * Actions
     */
    const mintAddrToParent = (walletAddress: any) => {
        setWalletAddress(walletAddress);
    }

    const contentRef = useRef<HTMLIonContentElement | null>(null);
    const scrollToTop = () => {
        contentRef.current && contentRef.current.scrollToTop();
    };
    const childRef = useRef <typeof HeaderContainer>(HeaderContainer);
    return (
        <React.Fragment>
            <IonPage id="home-page">
                <IonContent ref={contentRef} scrollEvents={true} fullscreen>
                    <HeaderContainer mintAddrToParent={mintAddrToParent} onClick={onClick} showflag={false} />
                    <div className="min-h-screen font-sans bg-gradient-to-b from-bg-primary to-bg-secondary flex justify-center items-center p-4 pt-2">
                        <div className={` ${width <= 640 ? "w-full" : "container"} bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>
                            {/* search bar / form */}
                            <form onSubmit={(e) => onClick(e)}>
                                {(!foundResults || isLoading) && (<>
                                    <h1 className="text-center font-bold text-white text-4xl">{isLoading ?
                                        <p>Searching for <b className="text-cb">{searchText}</b></p> : 'Search:'}
                                    </h1>
                                    {/*<p className="mx-auto font-normal text-center text-sm my-6 max-w-lg">This app will last 10 days count and last 100 messages.</p>*/}
                                </>
                                )}
                                {/* bg-cbgd bg-bg-secondary */}
                                <div className="xs:flex items-center rounded-lg overflow-hidden px-2 py-1 justify-center">
                                    <IonSearchbar className="xs-flex text-base text-gray-400 flex-grow outline-none px-2 "
                                        type="text" value={searchText} onIonChange={e => {
                                            setSearchText(e.detail.value!)
                                        }} animated placeholder="Type to search" disabled={isLoading} />
                                    <div className="xs:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                        <IonButton className=" text-white text-base rounded-lg" onClick={() => onClick}
                                            animate-bounce disabled={searchText === ''}>
                                            Search</IonButton>
                                    </div>
                                </div>
                            </form>

                            {/* loading bar */}
                            {isLoading && (<div className="pt-10 flex justify-center items-center">
                                <Loader/>
                            </div>)}

                            {/* chart / search results, based on screen width
                                note that heights of the chart are hardcoded below, while heights of the message list is on the Display.jsx.getMessageListHeight() */}
                            {!isLoading && foundResults && width > 1536 && (
                                <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                    height={Number(35)} total={total} totalCountHeight={18} showPie={false}
                                     width={width}/>
                                // height={Number(10 + 65)}   75
                            )}
                            {!isLoading && foundResults && width <= 1536 && width > 1280 && (
                                <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                    height={Number(45)} total={total} totalCountHeight={22} showPie={false}
                                    width={width}/>
                                // height={Number(75 + 10)} 85
                            )}
                            {!isLoading && foundResults && width <= 1280 && width > 1024 && (
                                <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                    height={Number(55)} total={total} totalCountHeight={25} showPie={false}
                                    width={width}/>
                                // height={Number(5 + 100)}     105
                            )}
                            {!isLoading && foundResults && width <= 1024 && width > 768 && (
                                <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                    height={Number(65)} total={total} totalCountHeight={28} showPie={false}
                                    width={width}></Display>
                                // height={Number(5 + 100)}     105
                            )}
                            {!isLoading && foundResults && width <= 768 && width > 640 && (
                                <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                    height={Number(230)} total={total} totalCountHeight={35} showPie={false}
                                    width={width}></Display>
                                // height={Number(5 + 225)}     230
                            )}
                            {!isLoading && foundResults && width <= 640 && (
                                <MobileDisplay chartData={chartData} doughnutData={doughnutData} position='right'
                                    height={Number(310)} total={total} totalCountHeight={30} showPie={false}
                                ></MobileDisplay>
                                // height={Number(30 + 275)}       310      width={width}
                            )}
                            {/* error bar */}
                            {!isLoading && !foundResults && error !== '' && (
                                <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                                    <p className="text-lg text-red-700 font-medium"><b>{error}</b></p>
                                    <span
                                        className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">!</span>
                                    <div className="absolute top-0 right-0 flex space-x-2 p-4"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <IonButton onClick={() => scrollToTop()}>Scroll Top</IonButton>
                </IonContent>
            </IonPage>
        </React.Fragment>
    );
};

export default Search;
