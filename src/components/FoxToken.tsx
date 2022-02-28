import {
    IonButton,
    IonList,
    IonLabel,
    IonItem,
    IonCheckbox,
    IonInput,
    IonRow,
    IonCol,
    IonItemDivider,
    IonModal,
    IonContent,
    IonHeader,
    IonToolbar, IonTitle, useIonToast, IonIcon
} from '@ionic/react';
import React, {KeyboardEvent, KeyboardEventHandler, useEffect, useMemo, useState} from 'react';
import {Table} from 'antd' // https://ant.design/components/table/
import { ColumnsType } from 'antd/es/table';
import Loader from "./Loader";
import {instance} from "../axios";
import {environment} from "../environments/environment";
import {ChartData} from "chart.js";
import {Chart} from "react-chartjs-2";
import {getDailyCountData} from "../util/charts";
import moment from "moment";
import * as solanaWeb3 from '@solana/web3.js';
import {wallet} from "ionicons/icons";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";


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
    const [mySolBalance, setMySolBalance] = useState("");
    const [mySplTokens, setMySplTokens] = useState([]);
    const walletAddress = useSelector(
        (state: RootState) => state.wallet.walletAddress
    );

    const defaultGraph : ChartData<any, string> = {
        labels: [],
        datasets: [],
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
            sorter: (a, b) => a.name.localeCompare(b.name),
            width: 250,},
        { title: 'Total Token Listings', key: 'totalTokenListings', dataIndex: 'totalTokenListings', width: 250,
            sorter: (a, b) => a.totalTokenListings - b.totalTokenListings,
            responsive: ['md'], // Will not be displayed below 768px
        },
        { title: 'View Chart', key: 'viewChart', width: 150,
            render: record => (
                <span onClick={() => viewChart(record.token, record.name)} className="cursor-pointer big-emoji">📈</span>
            ),
        },
        { title: 'View in Explorer', key: 'viewInExplorer', width: 150,
            render: record => (
                <a target="_blank" className="no-underline big-emoji" href={'https://explorer.solana.com/address/' + record.token} >🌐</a>
            ),
            responsive: ['md'], // Will not be displayed below 768px
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

                    const data = res.data.data;
                    // const newData = [];
                    //
                    //
                    // for(let i in data){
                    //     if(data[i].customName){
                    //         newData.push(data[i]);
                    //     }
                    // }

                    // @ts-ignore
                    setTableData(data);
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

        setFoxLineData(defaultGraph);
        setFoxLineListingsData(defaultGraph);

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

                // think want to keep this in ... some timing ... issue....
                console.log(foxLineData);


                // TODO-rakesh: go to the home page ... go to fox token table ... click view chart ... make sure it SCROLLS TO BOTTOM of page (or scrolls to make the chart the top of the page)
                // window.scrollTo(0,document.body.scrollHeight);

            })
            .catch((err) => {
                console.error("error when getting fox token history data: " + err);
            });

    }

    // https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/create_mint_and_transfer_tokens.ts
    // https://docs.solana.com/es/developing/clients/jsonrpc-api#gettokenaccountsbyowner
    const getUserSpls = async() => {

        // console.log(walletAddress);
        if(!walletAddress) return;

        // https://docs.solana.com/developing/clients/javascript-reference
        let base58publicKey = new solanaWeb3.PublicKey(walletAddress.toString());

        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl('mainnet-beta'),'confirmed',
        );

        // let account = await connection.getAccountInfo(base58publicKey);
        // console.log(account?.data);

        // https://github.com/solana-labs/solana/blob/master/web3.js/examples/get_account_info.js
        let balance = await connection.getBalance(base58publicKey); // SOL balance
        balance = balance / 1000000000;
        // @ts-ignore
        setMySolBalance(balance);

        // https://github.com/michaelhly/solana-py/issues/48
        let tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            base58publicKey,
            {programId: new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")},
        );

        let mySplTokens = [];
        for(let i in tokenAccounts.value){
            if(tokenAccounts.value[i]?.account?.data?.parsed?.info?.tokenAmount.uiAmount !== 0){
                // console.log(tokenAccounts.value[i]);
                mySplTokens.push(tokenAccounts.value[i]?.account?.data?.parsed?.info?.mint);
            }
        }
        // @ts-ignore
        setMySplTokens(mySplTokens);

        // TODO-later: use getTokenSupply?? - Returns the total supply of an SPL Token type. (FF uses this lots)
    }

    // call on load
    useEffect(() => {
        getUserSpls();
    }, []);
    // TODO: not working...
    useEffect(() => {
        getUserSpls();
    }, [walletAddress]);

    /**
     * for submitting custom token names
     */
    const [addNameModalOpen, setAddNameModalOpen] = useState(false);
    const [formToken, setFormToken] = useState('');
    const [formName, setFormName] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [formErrMsg, setFormErrMsg] = useState('');
    const [present, dismiss] = useIonToast();
    const clickedAddName = (val: boolean) => {
        setAddNameModalOpen(val);
    }
    const submittedForm = () => {

        const body = {
            formToken: formToken,
            formName: formName,
        }

        setFormLoading(true);
        setFormErrMsg('');

        instance.post(environment.backendApi + '/receiver/foxTokenNameAdd', body).then(resp => {

            // console.log(resp);

            if(resp.data.error){
                setFormLoading(false);
                if(resp.data.message){
                    setFormErrMsg(resp.data.message);
                }else{
                    setFormErrMsg('An error occurred. Please contact us if this continues to happen');
                }

            }else{
                setFormLoading(false);
                setFormToken('');
                setFormName('');

                clickedAddName(false);

                // show toast
                present({
                    message: 'Successfully added the name. Refresh to see it',
                    color: 'success',
                    duration: 5000
                });
            }

        }).catch(err => {
            console.error(err);

            setFormLoading(false);
            setFormErrMsg(err);
        });
    }

    const viewMyTokens = () => {
        if(!walletAddress){
            present({
                message: 'Please connect to your wallet',
                color: 'danger',
                duration: 5000
            });
            return;
        }

        // make sure they have tokens
        if(mySplTokens.length === 0){

            // show toast
            present({
                message: 'No tokens found on this wallet :(',
                color: 'danger',
                duration: 5000
            });
            return;

            /**
             * TODO
             * - Should be able to allow people to enter in multiples of their wallets, so click one button and see all your tokens
             *       ... have them set their wallet here... or tlel them connect wllet topright...
             *       ... need to do the "add other wallet strings" ....
             * - Will show the # of tokens you have
             * - Will show tokens that aren't in FF as well
             * - Want to try and show the date it was sent to you, will have to figure that out
             *
             */
        }else{
            // new array of data we'll set later
            let newTableData: any = [];

            // loop through tabledata (all fox tokens)
            for(let i in tableData){
                // if match, then push
                // @ts-ignore
                if(mySplTokens.indexOf(tableData[i].token) !== -1){
                    newTableData.push(tableData[i]);
                }
            }

            if(newTableData.length === 0){
                present({
                    message: 'None of your tokens are also listed on FF Token Market :(',
                    color: 'danger',
                    duration: 5000
                });
                return;
            }

            setTableData(newTableData);
        }
    };

    /**
     * Renders
     */

    return (
        <>
            <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>

                <div className={`font-bold pb-1 w-full`}>
                    <a href="https://famousfoxes.com/tokenmarket" className="underline" target="_blank">
                        Fox Token Market - Analysis
                    </a>
                    <IonButton color="success" className="float-right text-sm small-btn pl-5"
                               onClick={() => clickedAddName(true)}>
                        {/*TODO-later: icon...*/}
                        ➕ Add custom name
                    </IonButton>

                    <IonButton color="secondary" className="float-right text-sm small-btn ml-5"
                               onClick={() => viewMyTokens()}>
                        <IonIcon icon={wallet} className="pr-1" />
                        View My Tokens
                    </IonButton>
                    <div hidden={!tableData.length}>
                        👪 are community added names
                    </div>

                    <div className="float-right">

                    </div>
                </div>

                <IonModal
                    isOpen={addNameModalOpen}
                    onDidDismiss={() => setAddNameModalOpen(false)}
                >

                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>
                                Add a Token Name
                                <a className="float-right text-base underline cursor-pointer"
                                   onClick={() => clickedAddName(false)}>close</a>
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className="">

                        <div className="ml-12 mr-12 mb-5 relative mt-6 bg-gradient-to-b from-bg-primary to-bg-secondary p-3 rounded-xl" >
                            <div className="text-lg  font-medium">
                                <p>If a token on Fox Token Market doesn't have an official name yet, and you know for certain what NFT the token is for,
                                    then you can use the below form to add that data</p>
                                <p className="mt-3">Your discord name will be recorded when submitting the form.
                                Those abusing the service will receive such punishments as having your account banned from entering data,
                                with severe violations being permanently muted in the Discord.</p>
                            </div>
                        </div>

                        {/*bg-gradient-to-b from-bg-primary to-bg-secondary"*/}
                        <div className="ml-12 mr-12">

                            <IonItem>
                                <IonLabel className="font-bold">Token</IonLabel>
                                <IonInput onIonChange={(e) => setFormToken(e.detail.value!)}
                                          placeholder="ex. Hxq2zKjAATs28sdXT5rbtKddSU81BzvJtmvZGjFj54iU"></IonInput>
                            </IonItem>

                            <IonItem>
                                <IonLabel className="font-bold">Name</IonLabel>
                                <IonInput onIonChange={(e) => setFormName(e.detail.value!)}
                                          placeholder="ex. Zillas vs Kong WL"></IonInput>
                            </IonItem>

                            <IonButton color="success" className="mt-5" hidden={formLoading}
                                       onClick={() => submittedForm()}>
                                Submit
                            </IonButton>

                            <div hidden={!formLoading}>Loading...</div>

                            <div className="m-12 relative mt-6 bg-red-100 p-6 rounded-xl" hidden={!formErrMsg}>
                                <p className="text-lg text-red-700 font-medium">
                                    <b>{formErrMsg}</b>
                                </p>
                                <span className="absolute bg-red-500 w-8 h-8 flex items-center justify-center font-bold text-green-50 rounded-full -top-2 -left-2">
                                    !
                                </span>
                            </div>

                        </div>


                    </IonContent>
                </IonModal>

                <div>
                {
                    !tableData.length
                        ?   <div className="pt-10 flex justify-center items-center">
                                <Loader />
                            </div>
                        : <div className=" ">

                            {/*TODO-later: show only names (have a TODO on top as well for the data :*/}
                            {/*<IonItem style={{"width": "250px"}}>*/}
                            {/*    <IonLabel>Show Verified Only</IonLabel>*/}
                            {/*    <IonCheckbox onIonChange={e => setCheckedVerifiedOnly(e.detail.checked)} />*/}
                            {/*</IonItem>*/}

                            <div  >
                                <Table
                                    className='pt-2'
                                    rowKey={'token'}
                                    dataSource={tableData}
                                    columns={columns}
                                    bordered
                                    // scroll={{x: 'max-content'}}

                                    scroll={{y: 400}}
                                    // scroll={{y: 22}} // if want show it off / shill

                                    // This both x & y aren't working together properly in our project. I tested out on codesandbox. It works perfectly there!!!
                                    // scroll={{x: 'max-content', y: 400}}
                                    pagination={false}
                                    style={{width: '100%', margin: '0 auto', textAlign: 'center'}}
                                />
                            </div>

                            <div className="gap-4 mb-4 grid grid-cols-12 mt-3"
                                 // @ts-ignore
                                 hidden={foxLineData.labels.length === 0}>
                                <div className='chart' >

                                    <Chart type='line'
                                       // @ts-ignore
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

