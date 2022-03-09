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
import SearchSkeleton from '../components/search/SearchSkeleton';
import { AppComponentProps } from '../components/Route';

const Search: React.FC<AppComponentProps> = ( { contentRef }) => {

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
        if(width > 1536) return 100;
        if(width > 1280) return 115;
        if(width > 1024) return 135;
        if(width > 768) return 180;
        if(width > 640) return 225;
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

 
    /**
     * Functions
     */

    const useMountEffect = (fun:any) => useEffect(fun, []);

    useMountEffect(() => contentRef?.scrollToTop());

    const handlePage = (type: string) => {
        contentRef?.scrollToTop(800)
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
                    pageNumber: currentPage,
                    pageSize: 100 // doing 10 from backend (discord) - search.js ... 100 from frontend (website) - search.tsx
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
    const messageQuery = useQuery([searchText,currentPage], fetchSearchMessages, {
        keepPreviousData : true,
        select : (data: any) => {
            // in case couldn't search on this

            if (data?.error && data.body) {
                throw new Error(String(data.body));
            }
            if(data?.totalCount > 100) {
                data.hasMore = true;
            }
            return {
                ...data,
            }
        },
        retry : false
    })

    /**
     * Renders
     */

    return (
        <React.Fragment>

                                {/* ERROR bar */}
                                {graphQuery.isError || messageQuery.isError || messageQuery?.data?.error || graphQuery?.data?.error ? (
                                    <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                                        <p className="text-lg text-red-700 font-medium">

                                            {/* No results found */}
                                            <b>{(messageQuery?.error as Error)?.message ||
                                               (graphQuery?.error as Error)?.message || 'Unable to connect, please try again later'}</b>
                                        </p>
                                        <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                                            !
                                        </span>
                                    </div>

                                // actual content
                                ) : (
                                    <>
                                        {graphQuery?.isFetching ? <div className=" m-16 flex justify-center items-center"><Loader /></div> :
                                        graphQuery?.isError ? <p className="text-lg text-red-700 font-medium">
                                        <b>{"Error while loading message"}</b>
                                        </p> :
                                      	  <DisplayGraph {...{
	                                            chartDataDailyCount : graphQuery?.data.chartDataDailyCount,
	                                            chartDataPerSource : graphQuery?.data.chartDataPerSource,
	                                            chartHeight,
	                                            isLoadingChart:graphQuery?.isLoading,
	                                            totalCount: messageQuery?.data?.totalCount
	                                        }} />}
	                                        {/* Displaying the custom skeleton loader while fetching */}
	                                        {messageQuery?.isFetching ?
	                                            new Array(10).fill(0).map((_,i) => <SearchSkeleton key={i}/>) :
	                                        messageQuery?.isError ? <p className="text-lg text-red-700 font-medium">
	                                            <b>{"Error while loading message"}</b>
	                                        </p> :
	                                        <Display {...{
	                                            messages : messageQuery?.data?.messages ?? [],
	                                            totalCount: messageQuery?.data?.totalCount
	                                        }}/>}

                                        {(messageQuery?.data?.totalCount ?? 0) > 5 && (
                                            <>
                                                {(currentPage != 0 && !messageQuery?.isFetching) && <IonButton onClick={()=> handlePage('previous')}>Previous</IonButton>}
                                                {(!messageQuery?.isPreviousData && messageQuery?.data?.hasMore && !messageQuery?.isFetching)  &&
                                                    <IonButton onClick={()=> handlePage('next')}  className="ml-4">Next</IonButton>}

                                                {!messageQuery?.isFetching &&
                                                <IonButton
                                                  onClick={() => contentRef?.scrollToTop(800)}
                                                   className="float-right"
                                                >
                                                    Scroll to Top
                                                </IonButton>}
                                            </>
                                        )}

                                    </>
                                )}
        </React.Fragment>
    );
};

export default Search;
