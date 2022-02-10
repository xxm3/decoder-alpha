import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Table} from 'antd'
import { ColumnsType } from 'antd/es/table';
import Loader from '../../components/Loader';

const Schedule = () => {

    const [mints, setMints] = useState([])
    const [date, setDate] = useState('')

    interface Mint {
        image: string,
        project: string,
        twitterLink: string,
        discordLink: string,
        time: string,
        tillTheMint: string,
        count: string,
        price: string,
        extras: string
    }

    const dataSource = mints

    useEffect(() => {
        const fetchMintsData = async () => {
            const data = await axios.get('http://localhost:8080/getTodaysMints')
            setMints(data.data.data.mints)
            setDate(data.data.data.date)
        }
        fetchMintsData()
    }, [])

    const columns: ColumnsType<Mint> = [
        {
          title: 'PROJECT',
          dataIndex: 'project',
          key: 'project',
        },
        {
          title: 'LINKS',
          key: 'links',
          render: record => (
              <>
                <a href={record.discordLink}>Discord</a> <br />
                <a href={record.twitterLink}>Twitter</a>
              </>
          )
        },
        {
          title: 'TIME',
          dataIndex: 'time',
          key: 'time',
          width: 150
        },
        {
          title: 'TILL THE MINT',
          dataIndex: 'tillTheMint',
          key: 'tillTheMint',
          width: 100
        },
        {
          title: 'COUNT',
          dataIndex: 'count',
          key: 'count',
        },
        {
          title: 'PRICE',
          dataIndex: 'price',
          key: 'price',
          width: 100
        },
        {
          title: 'EXTRAS',
          dataIndex: 'extras',
          key: 'extras',
          width: 300
        },
      ];

  return (
    <div>
        {
            !dataSource.length
            ?   <div className="pt-10 flex justify-center items-center">
                    <Loader />
                </div>
            : <div className="max-w-fit mx-auto">
                <h1 className='text-center'>{date}</h1>
                <br />
                <Table 
                    className=''
                    key={'project'}
                    dataSource={dataSource} 
                    columns={columns} 
                    bordered
                    scroll={{y: 1000}}
                    pagination={false}
                    style={{width: '100%', margin: '0 auto', textAlign: 'center'}}
                />
              </div>   
        }
    </div>
  )
}

export default Schedule