import React, {useState} from 'react';
import './Home.css';
import moment from "moment";
import { AppComponentProps } from '../../components/Route';
import SearchedWords from './SearchedWords';

const Home : React.FC<AppComponentProps> = ({ contentRef }) => {

    /**
     * States & Variables
     */
    /**
     * Use Effects
     */

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
    // const fetchHomePageData = () => {
    //     setIsLoading(true);
    //     instance
    //         .get(environment.backendApi + '/homeData')
    //         .then((res) => {
    //             setHomePageData(res.data.data.possibleMintLinks);
    //             setNewCollection(res.data.data.new_collections);
    //             setPopularCollection(res.data.data.popular_collections);
    //             // console.log("res1----------------", homePageData);
    //
    //             setIsLoading(false);
    //         })
    //         .catch((err) => {
    //             setIsLoading(false);
    //             console.error("error when getting home page data: " + err);
    //         });
    // };

    const getDateAgo = function (time: any){
        return moment(time).fromNow();
    }

    /**
     * Renders
     */

    return (
        <>
            <div className="m-3 relative bg-primary p-4 rounded-xl">
                <p className="text-medium text-white font-medium">
                    <b>
                        Welcome to the new SOL Decoder! New info. will be displayed on the home page here in the coming week(s), such as:
                        <br/>- New mints coming out in the next few hours
                        <br/>- New WL Tokens that were added today (both officially by Fox Token, and by users)
                        <br/>- The latest 3 Mint alerts, and top Mint alerts we gave this week, and this month
                        <br/>- New & Trending words people put into Discord (ie. new & trending NFTs)
                        <br/>- Things other people searched on
                        <br/>- plus other things as we develop them!
                    </b>
                </p>
                <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                    :)
                </span>
            </div>
            <SearchedWords />



            {/* if need to tell the user of errors */}

            {/*<div className="m-3 relative bg-red-100 p-4 rounded-xl">*/}
            {/*    <p className="text-lg text-red-700 font-medium">*/}
            {/*        <b>Our Discord ingestion bots decided to take a break from Thurs @ 10:00pm est until Friday @ 9:00am est. They are back up and running now.</b>*/}
            {/*    </p>*/}
            {/*    <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">*/}
            {/*        !*/}
            {/*    </span>*/}
            {/*</div>*/}




            {/* Possible Mints ... */}

            {/*{false && (*/}
            {/*    <>*/}
            {/*        <IonCard>*/}
            {/*            <IonLabel className="text-4xl text-blue-600">*/}
            {/*                Possible Mints*/}
            {/*            </IonLabel>*/}

            {/*            {isLoading && (*/}
            {/*                <div className="pt-10 flex justify-center items-center">*/}
            {/*                    <Loader />*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*            <div hidden={isLoading}>*/}
            {/*                {homePageData.map((product: any, index: any) => (*/}
            {/*                    <>*/}
            {/*                        <Card*/}
            {/*                            key={index}*/}
            {/*                            url={product.url}*/}
            {/*                            readableTimestamp={getDateAgo(*/}
            {/*                                product.timestamp*/}
            {/*                            )}*/}
            {/*                            source={product.source}*/}
            {/*                        />*/}
            {/*                    </>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        </IonCard>*/}
            {/*        <div>*/}
            {/*            <IonRow>*/}
            {/*                <IonLabel className="text-4xl text-blue-600">*/}
            {/*                    New Collection*/}
            {/*                </IonLabel>*/}
            {/*            </IonRow>*/}

            {/*            /!* loading bar *!/*/}
            {/*            {isLoading && (*/}
            {/*                <div className="pt-10 flex justify-center items-center">*/}
            {/*                    <Loader />*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*            <div hidden={!isLoading}>*/}
            {/*                <IonRow className="bg-lime-700">*/}
            {/*                    {newCollections.map(*/}
            {/*                        (collection: any, index: any) => (*/}
            {/*                            <IonCol>*/}
            {/*                                <CollectionCard*/}
            {/*                                    key={index}*/}
            {/*                                    name={collection.name}*/}
            {/*                                    description={*/}
            {/*                                        collection.description*/}
            {/*                                    }*/}
            {/*                                    image={collection.image}*/}
            {/*                                    website={collection.website}*/}
            {/*                                    twitter={collection.twitter}*/}
            {/*                                    discord={collection.discord}*/}
            {/*                                    categories={*/}
            {/*                                        collection.categories*/}
            {/*                                    }*/}
            {/*                                    splitName={collection.splitName}*/}
            {/*                                    link={collection.link}*/}
            {/*                                    timestamp={collection.timestamp}*/}
            {/*                                    readableTimestamp={*/}
            {/*                                        collection.readableTimestamp*/}
            {/*                                    }*/}
            {/*                                />*/}
            {/*                            </IonCol>*/}
            {/*                        )*/}
            {/*                    )}*/}
            {/*                </IonRow>*/}

            {/*                <IonRow>*/}
            {/*                    <IonLabel className="text-4xl text-blue-600">*/}
            {/*                        Popular Collection*/}
            {/*                    </IonLabel>*/}
            {/*                </IonRow>*/}

            {/*                <IonRow>*/}
            {/*                    {popularCollections.map(*/}
            {/*                        (collection: any, index) => (*/}
            {/*                            <IonCol>*/}
            {/*                                <CollectionCard*/}
            {/*                                    key={index}*/}
            {/*                                    name={collection.name}*/}
            {/*                                    description={*/}
            {/*                                        collection.description*/}
            {/*                                    }*/}
            {/*                                    image={collection.image}*/}
            {/*                                    website={collection.website}*/}
            {/*                                    twitter={collection.twitter}*/}
            {/*                                    discord={collection.discord}*/}
            {/*                                    categories={*/}
            {/*                                        collection.categories*/}
            {/*                                    }*/}
            {/*                                    splitName={collection.splitName}*/}
            {/*                                    link={collection.link}*/}
            {/*                                    timestamp={collection.timestamp}*/}
            {/*                                    readableTimestamp={*/}
            {/*                                        collection.readableTimestamp*/}
            {/*                                    }*/}
            {/*                                />*/}
            {/*                            </IonCol>*/}
            {/*                        )*/}
            {/*                    )}*/}
            {/*                </IonRow>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)}*/}


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

        </>
    );
};

export default Home;
