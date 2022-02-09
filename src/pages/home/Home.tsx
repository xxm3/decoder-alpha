import {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRouterLink,
    IonSearchbar
} from '@ionic/react';
import { IonItem, IonLabel, IonCard, IonCardContent, IonIcon, IonRow, IonCol } from '@ionic/react';
import React, {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import './Home.css';
import Header from '../../components/header/Header';
import Card from './Card';
import CollectionCard from './CollectionCard';
import Loader from "../../components/Loader";
import {environment} from "../../environments/environment";
import moment from "moment";
import {pin, search} from 'ionicons/icons';
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner
} from "@nfteyez/sol-rayz";
import {Connection, programs} from '@metaplex/js';
import {instance} from "../../axios";
// import {Message} from "../../data/messages";
import {Chart} from "react-chartjs-2";
import {dispLabelsDailyCount, getDailyCountData} from '../../components/feMiscFunctions';
import {data} from "autoprefixer";
import { ChartData } from 'chart.js';
import SearchBar from '../../components/SearchBar';

const Home = () => {

    /**
     * States & Variables
     */
    const [userNfts, setUserNfts] = useState([]); // from user wallet
    const [homePageData, setHomePageData] = useState([]); // ie. possible mints...
    const [newCollections, setNewCollection] = useState([]); // from ME
    const [popularCollections, setPopularCollection] = useState([]); // from ME

    const [isLoading, setIsLoading] = useState(false);

    const [width, setWidth] = useState(window.innerWidth);

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
        return 230;
    }, [width])

    // resize window
    useEffect(() => {
        function resizeWidth() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    // useEffect(() => {
    //     fetchHomePageData();
    // }, []);

    /**
     * Functions
     */
    // gets the user's nft's from their wallet
    // from https://github.com/NftEyez/sol-rayz
    // const getNfts = async (passedWalletAddress: string) => {
    //     const publicAddress = passedWalletAddress;
    //     const rawNftArray = await getParsedNftAccountsByOwner({
    //         publicAddress,
    //     });
    //     // console.log("raw user nfts: ", rawNftArray);
    //     let modifiedUserNfts: any = [];
    //     for (let i in rawNftArray) {
    //         const uri = rawNftArray[i].data.uri;
    //         if (uri.indexOf("arweave") !== -1) {
    //             let moreData: any = {};
    //             await axios.get(uri).then((res) => {
    //                 // push unique collections only
    //                 // @ts-ignore
    //                 if (!modifiedUserNfts.map(item => item.name).includes(res.data.collection.name)) {
    //                     modifiedUserNfts.push({
    //                         img: res.data.image,
    //                         name: res.data.collection.name
    //                     });
    //                 }
    //             }).catch((err) => {
    //                 console.error("error when getting arweave data: " + err);
    //             });
    //         }
    //         // console.log("modified user nfts: ", modifiedUserNfts);
    //         // @ts-ignore
    //         setUserNfts(modifiedUserNfts);
    //     }
    // }

    // get data for home page
    const fetchHomePageData = () => {
        setIsLoading(true);
        instance
            .get(environment.backendApi + '/homeData')
            .then((res) => {
                setHomePageData(res.data.data.possibleMintLinks[0]);
                setNewCollection(res.data.data.new_collections);
                setPopularCollection(res.data.data.popular_collections);
                // console.log("res1----------------", homePageData);

                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                console.error("error when getting home page data: " + err);
            });
    };

    const getDateAgo = function (time: any){
        return moment(time).fromNow();
    }

    /**
     * Renders
     */
    const defaultGraph : ChartData<any, string> = {
        labels: ["1"],
        datasets: [ { data: ["3"] } ],
    };

    // search vars
    const [searchValueStacked, setSearchValueStacked] = useState('');
    const [errorSearchStacked, setErrorSearchStacked] = useState('');

    const [graphStackedLoading, setGraphStackedLoading] = useState(false);
    const [stackedLineData, setStackedLineData] = useState(defaultGraph);


    // load search data from backend, for stacked line graph
    const doSearch = async (query : string) => {
        try {
            setErrorSearchStacked("");
            setSearchValueStacked(query);

            if(query.length < 3){ return setErrorSearchStacked('Please search on 3 or more characters'); }
            if(query.split(' ').length > 8){ return setErrorSearchStacked('Please search on 8 words max'); }

            setGraphStackedLoading(true);
            setStackedLineData(defaultGraph);

            const { data: rawFetchedData } = await instance.post<
                {
                    name: string;
                    ten_day_count: {
                        count: number;
                        date: string;
                    }[];
                }[]
            >(
                '/getWordCount/',
                {
                    array: query.split(' '),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const colorAry = ['rgb(255, 0, 0)',
                'rgb(153, 255, 51)',
                'rgb(0, 128, 255)',
                'rgb(127, 0, 255)',
                'rgb(255, 255, 255)',
                'rgb(255, 204, 204)',
                'rgb(102, 51, 0)',
                'rgb(255, 102, 102)'];

            let datasetsAry = [];
            for(let i in rawFetchedData){
                datasetsAry.push({
                    type: 'line' as const,
                    label:  rawFetchedData[i].name,

                    borderColor: colorAry[i],
                    borderWidth: 2,
                    fill: false,

                    data: getDailyCountData(rawFetchedData[i]),
                });
            }

            // console.log(rawFetchedData[0].ten_day_count);
            // rawFetchedData[0].ten_day_count -> [{count: 5, date: '2022-xx-xx'}, {}
            const labels = dispLabelsDailyCount(rawFetchedData[0].ten_day_count, true);

            // console.log("labels");
            // console.log(labels);
            // console.log("first data");
            // console.log(getDailyCountData(rawFetchedData[0]));

            setStackedLineData({
                labels: labels,
                datasets: datasetsAry,
            });

            // set various variables
            setGraphStackedLoading(false);

        } catch (e: any) {
            console.error("try/catch in Home.tsx.doSearch: ", e);

            if (e && e.response) {
                setErrorSearchStacked(String(e.response.data.body));
            } else {
                setErrorSearchStacked('Unable to connect. Please try again later');
            }

            setGraphStackedLoading(false);
        }
    }

    // @ts-ignore
    return (
        <React.Fragment>

            <IonPage> {/* className="bg-sky" */ }

                <IonContent  fullscreen> {/* ref={contentRef} scrollEvents={true} */}

                    <Header />

                    {/* Main Content After Header - The light gray Container */}
                    <div className="bg-gradient-to-b from-bg-primary to-bg-secondary justify-center items-center p-4 pt-2 sticky">
                        {/*flex*/}

                        <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4 mb-4`}>
                            <p className="mb-3">The search above does an exact match on a single word ("catalina"), or does an exact match on multiple words ("catalina whale").
                                Results include graphs, and messages you can scroll through.</p>

                            <p>Below search will compare multiple single words against each other ("portals enviro suites").
                                Each word will be graphed and you can compare the popularity of each word against each other.</p>
                        </div>

                        {/* The bit darker Gray Container */}
                        <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>
                            {/*${width <= 640 ? 'w-full' : 'container'}*/}

                            <div className={`font-bold pb-1 ${width <= 640 ? 'w-full' : 'w-96 '}`}>Compare multiple words on a line graph</div>

                            <div className={`max-w-2xl my-2`}>
                                <SearchBar initialValue='' onSubmit={doSearch} placeholder='Type to search' />
                            </div>

                            {/*--{width}--{chartHeight}--*/}

                            {/*loading*/}
                            {graphStackedLoading ? (
                                <div className="pt-10 flex justify-center items-center">
                                    <Loader />
                                </div>

                            // error
                            ) : errorSearchStacked ? (
                                <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                                    <p className="text-lg text-red-700 font-medium">
                                        <b>{(errorSearchStacked as string) || 'Unable to connect'}</b>
                                    </p>
                                    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                                        !
                                    </span>
                                </div>

                            // graph itself
                            ) : (
                                <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg" hidden={graphStackedLoading || stackedLineData.labels?.length === 1}>
                                    <Chart type='line' data={stackedLineData} height={chartHeight}
                                           options={{
                                               responsive: true,
                                               maintainAspectRatio: true,
                                               plugins: {
                                                   legend: {
                                                       display: true,
                                                       reverse: true
                                                   },
                                                   title: { display: true, text: '# of messages per day (from several Discords)'},
                                               },
                                               y: {
                                                   suggestedMin: 0,
                                               }
                                           }} />
                                </div>
                            )}

                        </div>
                    </div>


                    {/* Possible Mints ... */}
                    <IonCard hidden={true}>
                        <IonLabel className="text-4xl text-blue-600">Possible Mints</IonLabel>

                        {/* loading bar */}
                        {isLoading && (
                            <div className="pt-10 flex justify-center items-center">
                                <Loader/>
                            </div>
                        )}
                        <div hidden={isLoading}>
                            {homePageData.map((product: any, index: any) => (
                                <>
                                    <Card key={index} url={product.url} readableTimestamp={getDateAgo(product.timestamp)} source={product.source}/>
                                </>
                            ))}
                        </div>
                    </IonCard>

                </IonContent>



                {/* SHITTY FORMATTED CODE: */}

                <div hidden={true}>
                <IonContent>
                    <IonRow>
                        <IonLabel className="text-4xl text-blue-600">New Collection</IonLabel>
                    </IonRow>

                    {/* loading bar */}
                    {isLoading && (
                        <div className="pt-10 flex justify-center items-center">
                            <Loader/>
                        </div>
                    )}
                    <div hidden={isLoading}>

                        {/* New Collections */}
                        <IonRow className="bg-lime-700">
                            {newCollections.map((collection: any, index: any) => (
                                <IonCol>
                                    <CollectionCard key={index}
                                                    name={collection.name}
                                                    description={collection.description}
                                                    image={collection.image}
                                                    website={collection.website}
                                                    twitter={collection.twitter}
                                                    discord={collection.discord}
                                                    categories={collection.categories}
                                                    splitName={collection.splitName}
                                                    link={collection.link}
                                                    timestamp={collection.timestamp}
                                                    readableTimestamp={collection.readableTimestamp}
                                    />
                                </IonCol>
                            ))}
                        </IonRow>

                        {/* Popular Collections */}
                        <IonRow>
                            <IonLabel className="text-4xl text-blue-600">Popular Collection</IonLabel>
                        </IonRow>

                        <IonRow>
                            {popularCollections.map((collection: any, index: any) => (
                                <IonCol>
                                    <CollectionCard key={index}
                                                    name={collection.name}
                                                    description={collection.description}
                                                    image={collection.image}
                                                    website={collection.website}
                                                    twitter={collection.twitter}
                                                    discord={collection.discord}
                                                    categories={collection.categories}
                                                    splitName={collection.splitName}
                                                    link={collection.link}
                                                    timestamp={collection.timestamp}
                                                    readableTimestamp={collection.readableTimestamp}
                                    />
                                </IonCol>
                            ))}
                        </IonRow>

                    </div>
                </IonContent>



                {/* user's NFTs */}
                {/*<h3>User NFTs:</h3>*/}
                {/*<IonCard>*/}
                {/*    <IonContent>*/}
                {/*        <IonRow className="bg-lime-700" hidden={userNfts.length === 0}>*/}
                {/*            {userNfts.map((collection: any, index: any) => (*/}
                {/*                <IonCol>*/}
                {/*                    {collection.name}*/}
                {/*                    <br/>*/}
                {/*                    <img style={{height: "100px"}} src={collection.img} alt="" />*/}
                {/*                </IonCol>*/}
                {/*            ))}*/}
                {/*        </IonRow>*/}
                {/*    </IonContent>*/}
                {/*</IonCard>*/}

                </div>

            </IonPage>
        </React.Fragment>
    );
}

export default Home;
