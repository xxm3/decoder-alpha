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
import DisplayGraph from '../components/search/DisplayGraph';
import Loader from '../components/Loader';

const Search: React.FC = () => {

    /**
     * States & Variables
     */
    const [width, setWidth] = useState(window.innerWidth);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [chartDailyCount, setChartDailyCount] = useState({});
    const [chartSource, setChartSource] = useState({});
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    let error: any;

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
            
            if(results[0].status == 'success') {
                if (results[0].data) {
                    if(results[0].data?.error) {
                        setIsError(true)
                        setErrorMessage(results[0].data.body);
                        setChartDailyCount({});
                        setChartSource({});
                    }
                    if (results[0].data.totalCount) {
                        const totalPages = Math.floor(results[0].data.totalCount / 100);
                        setPageCount(totalPages)
                        setIsError(false);
                        setErrorMessage("");

                    } else {
                        setIsError(true)
                        setErrorMessage("No data found");
                        setChartDailyCount({});
                        setChartSource({});
                    }
                }
            }
        }
    }, [results[0]?.data])


    useEffect(() => {
        if(results.length) {
            console.log("result ", results);
            
            if(results[1].status == 'success') {
                if(results[1].data) {

                    if(results[0].data?.error) {
                        setIsError(true)
                    }
                    else {
                        setIsError(false);

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
                        setChartSource(chartDataPerSource);
                    }
                }
            }
        }

    }, [results[1]?.data])

    // useEffect(() => {
    // },[chartDailyCount, chartSource])

    // for scrolling to top
    const contentRef = useRef<HTMLIonContentElement | null>(null);

    /**
     * Functions
     */
    const scrollToTop = () => {
        
        if(contentRef.current !== null) {
            console.log("inside if");
            contentRef.current.scrollToTop();
        }
        else {
            console.log("used window property");     
            window.scrollTo(0, 0)      
        }
        // contentRef.current !== null ? contentRef.current.scrollToTop() : window.scrollTo({top:0, behavior:"smooth"});
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

                            {/* ERROR bar */}
                            {isError ? (
                                <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                                    <p className="text-lg text-red-700 font-medium">
                                        <b>{errorMessage || 'Unable to connect, please try again later'}</b>
                                    </p>
                                    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                                        !
                                    </span>
                                </div>

                            // actual content
                            ) : (
                                <>
                                {results[0]?.status == 'loading' && results[1]?.status == 'loading' ?
                                    <div className="pt-10 flex justify-center items-center"><Loader /></div> :
                                  <>
                                  {isError === false && <Display {...{
                                        chartDataDailyCount : chartDailyCount ? chartDailyCount: {},
                                        chartDataPerSource : chartSource ? chartSource : {},
                                        chartHeight,
                                        isLoadingChart: results[1].isLoading,
                                        totalCount: results[0].data?.totalCount,
                                        dataObject: results[0],
                                        messages : results[0].data?.messages ?? [],
                                        isLoadingMessages: results[0].isLoading
                                    }}/>}
                                    
                                    {(results[0].data?.totalCount ?? 0) > 5 && (
                                        <>
                                        {(currentPage != 0) && <IonButton onClick={()=> handlePage('previous')}>Previous</IonButton>}

                                        {/*TODO-rakesh: this next isn't working when its multiple words :( search for "Starry Insiders"*/}
                                        {(currentPage < pageCount) && <IonButton onClick={()=> handlePage('next')}  className="ml-4">Next</IonButton>}
                                            {/* && results[0].data?.totalCount > 100*/}
                                        <IonButton
                                            onClick={scrollToTop}
                                            className="float-right"
                                        >
                                            {/*TODO-rakesh: this doens't work anymore*/}
                                            Scroll to Top
                                        </IonButton>
                                        </>
                                    )}
                                    </> }
                                    {/* : <></>} */}
                                </>
                              )}
                        </div>
        </React.Fragment>
    );
};

export default Search;
