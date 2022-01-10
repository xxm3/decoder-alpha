import Loader from '../components/Loader';
import Display from '../components/Display';
import {useState, useEffect, useContext} from 'react';
import {Message} from '../data/messages';
import {
    IonContent,
    IonPage,
    IonSearchbar,
    IonButton,
} from '@ionic/react';
import './Search.css';
import faker from 'faker';
import {setTimeout} from 'timers';
import {MessageContext} from '../context/context';
import MobileDisplay from '../components/MobileDisplay';
import {environment} from "../environments/environment";

const Search: React.FC = () => {

    const {messages, setMessages, setWord} = useContext(MessageContext);

    const [total, setTotal] = useState(0);

    const [showHelp, setShowHelp] = useState(true);
    const [width, setWidth] = useState(window.innerWidth);
    window.onresize = () => {
        setWidth(window.innerWidth);
        console.log(window.innerWidth);
    };

    function re() {
        setWidth(window.innerWidth);
    }

    const [searchText, setSearchText] = useState('');
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
                data: labels.map(() => faker.datatype.number({min: -1000, max: 1000})),
            },
            {
                type: 'bar' as const,
                label: 'Bar Graph',
                backgroundColor: 'rgb(75, 192, 192)',
                data: labels.map(() => faker.datatype.number({min: -1000, max: 1000})),
                borderColor: 'white',
                borderWidth: 2,
            }
        ],
    });

    const onClick = async (e: any) => {
        e.preventDefault();
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
                // console.log(data);

                return data;
            });
            if (res.status !== 200 || fetchedData?.error) {
                setIsLoading(false);
                throw fetchedData;
            }
            let smaple = fetchedData;
            setTotal(smaple.totalCount);

            setDoughnutData({
                ...doughnutData,
                // labels: smaple.ten_day_count.map(x => x.date),
                // datasets: [
                //     {
                //         label: '10 days count',
                //         data: smaple.ten_day_count.map(x => x.count),
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

            const handleKeyDown = (event) => {
                if (event.key === 'Enter') {
                    onClick(event);
                }
            }

            var datasetForChart = Array.from({length: 10}, () => 0)
            for (let i = 0; i < smaple.ten_day_count.length; i++) {
                var labels = [];
                labels = generateLabels();
                var idx = labels.findIndex((val) => val === smaple.ten_day_count[i].date);
                datasetForChart[idx] = smaple.ten_day_count[i].count;
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
            smaple.messages.forEach((msg, idx) => {
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
            smaple.messages.forEach((msg, idx) => {
                let msgg: Message = {
                    message: msg.message,
                    id: idx,
                    time: msg.time,
                }
                tempMsg.push(msgg);
            });
            setWord(smaple.word);
            setMessages(tempMsg);
            setTimeout(() => {
                setIsLoading(false)
            }, 2000);
        } catch (e) {
            console.error(e);

            setIsLoading(false);
            setError(String(e.body));
            setFoundResults(false);
        }
    }
    useEffect(() => {
        // console.log("Inside useEffect");
        // console.log(error);
    }, [error]);
    useEffect(() => {
        // console.log(error);
        // console.log({messages});

        window.addEventListener('resize', re);
        return () => window.removeEventListener('resize', re);
    }, []);

    return (

        <IonPage id="home-page">

            <IonContent fullscreen>

                <div className="min-h-screen font-sans  bg-gradient-to-b from-tp to-tg flex justify-center items-center p-4 pt-2">

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
                            <div className="xs:flex items-center bg-cbgd rounded-lg overflow-hidden px-2 py-1 justify-between">
                                <IonSearchbar className="xs-flex text-base text-gray-400 flex-grow outline-none px-2 "
                                              type="text" value={searchText} onIonChange={e => {
                                    setSearchText(e.detail.value!)
                                }} animated placeholder="Add text to search" disabled={isLoading}/>
                                <div className="xs:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                    <IonButton className=" text-white text-base rounded-lg" onClick={onClick}
                                               animate-bounce disabled={searchText === ''}>
                                        Search</IonButton>
                                </div>
                            </div>
                        </form>

                        {/* loading bar */}
                        {isLoading && (<div className="pt-10 flex justify-center items-center">
                            <Loader></Loader>
                        </div>)}

                        {/* results, based on screen width */}
                        {!isLoading && foundResults && width > 1536 && (
                            <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                     height={Number(10 + 65)} total={total} totalCountHeight={18} showPie={false}
                                     width={width}></Display>
                        )}
                        {!isLoading && foundResults && width <= 1536 && width > 1280 && (
                            <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                     height={Number(75 + 10)} total={total} totalCountHeight={22} showPie={false}
                                     width={width}></Display>
                        )}
                        {!isLoading && foundResults && width <= 1280 && width > 1024 && (
                            <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                     height={Number(5 + 100)} total={total} totalCountHeight={25} showPie={false}
                                     width={width}></Display>

                        )}
                        {!isLoading && foundResults && width <= 1024 && width > 768 && (
                            <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                     height={Number(5 + 100)} total={total} totalCountHeight={28} showPie={false}
                                     width={width}></Display>

                        )}
                        {!isLoading && foundResults && width <= 768 && width > 640 && (
                            <Display chartData={chartData} doughnutData={doughnutData} position='bottom'
                                     height={Number(5 + 225)} total={total} totalCountHeight={35} showPie={false}
                                     width={width}></Display>

                        )}
                        {!isLoading && foundResults && width <= 640 && (
                            <MobileDisplay chartData={chartData} doughnutData={doughnutData} position='right'
                                           height={Number(30 + 275)} total={total} totalCountHeight={30} showPie={false}
                                           width={width}></MobileDisplay>
                        )}

                        {/* error bar */}
                        {!isLoading && !foundResults && error !== '' && (
                            <div className="relative mt-6 bg-red-100 p-6 rounded-xl">
                                <p className="text-lg text-red-700 font-medium"><b>{error}</b></p>
                                <span
                                    className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">!</span>
                                <div className="absolute top-0 right-0 flex space-x-2 p-4">
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default Search;
