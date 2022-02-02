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
import React, {useEffect, useState} from 'react';
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
import {Message} from "../../data/messages";
import {Chart} from "react-chartjs-2";
import faker from 'faker';

const Home = () => {

    /**
     * States & Variables
     */
    const [userNfts, setUserNfts] = useState([]); // from user wallet
    const [homePageData, setHomePageData] = useState([]); // ie. possible mints...
    const [newCollections, setNewCollection] = useState([]); // from ME
    const [popularCollections, setPopularCollection] = useState([]); // from ME

    const [isLoading, setIsLoading] = useState(false);

    /**
     * Use Effects
     */
    useEffect(() => {
        fetchHomePageData();
    }, []);



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

    // search vars
    const [searchValueStacked, setSearchValueStacked] = useState('fellowship'); // TODO
    const [errorSearchStacked, setErrorSearchStacked] = useState('');
    const [graphStackedLoaded, setGraphStackedLoaded] = useState(false);
    const [stackedLineData, setStackedLineData] = useState({
        labels: ["1,2"],
        datasets: [ { data: ["3", "4"] } ],
    });

    // does the search functionality
    function handleSearchStacked(val: any) {
        if (typeof (val) !== "undefined" && val !== '') {
            doSearch();
        }
    }

    // when typing into the search bar
    const handleKeyDownStacked = (e: any) => {
        if (e.key === 'Enter') {
            setSearchValueStacked(e.target.value!);
            handleSearchStacked(e.target.value);
        }
    }

    // load search data from backend
    const doSearch = async () => {
        try {
            setIsLoading(true);
            const { data: fetchedData } = await instance.post(
                "/getWordCount/",
                {
                    array: searchValueStacked.split(' '),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // repeated on constants.js & Search.tsx & Home.tsx etc...
            const numDaysBackGraphs = 10;

            // TODO
            console.log(fetchedData);
            setStackedLineData(fetchedData);

            /*
            // put backend data into JSON for chart
            // daily count of message per day
            let datasetForChartDailyCount = Array.from({ length: numDaysBackGraphs }, () => 0);
            for (let i = 0; i < fetchedData.ten_day_count.length; i++) {
                let labels = [];
                labels = generateLabelsDailyCount(fetchedData);
                let idx = labels.findIndex((val) => val === fetchedData.ten_day_count[i].date);
                datasetForChartDailyCount[idx] = fetchedData.ten_day_count[i].count; // + 1

                // at night-time it is the next day in UTC, so all data today shows as 0. This comment repeated in 3 places, where we fix this
                if(fetchedData.ten_day_count.length === 9) {
                    console.log('minimizing data');
                    datasetForChartDailyCount.splice(9, 1);
                }
            }
            setChartDataDailyCount({
                labels: dispLabelsDailyCount(fetchedData),
                datasets: [
                    {
                        type: 'line' as const,
                        label: 'Line Chart',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        fill: false,
                        data: datasetForChartDailyCount,
                    }
                ],
            });
            */

            // set various variables
            setGraphStackedLoaded(true);

        } catch (e: any) {
            console.error("try/catch in Search.tsx: ", e);

            if (e && e.response) {
                setErrorSearchStacked(String(e.response.data.body));
            } else {
                setErrorSearchStacked('Unable to connect. Please try again later');
            }

            // setIsLoading(false);
            // setFoundResults(false);
        }
    }

    // @ts-ignore
    // @ts-ignore
    return (

        <IonPage className="bg-sky">

            <Header />

            <IonContent className="bg-gradient-to-b ">

                <IonCard hidden={true}>
                    <div className="pl-2 pt-1">
                        <IonLabel className="text-xl text-blue-600">Compare different words on a graph</IonLabel>

                        {/*TODO hard click...*/}
                        {/*TODO: need loading after click*/}

                        {/* search bar */}
                        <IonSearchbar className="xs-flex text-base text-gray-400 flex-grow outline-none px-2"
                                      type="text"
                                      value={searchValueStacked}
                                      onKeyPress={handleKeyDownStacked}
                                      onIonChange={e => setSearchValueStacked(e.detail.value!)}
                                      animated placeholder="Type to search" disabled={isLoading}
                                      style={{width: '450px'}}
                                      // hidden={width < smallHeaderWitdh && !showMobileSearch}
                        />

                        {/*TODO too big...*/}

                        {/* search button, to do the actual search*/}
                        <div className="text-2xl xs:flex px-2 rounded-lg space-x-4 mx-auto bg-success-1 pb-1 pt-1 cursor-pointer"
                             onClick={() => handleSearchStacked(searchValueStacked)}>
                            <IonIcon slot="icon-only" icon={search} className=" " />
                        </div>

                        <div className=" p-4 h-full text-white shadow-lg rounded-l bg-cbg" hidden={!graphStackedLoaded}>
                            <Chart type='bar' data={stackedLineData} height="200" options={{
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    title: { display: true, text: '# of messages per day (from several Discords)'},
                                    // scales: {
                                    //     yAxes: [{
                                    //         ticks: {
                                    //             beginAtZero: true,
                                    //             display: false,
                                    //             color: 'white'
                                    //         },
                                    //     }],
                                    //     xAxes: [{
                                    //         ticks: {
                                    //             display: false,
                                    //             color: 'white'
                                    //         },
                                    //     }]
                                    // },
                                },
                                responsive: true,
                                maintainAspectRatio: true,
                            }} />
                        </div>

                    </div>
                </IonCard>



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
    );
}

export default Home;
