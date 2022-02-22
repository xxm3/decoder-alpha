import React, { useCallback, useMemo, useRef } from 'react';
import Display from '../components/search/Display';
import { useState, useEffect } from 'react';
import {
    IonButton, IonContent, IonPage,
} from '@ionic/react';
import './Search.css';
import { useParams } from 'react-router';
import { instance } from '../axios';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { SearchResponse } from '../types/SearchResponse';
import { dispLabelsDailyCount, getDailyCountData } from '../util/charts';
import DisplayGraph from '../components/search/DisplayGraph';
import Loader from '../components/Loader';
import Header from '../components/header/Header';

const Search: React.FC = () => {

    /**
     * States & Variables
     */
    const [width, setWidth] = useState(window.innerWidth);
    const [currentPage, setCurrentPage] = useState(0);
    // const [searchText, setSearchText] = useState(useParams<{id: string}>());

    const { id : searchText} = useParams<{
        id : string;
    }>();

    /**
     * Use Effects
     */
    // for setting height of chart, depending on what width browser is
    const chartHeight = useMemo(() => {
        if(width > 1536) return 75;
        if(width > 1280) return 90;
        if(width > 1024) return 110;
        if(width > 768) return 155;
        if(width > 640) return 200;
        return 140;
    }, [width]);

    // resize window
    useEffect(() => {
        function resizeWidth() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    // Whenever new word searched current page will set to its default value i.e. 0
    useEffect(() => {
        setCurrentPage(0);
    },[searchText])

    // for scrolling to top
    // const contentRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<any>(null);

    /**
     * Functions
     */
     const scrollToTop = () => {
        // contentRef.current && contentRef.current.scrollToTop();
        window.scrollTo(0,0)
    }

    const handlePage = (type: string) => {
        if(type === 'next' && (!messageQuery?.isPreviousData && messageQuery?.data?.hasMore)) setCurrentPage(currentPage+1)
        else setCurrentPage(currentPage - 1)
    }

    const fetchGraph = async () => {
        try {
            const { data } = await instance.post<SearchResponse>(
                '/search/',
                {
                    word: searchText,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return data;
        } catch (e) {
            console.error('try/catch in Search.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            if (error && error.response) {
                throw new Error(String(error.response.data.body));
            } else {
                throw new Error('Unable to connect. Please try again later');
            }
        }
    }

    const fetchSearchMessages = async () => {
        try {
            const { data } = await instance.post<SearchResponse>(
                '/searchMessages/',
                {
                    word: searchText,
                    pageNumber: currentPage
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return data;
        } catch (e) {
            console.error('try/catch in Search.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            if (error && error.response) {
                throw new Error(String(error.response.data.body));
            } else {
                throw new Error('Unable to connect. Please try again later');
            }
        }
    }

    const graphQuery = useQuery(['messages', searchText], fetchGraph, 
    {
        initialData: {
            messages: [...Array(20).keys()].map(() => undefined),
            totalCount : 20,
            word : searchText,
            ten_day_count : [],
            source : []
        },
        select : (data: any) => {

            // in case couldn't search on this
            if (data.error && data.body) {
                throw new Error(String(data.body));
            }

            const datasetForChartDailyCount = getDailyCountData(data);

            const chartDataDailyCount = {
                labels: dispLabelsDailyCount(data.ten_day_count, true),
                datasets: [
                    {
                        type: 'line' as const,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        fill: false,
                        data: datasetForChartDailyCount,
                    }
                ],
            }
            const sourceToAry = data.source;
            let labelsPerSource = [];
            let dataPerSource: any = [];
            for(let i in sourceToAry){
                labelsPerSource.push(sourceToAry[i][0]);
                dataPerSource.push(sourceToAry[i][1]);
            }
           const chartDataPerSource = ({
                labels: labelsPerSource,
                datasets: [
                    {
                        type: 'bar' as const,
                        backgroundColor: 'rgb(75, 192, 192)',
                        data: dataPerSource,
                        borderColor: 'white',
                        borderWidth: 2,
                    }
                ],
            });
            return {
                ...data,
                chartDataDailyCount,
                chartDataPerSource
            }
        },
        retry : false
    })
    const messageQuery = useQuery([searchText,currentPage], fetchSearchMessages, { keepPreviousData : true })

    if(messageQuery.status === 'success' && messageQuery?.data?.totalCount > 100) {
        messageQuery.data.hasMore = true;
    }
    /**
     * Renders
     */

    return (
        <React.Fragment>
            {/* <IonPage> */}
                {/* <IonContent ref={contentRef} scrollEvents={true} fullscreen> */}
                    {/* <Header /> */}

                        {/*min-h-screen*/}

                        {/* The bit darker Gray Container */}
                            <div ref={contentRef} className={` ${width <= 640 ? 'w-full' : 'container'}
                                bg-satin-3 rounded-lg pt-3 pb-6 md:px-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`} >

                                {/* ERROR bar */}
                                {(graphQuery.isError || messageQuery.isError) || messageQuery?.data?.error ? (
                                    <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                                        <p className="text-lg text-red-700 font-medium">
                                            <b>{messageQuery?.data?.body || 'Unable to connect, please try again later'}</b>
                                        </p>
                                        <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                                            !
                                        </span>
                                    </div>

                                // actual content
                                ) : (
                                    <>
                                        {graphQuery?.isFetching ? <div className="pt-10 flex justify-center items-center"><Loader /></div> : 
                                        graphQuery?.isError ? <p className="text-lg text-red-700 font-medium">
                                        <b>{"Error while loading message"}</b>
                                        </p> : <DisplayGraph {...{
                                            chartDataDailyCount : graphQuery?.data.chartDataDailyCount,
                                            chartDataPerSource : graphQuery?.data.chartDataPerSource,
                                            chartHeight,
                                            isLoadingChart:graphQuery?.isLoading,
                                            totalCount: messageQuery?.data?.totalCount
                                        }} />}
                                        {messageQuery?.isFetching ? <div className="pt-10 flex justify-center items-center"><Loader /></div> : 
                                        messageQuery?.isError ? <p className="text-lg text-red-700 font-medium">
                                            <b>{"Error while loading message"}</b>
                                        </p> :
                                        <Display {...{                                        
                                            messages : messageQuery?.data?.messages ?? [],
                                            totalCount: messageQuery?.data?.totalCount
                                        }}/>}
                                        {(messageQuery?.data?.totalCount ?? 0) > 5 && (
                                            <>
                                            {(currentPage != 0) && <IonButton onClick={()=> handlePage('previous')}>Previous</IonButton>}
                                            {(!messageQuery?.isPreviousData && messageQuery?.data?.hasMore)  && <IonButton onClick={()=> handlePage('next')}  className="ml-4">Next</IonButton>}
                                            <IonButton
                                                onClick={() => scrollToTop()}
                                                className="float-right"
                                                // ref={contentRef}
                                            >
                                                Scroll to Top
                                            </IonButton>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                {/* </IonContent> */}
            {/* </IonPage> */}
        </React.Fragment>
    );
};

export default Search;
