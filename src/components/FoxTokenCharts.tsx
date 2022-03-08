import { ChartData } from 'chart.js';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { instance } from '../axios';
import { environment } from '../environments/environment';
import { FoxTokenData } from '../types/FoxTokenTypes';
import Style from './Style';
import Cookies from "universal-cookie";


function FoxTokenCharts({ token , name, floorPrice, totalTokenListings,} : FoxTokenData) {


    /**
     * States & Variables
     */
    const [width, setWidth] = useState(window.innerWidth);

    // for setting height of chart, depending on what width browser is
    // (below was for 2 charts in one row)
    // const tableHeight = useMemo(() => {
    //     if (width > 1536) return 150;
    //     if (width > 1280) return 180;
    //     if (width > 1024) return 220;
    //     if (width > 768) return 260;
    //     if (width > 640) return 280;
    //     return 330;
    // }, [width]);
    const tableHeight = useMemo(() => {
        if (width > 1536) return 120;
        if (width > 1280) return 160;
        if (width > 1024) return 200;
        if (width > 768) return 240;
        if (width > 640) return 260;
        return 310;
    }, [width]);

    const [tableData, setTableData] = useState<FoxTokenData[]>([]);
    const [fullTableData, setFullTableData] = useState<FoxTokenData[]>([]);
    const [tokenClickedOn, setTokenClickedOn] = useState();
    const [mySolBalance, setMySolBalance] = useState("");

    const [mySplTokens, setMySplTokens]: any = useState([]);

    const [viewMyTokensClicked, setViewMyTokensClicked] = useState(false);

    const smallWidthpx = 768;

    const defaultGraph: ChartData<any, string> = {
        labels: [],
        datasets: [],
    };
    const [foxLineData, setFoxLineData] = useState(defaultGraph);
    const [foxLineListingsData, setFoxLineListingsData] = useState(defaultGraph);

    const chartsRef = useRef<HTMLDivElement | null>(null);

    const firstUpdate = useRef(true);

    const cookies = useMemo(() => new Cookies(), []);


    // user clicked change colour
    const [lineColorSelected, setLineColorSelected] = useState<string>(cookies.get('lineColorSelected') ? cookies.get('lineColorSelected') : "#14F195"); // #195e83
    const [shadedAreaColorSelected, setShadedAreaColorSelected] = useState<string>(cookies.get('shadedAreaColorSelected') ? cookies.get('shadedAreaColorSelected') : "#01FF6F")
    // when above clicked, will redraw the chart
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        cookies.set('lineColorSelected', lineColorSelected);
        cookies.set('shadedAreaColorSelected', shadedAreaColorSelected);

        // redraw the chart
        // viewChart();


        // present({
        //     message: 'After setting a valid color, load a new chart to see it',
        //     color: 'success',
        //     duration: 5000
        // });

    }, [lineColorSelected, shadedAreaColorSelected]);


    // user clicked the radio for the dates in the chart
    const [chartDateSelected, setChartDateSelected] = useState<string>(cookies.get('chartDateFormat') ? cookies.get('chartDateFormat') : 'fromNow');
    // when above radio clicked, will redraw the chart
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        cookies.set('chartDateFormat', chartDateSelected);

        // redraw the chart
        viewChart();
    }, [chartDateSelected]);



    // viewing the chart for a token
    const viewChart = () => { // token: string, name: string

        setFoxLineData(defaultGraph);
        setFoxLineListingsData(defaultGraph);

        // @ts-ignore
        setTokenClickedOn(name ? `${name} (${token})` : token);

        instance
            .get(environment.backendApi + '/receiver/foxTokenHistory?token=' + token)
            .then((res) => {

                const labels = res.data.map((el: { createdAt: any; }) => {

                    // user can set this in the chart
                    if(chartDateSelected === 'fromNow'){
                        return moment(el.createdAt).fromNow()
                    }else{
                        return moment(el.createdAt).format('MM-DD HH:MM');
                    }

                });
                const lineData = res.data.map((el: { floorPrice: any; }) => {
                    return parseFloat(el.floorPrice);
                });

                const listingsData = res.data.map((el: { totalTokenListings: any; }) => parseInt(el.totalTokenListings));
                // console.log(listingsData);

                // graph latest point...
                for(let t in tableData){
                    if(tableData[t].token === token && tableData[t].floorPrice){
                        labels.push('a few seconds ago');
                        lineData.push(tableData[t].floorPrice);
                        listingsData.push(tableData[t].totalTokenListings);
                        break;
                    }
                }

                // console.log(labels);
                // console.log(lineData);

                let datasetsAry = [
                    {
                        type: 'line' as const,
                        yAxisID: 'y1',
                        label: 'Listings',
                        borderColor: '#9945FF', // # purple #9945FF    #14F195
                        borderWidth: 2,
                        // fill: {
                        //     target: 'origin',
                        //     above: shadedAreaColorSelected,  // 195e83  // Area will be red above the origin
                        //     // below: ''    // And blue below the origin
                        // },
                        data: listingsData,
                    },
                    {
                        type: 'line' as const,
                        label: 'Price',
                        yAxisID: 'y0',
                        borderColor: lineColorSelected,
                        borderWidth: 2,
                        fillOpacity: .3,
                        fill: {
                            target: 'origin',
                            above: shadedAreaColorSelected,   // Area will be red above the origin
                            // below: ''    // And blue below the origin
                        },
                        data: lineData,
                    },

                ];

                // let datasetsAryListings = [];

                // console.log(labels);
                // console.log(datasetsAry);
                // console.log(datasetsAryListings);

                setFoxLineData({
                    labels: labels,
                    datasets: datasetsAry
                });
                // setFoxLineListingsData({
                //     labels: labels,
                //     datasets: datasetsAryListings
                // });

                // contentRef?.scrollToPoint(0, chartsRef.current?.offsetTop ?? 0, 800)

            })
            .catch((err) => {
                console.error("error when getting fox token history data: " + err);
            });

    }




    // old stuff from parth...

	// const defaultGraph: ChartData<any, string> = {
    //     labels: [],
    //     datasets: [],
    // };
	// const [foxLineData, setFoxLineData] = useState(defaultGraph);
    // const [foxLineListingsData, setFoxLineListingsData] = useState(defaultGraph);
    //
    //
	// const chartsRef = useRef<HTMLDivElement | null>(null);
    //
    //
	// useEffect(() => {
	// 	if(token){
	// 		viewChart(token)
	// 	}
	// }, [token])
    // // viewing the chart for a token
    // const viewChart = (token : string) => {
    //     // token: string, name: string
    //
    //     setFoxLineData(defaultGraph);
    //     setFoxLineListingsData(defaultGraph);
    //
    //     instance
    //         .get(
    //             environment.backendApi +
    //                 '/receiver/foxTokenHistory?token=' +
    //                 token
    //         )
    //         .then((res) => {
    //             const labels = res.data.map((el: { createdAt: any }) => {
    //                 return moment(el.createdAt).fromNow();
    //             });
    //             const lineData = res.data.map((el: { floorPrice: any }) => {
    //                 return parseFloat(el.floorPrice);
    //             });
    //
    //             const listingsData = res.data.map(
    //                 (el: { totalTokenListings: any }) =>
    //                     parseInt(el.totalTokenListings)
    //             );
    //
    //
	// 			labels.push('a few seconds ago');
	// 			lineData.push(floorPrice);
	// 			listingsData.push(totalTokenListings);
    //
    //             let datasetsAry = [
    //                 {
    //                     type: 'line' as const,
    //                     label: 'Floor Price',
    //                     borderColor: '#195e83', // #14F195
    //                     borderWidth: 2,
    //                     fill: {
    //                         target: 'origin',
    //                     },
    //                     data: lineData,
    //                 },
    //             ];
    //
    //             let datasetsAryListings = [
    //                 {
    //                     type: 'line' as const,
    //                     label: 'Total Token Listings',
    //                     borderColor: '#195e83', // #14F195
    //                     borderWidth: 2,
    //                     fill: {
    //                         target: 'origin',
    //                     },
    //                     data: listingsData,
    //                 },
    //             ];
    //
    //             // console.log(labels);
    //             // console.log(datasetsAry);
    //             // console.log(datasetsAryListings);
    //
    //             setFoxLineData({
    //                 labels: labels,
    //                 datasets: datasetsAry,
    //             });
    //             setFoxLineListingsData({
    //                 labels: labels,
    //                 datasets: datasetsAryListings,
    //             });
	// 			chartsRef.current?.scrollIntoView({ behavior: 'smooth' });
    //
    //         })
    //         .catch((err) => {
    //             console.error(
    //                 'error when getting fox token history data: ' + err
    //             );
    //         });
    //
    //
    // };


    return (
        <>
		<Style>
			{`
				.foxTokenCharts {
					background-color: var(--ion-color-step-50);
				}

			`}
		</Style>
        	<div className="foxTokenCharts px-5 gap-4 grid grid-cols-12" ref={chartsRef}>


                <div className="chart">
                    <Chart
                        type="line"
                        data={foxLineData}
                        height={tableHeight}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    display: true,
                                },
                                title: {
                                    display: true,
                                    text: tokenClickedOn
                                        ? tokenClickedOn + ' - Price' : 'Price',
                                },
                                // tooltip: {
                                //     enabled: true,
                                //     usePointStyle: true,
                                //     callbacks: {
                                //         // To change title in tooltip
                                //         title: (data: any) => { return data[0].parsed.x },
                                //
                                //         // To change label in tooltip
                                //         label: (data: any) => {
                                //             console.log(data);
                                //             return data.parsed.y === 2 ? "Good" : "Critical"
                                //         }
                                //     },
                                // },
                            },
                            scales: {
                                // x: { // TODO
                                //     ticks: {
                                //         autoSkip: true,
                                //         maxTicksLimit: 8,
                                //     },
                                //     // gridLines: {
                                //     //     display: true,
                                //     // },
                                // },
                                // y: {
                                //     suggestedMin: 0,
                                // },
                                yAxes: [{
                                    // stacked: true,
                                    display: true,
                                    position: 'left',
                                    type: 'linear',
                                    scaleLabel: {
                                        display: true,
                                    },
                                    // gridLines : {
                                    //     display : true
                                    // },
                                    id: 'y1',
                                    // ticks: {
                                    //     beginAtZero:true,
                                    //     // callback: function (tick, index, ticks) {
                                    //     //     return numeral(tick).format('(0,0)');
                                    //     // },
                                    // }
                                }, {
                                    // stacked: false,
                                    display: true,
                                    position: 'right',
                                    type: 'linear',
                                    id: 'y0',
                                    // ticks: {
                                    //     max: 10,
                                    //     stepSize: 1,
                                    //     display: true,
                                    //     beginAtZero: true,
                                    //     fontSize: 13,
                                    //     padding: 10,
                                    //     // callback: function (tick, index, ticks) {
                                    //     //     return numeral(tick).format('$ 0,0');
                                    //     // }
                                    // }
                                }]
                            },
                            elements: {
                                point:{
                                    radius: 0
                                }
                            }
                        }}
                    />
                </div>


                {/*old stuff from parth...*/}

                {/*<div className="chart sm:col-span-12 lg:col-span-6">*/}
	            {/*    <Chart*/}
	            {/*        type="line"*/}
	            {/*        // @ts-ignore*/}
	            {/*        data={foxLineData}*/}
	            {/*        height={150}*/}
	            {/*        options={{*/}
	            {/*            responsive: true,*/}
	            {/*            maintainAspectRatio: true,*/}
	            {/*            plugins: {*/}
	            {/*                legend: {*/}
	            {/*                    display: false,*/}
	            {/*                },*/}
	            {/*                title: {*/}
	            {/*                    display: true,*/}
	            {/*                    text: 'Price',*/}
	            {/*                },*/}
	            {/*                // tooltip: {*/}
	            {/*                //     enabled: true,*/}
	            {/*                //     usePointStyle: true,*/}
	            {/*                //     callbacks: {*/}
	            {/*                //         // To change title in tooltip*/}
	            {/*                //         title: (data: any) => { return data[0].parsed.x },*/}
	            {/*                //*/}
	            {/*                //         // To change label in tooltip*/}
	            {/*                //         label: (data: any) => {*/}
	            {/*                //             console.log(data);*/}
	            {/*                //             return data.parsed.y === 2 ? "Good" : "Critical"*/}
	            {/*                //         }*/}
	            {/*                //     },*/}
	            {/*                // },*/}
	            {/*            },*/}
	            {/*            scales: {*/}
	            {/*                x: {*/}
	            {/*                    ticks: {*/}
	            {/*                        autoSkip: true,*/}
	            {/*                        maxTicksLimit: 8,*/}
	            {/*                    },*/}
	            {/*                },*/}
	            {/*                y: {*/}
	            {/*                    suggestedMin: 0,*/}
	            {/*                },*/}
	            {/*            },*/}
	            {/*        }}*/}
	            {/*    />*/}
	            {/*</div>*/}
	            {/*<div className="chart sm:col-span-12 lg:col-span-6">*/}
	            {/*    <Chart*/}
	            {/*        type="line"*/}
	            {/*        data={foxLineListingsData}*/}
	            {/*        height={150}*/}
	            {/*        options={{*/}
	            {/*            responsive: true,*/}
	            {/*            maintainAspectRatio: true,*/}
	            {/*            plugins: {*/}
	            {/*                legend: {*/}
	            {/*                    display: false,*/}
	            {/*                },*/}
	            {/*                title: {*/}
	            {/*                    display: true,*/}
	            {/*                    text: 'Total Token Listings',*/}
	            {/*                },*/}
	            {/*            },*/}
	            {/*            scales: {*/}
	            {/*                x: {*/}
	            {/*                    ticks: {*/}
	            {/*                        autoSkip: true,*/}
	            {/*                        maxTicksLimit: 8,*/}
	            {/*                    },*/}
	            {/*                },*/}
	            {/*                y: {*/}
	            {/*                    suggestedMin: 0,*/}
	            {/*                },*/}
	            {/*            },*/}
	            {/*        }}*/}
	            {/*    />*/}
	            {/*</div>*/}


	        </div>
        </>
    );
}

export default FoxTokenCharts;
