import {useQuery} from 'react-query';
import {AxiosResponse} from 'axios';
import {instance} from '../../axios';
import {environment} from '../../environments/environment';
import Loader from '../../components/Loader';
import moment from "moment";
import {Link, useLocation} from "react-router-dom";
import {IonCard, IonLabel, useIonToast} from "@ionic/react";
import {useHistory} from "react-router";
import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';

const WordsCount = () => {

    const history = useHistory();
    const [present, dismiss] = useIonToast();
    const [wordList, setWordList] = useState<any>(null)

    useEffect(() => {
        getWordCountByDuration()
    }, [])

    let getWordCountByDuration = async() =>{
        instance
                .get(
                    '/getWordCountByDuration'
                )
                .then((response) => {
                    let data = response.data.data
                    console.log(data)
                    setWordList(data)
                })
                .catch((error) => {
                    let msg = '';
                        if (error && error.response) {
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
                })
                .finally(() => {
                    console.log("finally")
                });

    }
    

    /**
     * Functions
     */
    const getSearchedWords = async () => {
        try {
            const {data} = await instance.get(environment.backendApi + '/getSearchedWords', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            return data;
        } catch (e) {
            console.error('try/catch in Search.tsx: ', e);
            const error = e as Error & { response?: AxiosResponse };

            let msg = '';
            if (error && error.response) {
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
            // if(msg.includes('logging in again')){
            //     history.push("/login");
            // }

            // throw new Error(msg);
        }
    }

    const wordsCountQuery = useQuery(['wordsCount'], getSearchedWords, {
        select: (data: any) => {

            // Error handling
            if (data?.error && data.message) {
                throw new Error(String(data.message));
            }
            return {
                ...data,
            }
        },
        // refetchOnWindowFocus: true,
        retry: false
    })

    /**
     * Use Effects
     */

    return (
        <div className="flex flex-row justify-center w-full mt-6">
                <Grid container spacing={3}>
                    {/*'top 5 new words created yesterday  */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="secondary-bg-forced p-4 rounded-xl">
                            <div className="flex flex-col">
                                <IonLabel className="ml-3 text-xl">
                                Top 5 new words created yesterday
                                </IonLabel>
                                <div className='flex flex-col'>
                                    {wordList?.yesterday.map((text:any,index:number)=>{
                                        return <Link to={'search/' + text.word} className="ml-5 text-sm mt-2 underline underline-offset-2" key={index}> {text.word} </Link>
                                    })}
                                </div>
                            </div>
                        </div>
                    </Grid>
                    {/* top 5 new words that were created 3 days ago */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="secondary-bg-forced p-4 rounded-xl">
                            <div className="flex flex-col">
                                <IonLabel className="ml-3 text-xl">
                                Top 5 new words that were created 3 days ago
                                </IonLabel>
                                <div className='flex flex-col'>
                                {wordList&&wordList['3days'].map((text:any,index:number)=>{
                                        return <Link to={'search/' + text.word} className="ml-5 text-sm underline underline-offset-2 mt-2" key={index}> {text.word} </Link>
                                    })}
                                </div>
                            </div>
                        </div>
                    </Grid>
                    {/* top 5 new words that were created 5 days ago */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="secondary-bg-forced p-4 rounded-xl">
                            <div className="flex flex-col">
                                <IonLabel className="ml-3 text-xl">
                                Top 5 new words that were created 5 days ago
                                </IonLabel>
                                <div className='flex flex-col'>
                                {wordList&&wordList['5days'].map((text:any,index:number)=>{
                                        return <Link to={'search/' + text.word} className="ml-5 text-sm underline underline-offset-2 mt-2" key={index}> {text.word} </Link>
                                    })}
                                </div>
                                
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
    )
}





export default WordsCount
