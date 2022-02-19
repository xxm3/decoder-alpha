import React, { useMemo, useRef } from 'react';
import Display from '../components/search/Display';
import { useState, useEffect } from 'react';
import {
    IonButton,
} from '@ionic/react';
import './Search.css';
import { useParams } from 'react-router';
import { instance } from '../axios';
import { useQueries } from 'react-query';
import { AxiosResponse } from 'axios';
import { SearchResponse } from '../types/SearchResponse';
import { dispLabelsDailyCount, getDailyCountData } from '../util/charts';

const Search: React.FC = () => {

    /**
     * States & Variables
     */
    const [width, setWidth] = useState(window.innerWidth);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [chartDailyCount, setChartDailyCount] = useState({});
    const [chartSource, setChartSource] = useState({});
    const [isError, setIsError] = useState(false)

    const { id : searchText} = useParams<{
        id : string;
    }>();    

    const results = useQueries([
        { 
            queryKey: ['messages', searchText,currentPage], 
            queryFn: async () => {
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
        },
        { 
            queryKey: ['messages', searchText], 
            queryFn: async () => {
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
        }
    ])

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

    useEffect(() => {
        if(results.length) {
            // setIsError(false);
            if(results[0].data && results[0].data.totalCount) {
                const totalPages = Math.floor(results[0].data.totalCount/100);
                setPageCount(totalPages)
            }
            if(results[1].data) {
                const datasetForChartDailyCount = getDailyCountData(results[1].data);

                const chartDataDailyCount = {
                    labels: dispLabelsDailyCount(results[1].data.ten_day_count, true),
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
                const sourceToAry = results[1].data.source;
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
                setChartDailyCount(chartDataDailyCount);
                setChartSource(chartDataPerSource)
            }
        }
        console.log("result : --- ",results);
        if(results[0].isError  || results[1].isError ) setIsError(true)
        else setIsError(false)
    }, [results[0]?.data, results[1]?.data])

    useEffect(() => {
        console.log("chart daily ", chartDailyCount, chartSource);
        
    },[chartDailyCount, chartSource])

    // for scrolling to top
    const contentRef = useRef<HTMLIonContentElement | null>(null);

    /**
     * Functions
     */
    const scrollToTop = () => {
        contentRef.current && contentRef.current.scrollToTop();
    };

    const handlePage = (type: string) => {
        if(type === 'next' && (currentPage < pageCount)) setCurrentPage(currentPage+1)
        else setCurrentPage(currentPage - 1)
    }

    /**
     * Renders
     */

    return (
        <React.Fragment>
                        {/*min-h-screen*/}

                        {/* The bit darker Gray Container */}
                        <div className={` ${width <= 640 ? 'w-full' : 'container'}
                            bg-satin-3 rounded-lg pt-3 pb-6 md:px-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>

                            {/* loading bar */}
                            {isError ? (
                                <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                                    <p className="text-lg text-red-700 font-medium">
                                        <b>{'Unable to connect'}</b>
                                    </p>
                                    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                                        !
                                    </span>
                                </div>

                            // actual content
                            ) : (
                                <>
                                {results.length && (Object.keys(chartDailyCount).length) ? 
                                  <> 
                                    <Display {...{
                                        chartDataDailyCount : chartDailyCount ? chartDailyCount: {},
                                        chartDataPerSource : chartSource ? chartSource : {},
                                        chartHeight,
                                        messages : results[0].data?.messages ?? [],
                                        totalCount: results[0].data?.totalCount
                                    }}/>
                                    {(results[0].data?.totalCount ?? 0) > 5 && (
                                        <>
                                        {(currentPage != 0) && <IonButton onClick={()=> handlePage('previous')}>Previous</IonButton>}
                                        {(currentPage < pageCount)  && <IonButton onClick={()=> handlePage('next')}  className="ml-4">Next</IonButton>}
                                        <IonButton
                                            onClick={() => scrollToTop()}
                                            className="float-right"
                                        >
                                            Scroll to Top
                                        </IonButton>
                                        </>
                                    )}
                                    </> : <></>}                                     
                                </>
                            )}
                        </div>
        </React.Fragment>
    );
};

export default Search;
