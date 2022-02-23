import {
    IonButton,
    IonList,
    IonLabel, IonItem, IonCheckbox, IonInput, IonRow, IonCol, IonItemDivider
} from '@ionic/react';
import React, {KeyboardEvent, KeyboardEventHandler, useEffect, useMemo, useState} from 'react';
import {Table} from 'antd' // https://ant.design/components/table/
import { ColumnsType } from 'antd/es/table';
import Loader from "./Loader";
import {instance} from "../axios";
import {environment} from "../environments/environment";
import axios from "axios";
import {ChartData} from "chart.js";
import {Chart} from "react-chartjs-2";
import {getDailyCountData} from "../util/charts";
import moment from "moment";

interface FoxToken {
    foo?: string;
    onSubmit(bar: string): unknown;
}

function FoxToken({ foo, onSubmit }: FoxToken) {

    /**
     * States & Variables
     */
    const [width, setWidth] = useState(window.innerWidth);

    const [tableData, setTableData] = useState([]);

    const [tokenClickedOn, setTokenClickedOn] = useState();

    const defaultGraph : ChartData<any, string> = {
        labels: ["1"],
        datasets: [ { data: ["3"] } ],
    };
    const [foxLineData, setFoxLineData] = useState(defaultGraph);
    const [foxLineListingsData, setFoxLineListingsData] = useState(defaultGraph);

    const columns: ColumnsType<any> = [
        { title: 'Token', key: 'token', // dataIndex: 'token',
            render: record => (
                <>
                    <span hidden={width < 768}>{record.token}</span>
                    <span hidden={width > 768}>{record.token.substr(0, 4) + '...' + record.token.substr(record.token.length -4)}</span>
                </>

            ),
            sorter: (a, b) => a.token.localeCompare(b.token),
            // width: 130,
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        { title: 'Floor Price', key: 'floorPrice', dataIndex: 'floorPrice', width: 150,
            sorter: (a, b) => a.floorPrice - b.floorPrice,},
        { title: 'Name', key: 'name', dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),},
        { title: 'Total Token Listings', key: 'totalTokenListings', dataIndex: 'totalTokenListings', width: 250,
            sorter: (a, b) => a.totalTokenListings - b.totalTokenListings,
            responsive: ['md'], // Will not be displayed below 768px
        },
        { title: 'View Supply in Explorer', key: '', width: 250,
            render: record => (
                <a target="_blank" href={'https://explorer.solana.com/address/' + record.token} >View</a>
            ),
            responsive: ['md'], // Will not be displayed below 768px
        },
        { title: 'View Chart', key: '', width: 250,
            render: record => (
                <a onClick={() => viewChart(record.token, record.name)} className="cursor-pointer">View</a>
            ),
        }

    ];

    /**
     * Use Effects
     */
    useEffect(() => {
        const fetchTableData = async () => {

            setTableData([]);

            instance
                .get(environment.backendApi + '/receiver/foxTokenAnalysis')
                .then((res) => {
                    setTableData(res.data.data);
                })
                .catch((err) => {
                    console.error("error when getting fox token data: " + err);
                });
        }
        fetchTableData();
    }, []);

    // resize window
    useEffect(() => {
        function resizeWidth() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', resizeWidth);
        return () => window.removeEventListener('resize', resizeWidth);
    }, []);

    /**
     * Functions
     */
    // user wants to only see verified collections
    const setCheckedVerifiedOnly = (e: any) => {

    }

    // viewing the chart for a token
    const viewChart = (token: string, name: string) => {

        // @ts-ignore
        setTokenClickedOn(name ? `${name} (${token})` : token);

        instance
            .get(environment.backendApi + '/receiver/foxTokenHistory?token=' + token)
            .then((res) => {

                const labels = res.data.map( (el: { createdAt: any; }) => moment(el.createdAt).fromNow());

                const lineData = res.data.map( (el: { floorPrice: any; }) => parseFloat(el.floorPrice));
                // console.log(lineData);
                let datasetsAry = [{
                    type: 'line' as const,
                    label: 'Floor Price',
                    borderColor: 'white',
                    borderWidth: 2,
                    fill: false,
                    data: lineData,
                }];

                const listingsData = res.data.map( (el: { totalTokenListings: any; }) => parseInt(el.totalTokenListings));
                // console.log(listingsData);
                let datasetsAryListings = [{
                    type: 'line' as const,
                    label: 'Total Token Listings',
                    borderColor: 'blue',
                    borderWidth: 2,
                    fill: false,
                    data: listingsData,
                }];

                // console.log(labels);
                // console.log(datasetsAry);
                // console.log(datasetsAryListings);

                setFoxLineData({
                    labels: labels,
                    datasets: datasetsAry
                });
                setFoxLineListingsData({
                    labels: labels,
                    datasets: datasetsAryListings
                });

                // TODO: wait for rak for scroll bottom:...
                // window.scrollTo(0,document.body.scrollHeight);

            })
            .catch((err) => {
                console.error("error when getting fox token history data: " + err);
            });

    }

    /**
     * Renders
     */

    return (
        <>
            <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>

                <div className={`font-bold pb-1 w-full`}><a href="https://famousfoxes.com/tokenmarket" className="underline" target="_blank">Fox Token Market - Analysis</a></div>
                {/*<p></p>*/}

                {/* TODO: need a "add name" button */}

                <div>
                {
                    !tableData.length
                        ?   <div className="pt-10 flex justify-center items-center">
                                <Loader />
                            </div>
                        : <div className=" ">

                            {/*TODO: show verified:*/}
                            {/*<IonItem style={{"width": "250px"}}>*/}
                            {/*    <IonLabel>Show Verified Only</IonLabel>*/}
                            {/*    <IonCheckbox onIonChange={e => setCheckedVerifiedOnly(e.detail.checked)} />*/}
                            {/*</IonItem>*/}

                            <div  >
                                <Table
                                    className='pt-2'
                                    key={'name'}
                                    dataSource={tableData}
                                    columns={columns}
                                    bordered
                                    // scroll={{x: 'max-content'}}

                                    scroll={{y: 400}}
                                    // scroll={{y: 22}} // if want show it off

                                    // This both x & y aren't working together properly in our project. I tested out on codesandbox. It works perfectly there!!!
                                    // scroll={{x: 'max-content', y: 400}}
                                    pagination={false}
                                    style={{width: '100%', margin: '0 auto', textAlign: 'center'}}
                                />
                            </div>

                            <div className="gap-4 mb-4 grid grid-cols-12 mt-3" >
                                <div className='chart' >

                                    <Chart type='line'
                                       // @ts-ignore
                                       hidden={foxLineData.labels.length == 1}
                                       data={foxLineData} height='150'
                                       options={{
                                           responsive: true,
                                           maintainAspectRatio: true,
                                           plugins: {
                                               legend: {
                                                   display: false
                                               },
                                               title: { display: true, text: tokenClickedOn + " - Price" },
                                           },
                                           scales: {
                                               x: {
                                                   ticks: {
                                                       autoSkip: true,
                                                       maxTicksLimit: 8
                                                   }
                                               },
                                               y: {
                                                   suggestedMin: 0,
                                               },
                                           }
                                       }} />
                                </div>
                                <div className="chart">
                                    <Chart type='line'
                                        // @ts-ignore
                                           hidden={foxLineListingsData.labels.length == 1}
                                           data={foxLineListingsData} height='150'
                                           options={{
                                               responsive: true,
                                               maintainAspectRatio: true,
                                               plugins: {
                                                   legend: {
                                                       display: false
                                                   },
                                                   title: { display: true, text: 'Total Token Listings'},
                                               },
                                               scales: {
                                                   x: {
                                                       ticks: {
                                                           autoSkip: true,
                                                           maxTicksLimit: 8
                                                       }
                                                   },
                                                   y: {
                                                       suggestedMin: 0,
                                                   },
                                               }
                                           }} />
                                </div>
                            </div>

                            <br/>

                        </div>
                }
                </div>



                <div hidden={true}
                     className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>
                    <div className={`font-bold pb-3 w-full text-lg`}>Fox Token - Price Alerts</div>

                    <div>
                        <label className={`font-bold pb-1 w-full`} htmlFor="">Get an alert when any of your WL tokens lists over a certain price</label>

                        <IonList>
                            <b>Wallet Address</b>
                            <IonItem>
                                <IonInput placeholder="Enter Wallet Address to Monitor" ></IonInput>
                                {/* value={text} onIonChange={e => setText(e.detail.value!)} */}
                            </IonItem>
                        </IonList>

                        <IonList>
                            <b>Floor price of any of your WL tokens before alert</b>
                            <IonItem>
                                <IonInput placeholder="Enter price" ></IonInput>
                                {/* value={text} onIonChange={e => setText(e.detail.value!)} */}
                            </IonItem>
                        </IonList>

                        <IonButton color="success" className="text-sm" >
                            Submit
                        </IonButton>
                        <br/><br/>


                    </div>

                </div>

                <br/>

            </div>

        </>
    );
}
export default FoxToken;

