import React, { useEffect, useState } from 'react'
import { instance } from '../../axios';
import { environment } from '../../environments/environment';
import Loader from '../../components/Loader';
import {Table} from 'antd'
import { ColumnsType } from 'antd/es/table';
import {IonContent, IonModal, IonPage} from '@ionic/react';

import './Schedule.css'
import Header from "../../components/header/Header";

const Schedule = () => {
    /**
     * States & Variables
     */
    const [mints, setMints] = useState([])
    const [date, setDate] = useState('')
    const [splitCollectionName, setSplitCollectionName] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    interface Mint {
        image: string,
        project: string,
        twitterLink: string,
        discordLink: string,
        time: string,
        tillTheMint: string,
        count: string,
        price: string,
        extras: string,
        "10DaySearchResults": any
    }

    const dataSource = mints

    // Get today's mints
    const fetchMintsData = () => {
      setIsLoading(true)
      instance
          .get(environment.backendApi + '/getTodaysMints')
          .then((res) => {
            console.log(res.data.data.mints)
            setMints(res.data.data.mints)
            setDate(res.data.data.date)
            setIsLoading(false)
          })
          .catch((err) => {
            setIsLoading(false)
            console.error("error when getting mints: " + err)
          })
    }

    useEffect(() => {
        fetchMintsData()
    }, [])

    const handleProjectClick = (project: any) => {
      setIsOpen(!isOpen)
      setIsLoading(true)
      setSplitCollectionName(project["10DaySearchResults"])
      setIsLoading(false)
    }

    const columns: ColumnsType<Mint> = [
        {
          title: 'Project',
          key: 'project',
          render: record => (
            <span
              className='cursor-pointer'
              onClick={() => handleProjectClick(record)}
            >
              {record.project}
            </span>
          )
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
          width: 150
        },
        {
          title: 'Links',
          key: 'links',
          render: record => (
              <>
                <a href={record.discordLink}>Discord</a> <br />
                <a href={record.twitterLink}>Twitter</a>
              </>
          ),
          width: 150
        },
        {
          title: 'Count',
          dataIndex: 'count',
          key: 'count',
          width: 150
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          width: 150
        },
        {
          title: 'Till the Mint',
          dataIndex: 'tillTheMint',
          key: 'tillTheMint',
          width: 100
        },
        {
          title: 'Description',
          dataIndex: 'extras',
          key: 'extras',
          width: 300
        },
      ];

  return (
    <IonPage>
        <IonContent  fullscreen>

            <Header />

            <div className="bg-gradient-to-b from-bg-primary to-bg-secondary justify-center items-center p-4 pt-2 sticky">

                <div className={`font-bold pb-1`}>Today's Mints - {date}</div>

                {
                    isLoading
                    ?   <div className="pt-10 flex justify-center items-center">
                            <Loader />
                        </div>
                    : <div className="max-w-fit mx-auto mb-10">
                        <br />
                        <Table
                            className='w-full mx-auto'
                            rowKey='project'
                            dataSource={dataSource}
                            columns={columns}
                            bordered
                            scroll={{y: 500}}
                            pagination={false}
                        />
                        <IonModal isOpen={isOpen}>
                          <IonContent>
                            {
                              splitCollectionName.length
                              && splitCollectionName?.map(name => (
                                  <div key={name} className='text-center'>
                                    <span style={{color: 'white'}}>{name}</span> <br />
                                  </div>
                              ))
                            }
                          </IonContent>
                        </IonModal>
                      </div>
                }

            </div>
        </IonContent>

    </IonPage>
  )
}

export default Schedule
