import { async } from '@firebase/util';
import { useIonToast } from '@ionic/react';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery as useReactQuery } from 'react-query';
import { Virtuoso } from 'react-virtuoso';
import { instance } from '../../axios';
import { Column } from '@material-table/core';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import usePersistentState from '../../hooks/usePersistentState';
import FfNamed from '../home/FfNamed';
import ReactTooltip from 'react-tooltip';

interface guildData {
    id: string;
    name: string;
}


const columns: Column<guildData>[] = [

    {
        title: 'name',
        customSort: (a: any, b: any) => a.name - b.name,
        render: (record) => <span>{record?.name}</span>,
    },

];



const columns_mobile: Column<guildData>[] = [
    {
        render: (record: any, index) => (
            <span>
                {/* {
                    <>
                        <span>
                            <b>id : </b>
                            {index}
                        </span>
                    </>
                } */}
                {
                    <>
                        <span>
                            <b>name : </b>
                            {record?.name}
                        </span>
                    </>
                }
            </span>


        )
    },
];



function ViewGuild() {
    const [present, dismiss] = useIonToast();
    const [isMobile, setIsMobile] = useState(false);
    const [mode] = usePersistentState('mode', 'dark');

    // fetch guildData
    let fetchGuildData = async () => {
        try {
            const {
                data: { guilds },
            } = await instance.get(
                '/guilds/showGuildsDetails'
            );
            console.log('guilds***', guilds);
            return guilds as guildData[];
        } catch (e) {
            console.error('try/catch ViewGuild: ', e);
            const error = e as Error & { response?: AxiosResponse };
            let msg = '';
            if (error?.response) {
                msg = String(error.response.data.body);
            } else {
                msg = 'Unable to connect. Please try again later';
            }

            present({
                message: msg,
                color: 'danger',
                duration: 5000,
                buttons: [{ text: 'X', handler: () => dismiss() }],
            });
        }
    };

    // guilddat quary
    const {
        isLoading: guildLoading,
        isError,
        data: guildData,
        error,
    } = useReactQuery('guidData', fetchGuildData);


    // check isMobile
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);

    return (
        <div>
            {!guildData?.length ? (
                <div className="pt-10 flex justify-center items-center">
                    <Loader />
                </div>
            ) :
                <div>
                    <Virtuoso
                        totalCount={1}
                        style={{ height: '400px' }}
                        itemContent={index => <Table
                            data={guildData}
                            columns={isMobile ? columns_mobile : columns}
                            title="All Guild"
                            description="👪"
                            url="https://famousfoxes.com/tokenmarket"

                            options={{
                                thirdSortClick: false,
                                detailPanelType: 'single',
                                search: false,
                                searchFieldStyle: {
                                    marginLeft: '-20%',
                                    marginTop: '2%',
                                    paddingLeft: "4%",
                                    borderRadius: 30,
                                    borderWidth: 1,
                                    border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.876) !important' : '1px solid rgba(10,10,10,0.8) !important'
                                },
                                rowStyle: (rowData: any) => ({
                                    backgroundColor: mode === 'dark' ? '' : 'rgba(239,239,239,0.8)',
                                    color: mode === 'dark' ? "" : '#202124',
                                    borderTop: mode === 'dark' ? "" : '1px solid rgba(220,220,220,0.8)',
                                }),
                                // hide eye icon on mobile
                                columnsButton: isMobile ? false : true,
                            }}
                        />}
                    />
                    {/* <Virtuoso  totalCount={1}
                        itemContent={() => <>  
                            recent FF tokens
                            <FfNamed />
                        <ReactTooltip />
                        </>} /> */}
                </div>
            }
        </div>
    );
}

export default ViewGuild;
