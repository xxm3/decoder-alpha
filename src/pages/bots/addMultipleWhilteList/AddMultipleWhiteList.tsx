import React, { useEffect, useMemo ,useState} from 'react';
import { instance } from '../../../axios';
import { AppComponentProps } from '../../../components/Route';
import { IonLabel, IonButton, useIonToast, IonGrid, IonRow, IonCol, IonCard, IonText, IonItem, IonSelect, IonSelectOption, IonInput, IonTextarea, IonDatetime, IonSpinner, } from '@ionic/react';
import './multipleWhiteListAdd.scss';
import {  useHistory, useLocation, useParams } from 'react-router';
import { Controller, FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { TextFieldTypes } from '@ionic/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Loader from '../../../components/Loader';

/**
 * The page they see when they've clicked "initiate seamless" ... then clicked on a guild
 *
 * This lists the form for them to fill out
 */

interface mutipleServerDetails{
    whitelist_role:string;
    required_role:string;
    id:string;
    name:string;
    discordGuildId:string;
    required_role_dropdown:any[] ;

}

interface FormFields {
    image: File & { path: string;} | '';
    target_server: number | '';
    max_users: number | '';
    expiration_date: string;
    type: 'raffle' | 'fcfs';
    description: string;
    twitter: string;
    discordInvite:string;
    mutipleServerDetails:mutipleServerDetails[];
    magicEdenUpvoteUrl?:string;
}
const AddMultipleWhiteList: React.FC<AppComponentProps> = () => {
    const getserver:any = useLocation();
    let history = useHistory();
    // get selected server list from redux store
    const multipleServerList:any = useSelector<RootState>(state => state.whiteList.selectMultipleServerList);
    // create form data
    const [formField,setFromFiled] = useState<FormFields>({
        image: '',
        target_server:'',
        max_users: '',
        expiration_date: '',
        type:'fcfs',
        description: 's',
        twitter: 'https://twitter.com/CryptoFrogs_NFT',
        discordInvite:'https://discord.gg/7buMeNpwpv',
        magicEdenUpvoteUrl:'https://magiceden.io/drops/',
        mutipleServerDetails:[]
        })
    const { control, handleSubmit,  watch, reset,  setError, formState: { isSubmitting }, } = useForm<FormFields, any>();
    
    const { fields, append } = useFieldArray({
        control,
        name: "mutipleServerDetails"
      });

    const [present] = useIonToast();
    const now = useMemo(() => new Date(), []);
    const [whiteListRole,setWhiteListRole] = useState<any>([]) // Whitelist Role dropdown value
    const [loaderFlag, setLoaderFlag] = useState(false) //loader flag
    let [whiteListServer, setWhiteListServer] = useState<mutipleServerDetails[]>([]) //selected server state

    // create serverarray filed
    const watchFieldArray = watch("mutipleServerDetails");
    const controlledFields = fields.map((field, index) => {
        return {
          ...field,
          ...watchFieldArray[index]
        };
      });

    //   get Whitelist Role dropdown value
    useEffect(() => {
        getWhiteListRole()
    }, [])
    
    // check multiple server List and set list in whiteListServer state
    useEffect(() => {
        if(multipleServerList.length>0){
        let arr:mutipleServerDetails[] =[];
        // error solved ( Cannot assign to read only property) and create obj for serverDetails
            for (let index = 0; index < multipleServerList.length; index++) {
                const element = multipleServerList[index];
                arr.push({
                    whitelist_role:"",
                    required_role:"",
                    id:element.id,
                    name:element.name,
                    discordGuildId:element.discordGuildId,
                    required_role_dropdown:[]
                })
            }
            
            setWhiteListServer([...arr])
        }else{
            history.goBack()
        }
    }, [multipleServerList])



// get WhiteListRequireRole by server descorGuildId
    useEffect(() => {

    if(whiteListServer.length>0){
        
    let fetchRequiredRoleByDiscordGuildId = async() =>{
        setLoaderFlag(true)
        let results = await Promise.all(whiteListServer.map(async (server): Promise<any> => {
            let RequiredRoles = await getWhiteListRequireRole(server.discordGuildId);
            server.required_role_dropdown = RequiredRoles
            return server
        }));
        setFromFiled({...formField,mutipleServerDetails:results})
        setLoaderFlag(false)
    }
    fetchRequiredRoleByDiscordGuildId()
    }
    }, [whiteListServer.length])


// reset form value
    useEffect(() => {
        reset(formField)
    }, [formField])


    const todayEnd = useMemo(() => {
        const date = new Date( + now + 86400 * 1000 );
        date.setHours(23,59,59,999);
        return date;
    }, [now]);

    
// get roles for the WL role we will give to people --- new mint --- source server
    const getWhiteListRole = async() =>{
        const errMsg = () => {
            present({
                message: 'Unable to get the roles from the new mint server. Please make sure the SOL Decoder bot is in that server!',
                color: 'danger',
                duration: 1000,
            });
        }

        try{
            const  data = await instance.get(`/getAllRoles/${getserver.state}`);
            if(data?.data?.data){
                setWhiteListRole(data.data.data);
            }else{
                errMsg();
            }
        }catch(err){
            errMsg();
        }

    }

    // get roles for what is required to enter the collab
    const getWhiteListRequireRole = async(discordGuildId:string) =>{
        const errMsg = () => {
            present({
                message: 'Unable to get the roles from the new mint server. Please make sure the SOL Decoder bot is in that server!',
                color: 'danger',
                duration: 1000,
            });
        }

        try{
            const data:any = await instance.get(`/getAllRoles/${discordGuildId}`);
            if(data?.data?.data){
              return data.data.data;
            }else{
                errMsg();
                return [];
            }
        }catch(err){
            errMsg();
            return [];
        }
    }


// add whiteList Server
    let mutipleWhiteListServerAdd = async(data:any) =>{
        const { image, ...rest } = data;
            const rawData = {
                ...rest,
            };
            const formData = new FormData();

            Object.entries(rawData).forEach(([key, value]) => {
                if (value) formData.append(key, value as string);
            });
            formData.append('image', image);

            try {
                let response = await instance.post( '/createNewWhitelistPartnership', formData );
                return response

            } catch (error:any) {
                let {response} = error
                return {...response.data,status:response.status}
            }
    }

    
    


    if(loaderFlag){
        return (<Loader />)
    }

    return (
        <IonGrid>
        <form className="space-y-3"// when submitting the form...
            onSubmit={  handleSubmit(async (data) => {
                // create multiple Api obj
                let WhiteListFomrArray = data.mutipleServerDetails.map((server)=>{
                    let createObj = {
                        image: data.image,
                        target_server: server.discordGuildId,
                        source_server: getserver.state,
                        max_users: data.max_users ,
                        expiration_date: data.expiration_date,
                        type: data.type,
                        description: data.description,
                        twitter: data.twitter,
                        discordInvite: data.discordInvite,
                        magicEdenUpvoteUrl:data.magicEdenUpvoteUrl || '',
                        whitelist_role:server.whitelist_role,
                        required_role:server.required_role,
                    }
                    return createObj
                })
                // call multiple Time Api
                let results = await Promise.all(WhiteListFomrArray.map(async (server): Promise<any> => {
                    let response = await mutipleWhiteListServerAdd(server)
                    return response
                }));

                
                let successResponse:any = [] //successed response
                let failedResponse:any = [] // failed response
                // check How many response success and failed
                results.map((result)=>{
                    if(result.status === 200){
                        successResponse.push(result)
                    }else{
                        failedResponse.push(result)
                    }
                })
                
                // show Success Message and Error Message
                let failedServerDetails:any[] = []
                if(failedResponse.length>0){
                    failedResponse.map((response:any)=>{
                        
                        let serverDetail:any = formField.mutipleServerDetails.find((server)=>server.discordGuildId===response.server.id)
                        
                        failedServerDetails.push(serverDetail)
                        if(!response.server.name){
                            response.server.name = serverDetail.name
                        }
                        present({
                            message: `Couldn't create whitelist partnership for ${response.server.name} server.`,
                            color: 'danger',
                            duration: 10000,
                        });
                    })

                }else{
                    present({
                        message: 'Whitelist partnership created successfully!',
                        color: 'success',
                        duration: 10000,
                    });
                    history.goBack()
                }

                if(failedServerDetails.length>0){
                    setFromFiled({...formField,mutipleServerDetails:failedServerDetails})
                }

            })}>

            <IonRow>
                <IonCol size="12"><h2 className="ion-no-margin font-bold text-xl"> Seamless - fill out whitelist details</h2> </IonCol>

                <IonCol ize-xl="12" size-md="12" size-sm="12" size-xs="12" />

                        

                    <IonCol size-xl="4" size-md="6" size-sm="6" size-xs="12" >
                        {/*  maultiple server maping */}
                        {controlledFields.map((controlledField,index)=>{
                                return(
                                    <IonCard className="ion-no-margin rounded-md ion-padding mb-2" key={index}> 
                                <div className='mb-5'>
                                <IonLabel className="text-white">{controlledField.name}</IonLabel>
                                </div>

                                <div className='mb-5'>
                                    <IonLabel className="text-white">Whitelist Role (role they will get once Whitelisted in your new mint server)</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                        name={`mutipleServerDetails.${index}.whitelist_role` as const}
                                        rules={{ required: true}}
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, name, ref },  fieldState: { error }, }) =>{
                                        return (
                                            <>
                                                <select className='w-full h-10 ' style={{backgroundColor : 'transparent'}}
                                                    onChange={onChange}
                                                    name={name}
                                                    value={value}
                                                    onBlur={onBlur}
                                                    ref={ref}
                                                    required
                                                    placeholder='Select a Whitelist Role' >
                                                <option value=''>Select a Whitelist Role</option>
                                                    {whiteListRole && whiteListRole.map((role:any) =>{ return (<option  key={role.id} value={role.id}> {role.name} </option>)}  )}
                                                </select>
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )}}
                                    />

                                    </IonItem>
                                </div>

                                <div>
                                    <IonLabel className="text-white">Required Role (role required of them in the existing DAO server, to enter)</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        {controlledField.required_role_dropdown.length>0?
                                            <Controller
                                            name={`mutipleServerDetails.${index}.required_role` as const}
                                            control={control}
                                            render={({ field: { onChange, onBlur, value, name, ref },  fieldState: { error }, }) => (
                                                <>
                                                    <select className='w-full h-10 ' style={{backgroundColor : 'transparent'}}
                                                        onChange={onChange}
                                                        name={name}
                                                        onBlur={onBlur}
                                                        ref={ref}
                                                        placeholder='Select a Required Role'
                                                        value={value}
                                                        required
                                                        >
                                                            <option value=''>Select a Required Role</option>
                                                            {controlledField.required_role_dropdown && controlledField.required_role_dropdown.map((role:any) =>{ return (<option  key={role.id}  value={role.id} > {role.name} </option>)} )}
                                                    </select>
                                                    <p className="formError"> {error?.message} </p>
                                                </>
                                            )}
                                        />
                                    :
                                    <Controller
                                        name={`mutipleServerDetails.${index}.required_role` as const}
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                            <>
                                                <IonInput
                                                    value={value}
                                                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                    type="text"
                                                    required
                                                    name={name}
                                                    ref={ref}
                                                    onIonBlur={onBlur}
                                                    placeholder='Id of required role' />
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )}
                                    />
                                    }
                                    
                                    </IonItem>
                                </div>
                            </IonCard>
                                )
                            })}
                            {/* 
                            */}                
                    </IonCol>



                    <IonCol size-xl="8" size-md="6" size-sm="6" size-xs="12">
                    

                            <IonCard className="ion-no-margin rounded-md ion-padding mb-2">

                                <div className='mb-5'>
                                    <IonLabel className="text-white">Giveaway Type</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller name="type" rules={{ required: true, }} defaultValue="fcfs" control={control}
                                        render={({  field: { onChange, onBlur, value, name, ref, }, fieldState: { error }, }) => (
                                            <>
                                                <IonSelect   onIonChange={(e) => {
                                                    ( e.target as HTMLInputElement ).value = e.detail.value;
                                                    onChange(e);
                                                    }}
                                                    name={name} value={value}  onIonBlur={onBlur} ref={ref} >
                                                    <IonSelectOption value="fcfs"> FCFS </IonSelectOption>
                                                    <IonSelectOption  value="raffle" disabled  > Raffle (Coming soon) </IonSelectOption>
                                                </IonSelect>
                                            </>
                                        )}  />
                                    </IonItem>
                                </div>

                                <div  className='mb-5'>
                                    <IonLabel className="text-white">Expiration Date</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                        name="expiration_date"
                                        control={control}
                                        rules={{  required: true, }}
                                        defaultValue={todayEnd.toISOString()}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                            <>
                                                <IonDatetime
                                                    value={value}
                                                    onIonChange={(e) => {
                                                        const value = new Date(e.detail.value as string);
                                                        value.setHours(23,59,59,999);
                                                        ( e.target as HTMLInputElement ).value =  value.toISOString();
                                                        onChange(e);
                                                    }}
                                                    name={name}
                                                    ref={ref}
                                                    onIonBlur={onBlur}
                                                    min={new Date(  +now + 86400 * 1000 ).toISOString()}
                                                    max={new Date(  +now + 86400 * 365 * 1000 ).toISOString()} />
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )} />
                                    </IonItem>
                                </div>
                                <div>
                                    <IonLabel className="text-white">Max Users</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="max_users"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => {
                                        return (
                                            <>
                                                <IonInput
                                                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string;  onChange(e); }}
                                                    required
                                                    type="number"
                                                    min="1"
                                                    name={name}
                                                    value={value}
                                                    onIonBlur={onBlur}
                                                    ref={ref}
                                                    placeholder='ie. 25'
                                                />
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )
                                    }} />
                                    </IonItem>
                                </div>
                            </IonCard>

                            

                            <IonCard className="ion-no-margin rounded-md ion-padding mb-2">
                                <div className='mb-5'>
                                    <IonLabel className="text-white">Image to represent your DAO</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                        name="image"
                                        control={control}
                                        rules={{ required: true, }}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) =>{
                                            return(
                                                <>
                                                    <IonInput
                                                        value={value as unknown as string}
                                                        onIonChange={(e) => {
                                                            const target = ( e.target as HTMLIonInputElement ).getElementsByTagName('input')[0];
                                                            const file = target .files?.[0] as FieldValues['image'];
                                                            if (file)
                                                                file.path =  URL.createObjectURL(file);
                                                            ( e.target as HTMLInputElement ).value = file as unknown as string;
                                                            onChange(e);
                                                        }}
                                                        name={name}
                                                        ref={ref}
                                                        required
                                                        onIonBlur={onBlur}
                                                        type={'file' as TextFieldTypes}
                                                        accept="image" />
                                                    <p className="formError"> {error?.message} </p>
                                                </>
                                            )
                                        } } />
                                    </IonItem>
                                </div>

                                <div className='mb-5'>
                                    <IonLabel className="text-white">Discord Invite Link (never expires, no invite limit)</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                        name="discordInvite"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                            <>
                                                <IonInput
                                                    value={value}
                                                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                    type="url"
                                                    required
                                                    name={name}
                                                    ref={ref}
                                                    onIonBlur={onBlur}
                                                    placeholder='Discord Invite Link' />
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )} />
                                    </IonItem>
                                </div>

                                <div className='mb-5'>
                                    <IonLabel className="text-white">Twitter Link</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                        name="twitter"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                            <>
                                                <IonInput
                                                    value={value}
                                                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                    type="url"
                                                    required
                                                    name={name}
                                                    ref={ref}
                                                    onIonBlur={onBlur}
                                                    placeholder='Twitter Link' />
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )} />
                                    </IonItem>
                                </div>
                                <div className='mb-5'>
                                    <IonLabel className="text-white">Magic Eden upvote URL</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                        name="magicEdenUpvoteUrl"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                            <>
                                                <IonInput
                                                    value={value}
                                                    onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                    type="url"
                                                    required
                                                    name={name}
                                                    ref={ref}
                                                    onIonBlur={onBlur}
                                                    placeholder='Magic Eden upvote URL' />
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )} />
                                    </IonItem>
                                </div>

                                <div>
                                    <IonLabel className="text-white">Description</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                        name="description"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                            <>
                                                <IonTextarea
                                                    value={value}
                                                    onIonChange={(e:any) => {
                                                        ( e.target as HTMLInputElement ).value = e.detail.value as string;
                                                        onChange(e);
                                                        }}
                                                    required
                                                    name={name}
                                                    ref={ref}
                                                    onIonBlur={onBlur}
                                                    placeholder='Description'
                                                    maxlength={2000} />
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )}/>

                                    </IonItem>
                                    <p className='mt-2'>Max character limit is 2000</p>
                                </div>
                            </IonCard>
                            <div className='ion-text-right'>
                                <IonButton className="cardButton" onClick={()=> history.goBack()}>
                                    Cancel
                                </IonButton>
                                {/*  */}
                                <IonButton className="cardButton" type={'submit'} disabled={isSubmitting}>
                                    {isSubmitting ? ( <IonSpinner /> ) : ('Submit')}
                                </IonButton>
                            </div>
                    </IonCol>
            </IonRow>
        </form>
        </IonGrid>
    );
};

// @ts-ignore
export default AddMultipleWhiteList;
