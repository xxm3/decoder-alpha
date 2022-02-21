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

interface FoxToken {
    foo?: string;
    onSubmit(bar: string): unknown;
}

function FoxToken({ foo, onSubmit }: FoxToken) {

    /**
     * States & Variables
     */
    const [tableData, setTableData] = useState([])

    const columns: ColumnsType<any> = [
        { title: 'Token', key: 'token', dataIndex: 'token',
            // render: record => (
            //     <span>{record.createdAt.substring(0, 10)}</span>
            // ),
            sorter: (a, b) => a.token.localeCompare(b.token),
            // width: 130,
            // responsive: ['xs', 'sm'], // Will be displayed on every size of screen
        },
        { title: 'Floor Price', key: 'floorPrice', dataIndex: 'floorPrice', width: 150,
            sorter: (a, b) => a.floorPrice - b.floorPrice,},
        { title: 'Name', key: 'name', dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),},
        { title: 'Total Token Listings', key: 'totalTokenListings', dataIndex: 'totalTokenListings', width: 250,
            sorter: (a, b) => a.totalTokenListings - b.totalTokenListings,},

        { title: 'View Supply in Explorer', key: '', width: 250,
            render: record => (
                <a target="_blank" href={'https://explorer.solana.com/address/' + record.token} >View</a>
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

    /**
     * Functions
     */
    // user wants to only see verified collections
    const setCheckedVerifiedOnly = (e: any) => {

    }

    /**
     * Renders
     */

    return (
        <>
            <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>

                <div className={`font-bold pb-1 w-full`}><a href="https://famousfoxes.com/tokenmarket" className="underline" target="_blank">Fox Token Market - Analysis</a></div>
                {/*<p></p>*/}

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

                            <IonRow>
                                <IonCol className='' size="8">
                                    <Table
                                        className='pt-2'
                                        key={'name'}
                                        dataSource={tableData}
                                        columns={columns}
                                        bordered
                                        // scroll={{x: 'max-content'}}
                                        scroll={{y: 400}}
                                        // This both x & y aren't working together properly in our project. I tested out on codesandbox. It works perfectly there!!!
                                        // scroll={{x: 'max-content', y: 400}}
                                        pagination={false}
                                        style={{width: '100%', margin: '0 auto', textAlign: 'center'}}
                                    />
                                </IonCol>
                                <IonCol>

                                </IonCol>
                            </IonRow>

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

