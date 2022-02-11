import {
    IonIcon,
    IonSearchbar,
    IonInput,
    IonButton,
    IonList,
    IonRadioGroup,
    IonListHeader,
    IonLabel, IonItemDivider, IonItem, IonRadio
} from '@ionic/react';
import React, {KeyboardEvent, KeyboardEventHandler, useEffect, useMemo, useState} from 'react';
import { search } from 'ionicons/icons';
import {Table} from 'antd'
import { ColumnsType } from 'antd/es/table';
import Loader from "./Loader";
import axios from "axios";
import {instance} from "../axios";
import {environment} from "../environments/environment";

interface NftPriceTableProps {
    foo?: string;
    onSubmit(bar: string): unknown;
}

function NftPriceTable({ foo, onSubmit }: NftPriceTableProps) {

    /**
     * States & Variables
     */
    const [tableData, setTableData] = useState([])

    const columns: ColumnsType<any> = [
            { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
            { title: 'Mint Date', dataIndex: 'mintDate', key: 'mintDate', width: 200 },
            { title: 'Mint Price', dataIndex: 'mintPrice', key: 'mintPrice', width: 100 },
            { title: 'Highest Price', dataIndex: 'currentPrice', key: 'currentPrice', width: 100 },
            { title: '% change', dataIndex: 'pctChange', key: 'pctChange', width: 100 },
            { title: 'Meta', dataIndex: 'meta', key: 'meta', width: 200 },
            { title: 'Comments', dataIndex: 'comments', key: 'comments', width: 400 },
            { title: 'Magic Eden URL', dataIndex: 'meUrl', key: 'meUrl', width: 200 },
            { title: 'Mint URL', dataIndex: 'mintUrl', key: 'mintUrl', width: 200 },
        ];

    /**
     * TODO:
     * - store in RDS
     * - figure out how to track price in first place ... maybe can pull from some site...
     * - stop tracking after 7 days or something (otherwise spamming ME etc...)
     *
     * - orrr perhaps that can be automated in the discord as well. like each alert automatically gets emojis added to the bottom that you vote on, one represents staking
     */

    /**
     * Use Effects
     */
    useEffect(() => {
        const fetchTableData = async () => {

            setTableData([
                // @ts-ignore
                {'name': 'Royal Lion Party Club', mintDate: '2022-02-09', mintPrice: 0.99,
                    // @ts-ignore
                    currentPrice: 6.2, pctChange: '550%', meUrl: '[view]', mintUrl: '[view]', meta: 'Staking/Token/Low Supply', comments: 'low comments...' },
                // @ts-ignore
                {'name': 'Moonland Metaverse', mintDate: '2022-02-09', mintPrice: 1.5,
                    // @ts-ignore
                    currentPrice: 3, pctChange: '100%', meUrl: '[view]', mintUrl: '[view]', meta: 'Metaverse', comments: 'taking a while to mint' }
            ]);

            instance
                .get(environment.backendApi + '/mintAlertsAutomatedStats')
                .then((res) => {
                    // setTableData(data.data.mints); // TODO
                })
                .catch((err) => {
                    console.error("error when getting mint alerts automated: " + err);
                });
        }
        fetchTableData();
    }, []);

    /**
     * Functions
     */

    /**
     * Renders
     */

    return (
        <>
            <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>

                {/*${width <= 640 ? 'w-full' : 'w-96 '}*/}
                <div className={`font-bold pb-1 w-full`}>Mint Alerts Automated - Statistics</div>
                <p>These are mints that were posted in at least two discords, and sent to the #mint-alerts-automated channel</p>

                <div>
                {
                    !tableData.length
                        ?   <div className="pt-10 flex justify-center items-center">
                                <Loader />
                            </div>
                        : <div className=" "> {/* max-w-fit mx-auto */}

                            <br />
                            <Table
                                className=''
                                key={'name'}
                                dataSource={tableData}
                                columns={columns}
                                bordered
                                scroll={{y: 1000}}
                                pagination={false}
                                style={{width: '100%', margin: '0 auto', textAlign: 'center'}}
                            />
                        </div>
                }
                </div>
            </div>
            <br/>

            <div className={`w-full bg-satin-3 rounded-lg pt-3 pb-6 pr-3 pl-3 h-fit xl:pb-3 2xl:pb-2 lg:pb-4`}>
                <div className={`font-bold pb-3 w-full text-lg`}>Mint Alerts Automated - Custom Alerts</div>

                <div>

                    <label className={`font-bold pb-1 w-full`} htmlFor="">Get an alert when the below meta gets alerted in #mint-alerts-automated</label>

                    <IonList>
                        <IonRadioGroup value='...' > {/*onIonChange={e => setSelected(e.detail.value)}*/}

                            {/*<IonListHeader>*/}
                            {/*    <IonLabel>Name</IonLabel>*/}
                            {/*</IonListHeader>*/}

                            {/*TODO: chekcbox*/}
                            <IonItem>
                                <IonLabel>Staking/Token/Low Supply</IonLabel>
                                <IonRadio slot="start" value="biff" />
                            </IonItem>

                            <IonItem>
                                <IonLabel>Metaverse</IonLabel>
                                <IonRadio slot="start" value="griff" />
                            </IonItem>

                            <IonItem>
                                <IonLabel>Casino</IonLabel>
                                <IonRadio slot="start" value="buford" />
                            </IonItem>

                            <IonItem>
                                <IonLabel>P2E</IonLabel>
                                <IonRadio slot="start" value="buford" />
                            </IonItem>

                            <IonItem>
                                <IonLabel>Bot / Sniper</IonLabel>
                                <IonRadio slot="start" value="buford" />
                            </IonItem>

                            <IonItem>
                                <IonLabel>Asian / Hong Kong devs</IonLabel>
                                <IonRadio slot="start" value="buford" />
                            </IonItem>
                        </IonRadioGroup>
                        {/*<IonItemDivider>Your Selection</IonItemDivider>*/}
                        {/*<IonItem>{selected ?? '(none selected'}</IonItem>*/}
                    </IonList>

                    <IonButton color="success" className="text-sm" >
                        Submit
                    </IonButton>
                    <br/><br/>

                    <label className={`font-bold pb-1 w-full`} htmlFor="">Get an alert when the below URL or CMv2 ID goes live</label>
                    <IonInput value='' placeholder='Type a URL of a mint, or a CMv2 ID' style={{"border": "1px solid", "width": "400px"}}></IonInput>
                    <IonButton color="success" className="text-sm" >
                        Submit
                    </IonButton>
                    <br/><br/>

                    <label className={`font-bold pb-1 w-full`} htmlFor="">Get an alert when the below URL or CMv2 ID mints a certain amount</label>
                    <IonInput value='' placeholder='Type a URL of a mint, or a CMv2 ID' style={{"border": "1px solid", "width": "400px"}}></IonInput>
                    <IonInput value='' placeholder='Type the # that should be minted before alerting' style={{"border": "1px solid", "width": "400px"}}></IonInput>
                    <IonButton color="success" className="text-sm" >
                        Submit
                    </IonButton>

                    <br/><br/><br/><br/>

                </div>
            </div>

        </>
    );
}
export default NftPriceTable;

