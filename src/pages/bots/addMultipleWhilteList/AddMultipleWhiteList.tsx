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
import Help from '../../../components/Help';
import moment from 'moment';
import isAxiosError from '../../../util/isAxiosError';
import { AxiosError } from 'axios';

/**
 * The page they see when they've clicked "initiate seamless" ... then clicked on a guild
 *
 * This lists the form for them to fill out
 */

interface mutipleServerDetails{
    max_users: number | '';
    required_role:string;
    id:string;
    name:string;
    target_server: '';
    required_role_dropdown:any[] ;
}

interface FormFields {
    image: File & { path: string;} | '';
    expiration_date: any;
    type: 'raffle' | 'fcfs';
    description: string;
    twitter: string;
    discordInvite:string;
    verified_role: string;
    servers:mutipleServerDetails[];
    magicEdenUpvoteUrl?:string;
    whitelist_role:string;
    mintDate:string;
    mintSupply:string;
    mintPrice:number | ''
}

const AddMultipleWhiteList: React.FC<AppComponentProps> = () => {
    const getserver:any = useLocation();
    let history = useHistory();
    // get selected server list from redux store
    const multipleServerList:any = useSelector<RootState>(state => state.whiteList.selectMultipleServerList);
    // create form data
    const now = useMemo(() => new Date(), []);
    const todayEnd = useMemo(() => {
        const date = new Date( + now + 86400 * 1000 );
        date.setHours(23,59,59,999);
        return date;
    }, [now]);
    const [formField,setFromFiled] = useState<FormFields>({
        image: '',
        expiration_date: todayEnd.toISOString(),
        type:'fcfs',
        description: 's',
        twitter: 'https://twitter.com/CryptoFrogs_NFT',
        discordInvite:'https://discord.gg/7buMeNpwpv',
        magicEdenUpvoteUrl:'https://magiceden.io/drops/',
        servers:[],
        verified_role:'',
        whitelist_role:'',
        mintDate:new Date().toISOString(),
        mintSupply:'',
        mintPrice:''


        
        })
    const { control, handleSubmit,  watch, reset,  setError, formState: { isSubmitting }, setValue } = useForm<FormFields, any>();
    
    const { fields, append } = useFieldArray({
        control,
        name: "servers"
      });

    const [present] = useIonToast();
    
    const [whiteListRole,setWhiteListRole] = useState<any>([]) // Whitelist Role dropdown value
    const [loaderFlag, setLoaderFlag] = useState(false) //loader flag
    let [whiteListServer, setWhiteListServer] = useState<mutipleServerDetails[]>([]) //selected server state

    // create serverarray filed
    const watchFieldArray = watch("servers");
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
                    max_users:'',
                    required_role:"",
                    id:element.id,
                    name:element.name,
                    target_server:element.discordGuildId,
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
            let RequiredRoles = await getWhiteListRequireRole(server.target_server);
            server.required_role_dropdown = RequiredRoles
            return server
        }));
        setFromFiled({...formField,servers:results})
        setLoaderFlag(false)
    }
    fetchRequiredRoleByDiscordGuildId()
    }
    }, [whiteListServer.length])


// reset form value
    useEffect(() => {
        reset(formField)
    }, [formField])


 

    
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
                let response = await instance.post( '/createWhitelistPartnerships', formData );
                present({
                    message: 'Whitelist partnership created successfully!',
                    color: 'success',
                    duration: 10000,
                });
                history.goBack()

            } catch (error) {
                console.error(error);

                if (isAxiosError(error)) {
                    const { response: { data } = { errors: [] } } =
                        error as AxiosError<{ errors: { location: string; msg: string; param: string; }[]; }>;

                    if (!data || data.hasOwnProperty('error')) {
                        present({
                            message: ( data as unknown as { body: string } ).body,
                            color: 'danger',
                            duration: 10000,
                        });
                    } else if (data.hasOwnProperty('errors')) {
                        data.errors.forEach(({ param, msg }) => {
                            // if (param !== 'source_server') {
                                setError( param as keyof FormFields, { message: msg, type: 'custom',});
                            // } else {
                                present({
                                    message: msg,
                                    color: 'danger',
                                    duration: 10000,
                                });
                            // }
                        });
                    }else{
                        present({
                            message: 'An error occurred, please look at the form above to see if you are missing something',
                            color: 'danger',
                            duration: 10000,
                        });
                    }
                }else{
                    present({
                        message: 'An error occurred, please look at the form above to see if you are missing something',
                        color: 'danger',
                        duration: 10000,
                    });
                }
            }
    }

    // lodaer show
    if(loaderFlag){
        return (<Loader />)
    }
    // content show 
    return (
        <div className='add_multiple_whitelist_wrapper'>
        <IonGrid>
            <form className="space-y-3"// when submitting the form...
                onSubmit={  handleSubmit(async (data) => {
                                    // create server object
                    let serverObj = data.servers.map(server=>{
                        return {max_users:server.max_users,required_role:server.required_role,target_server:server.target_server}
                    })
                    console.log("serverObj",serverObj)
                    // create obj for Api
                    let createObj = {
                        expiration_date: data.expiration_date,
                        type: data.type,
                        whitelist_role:data.whitelist_role,
                        description: data.description,
                        twitter: data.twitter,
                        discordInvite: data.discordInvite,
                        magicEdenUpvoteUrl:data.magicEdenUpvoteUrl || '',
                        verified_role: data.verified_role,
                        source_server: getserver.state,
                        image: data.image,
                        servers:JSON.stringify(serverObj),
                        mintDate:data.mintDate,
                        mintSupply:data.mintSupply,
                        mintPrice:data.mintPrice
                    }

                    console.log("createObj",createObj)
                    await mutipleWhiteListServerAdd(createObj)
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
                                            {/* max users */}
                                            <div>
                                                <IonLabel className="text-white">Max Users</IonLabel>
                                                <IonItem className="ion-item-wrapper mt-1">
                                                <Controller
                                                name={`servers.${index}.max_users` as const}
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

                                            <div>
                                                <IonLabel className="text-white">Required Role (role required of them in the existing DAO server, to enter)</IonLabel>
                                                <IonItem className="ion-item-wrapper mt-1">
                                                    {controlledField.required_role_dropdown.length>0?
                                                        <Controller
                                                        name={`servers.${index}.required_role` as const}
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
                                                    name={`servers.${index}.required_role` as const}
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
                                        </IonCard> )
                                    })}
                        </IonCol>



                        <IonCol size-xl="8" size-md="6" size-sm="6" size-xs="12">
                            <IonCard className="ion-no-margin rounded-md ion-padding mb-2">
                                {/* type */}
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
                                {/* Expiration Date */}
                                <div  className='mb-5'>
                                    <IonLabel className="text-white">Expiration Date</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="expiration_date"
                                    control={control}
                                    rules={{  required: true, }}
                                    defaultValue={todayEnd}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => {
                                        return (
                                            <div className='flex flex-col w-full'>
                                                <input type="date"
                                                className='w-full h-10 '
                                                style={{backgroundColor : 'transparent'}}
                                                name={name}
                                                value={moment(new Date(value)).format('yyyy-MM-DD')}
                                                onBlur={onBlur}
                                                required
                                                ref={ref}
                                                onChange={(e) => {
                                                    const value = new Date(e.target.value as string);
                                                    value.setHours(23,59,59,999)
                                                    console.log(value.toISOString())
                                                    setValue('expiration_date',value.toISOString())
                                                    }}
                                                min={new Date(  +now + 86400 * 1000 ).toISOString()}
                                                max={new Date(  +now + 86400 * 365 * 1000 ).toISOString()}
                                                />
                                                <p className="formError"> {error?.message} </p>
                                            </div>
                                        )
                                    }} />
                                </IonItem>
                                </div>
                            </IonCard>


                            <IonCard className="ion-no-margin rounded-md ion-padding mb-2">
                                {/* whitelist_role */}
                                <div className='mb-5'>
                                    <IonLabel className="text-white">Whitelist Role (role they will get once Whitelisted in your new mint server)</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                        name='whitelist_role'
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
                                {/*  */}


                                {/* Verified role */}
                                <div className='mb-5'>
                                    <IonLabel className="text-white">Verified role (a role that indicates a member of your new mint server is verified)
                                        <Help description={`Some servers have a verification system in place to prevent their server being overpopulated with fake members.
                                        Most systems work in a way that a member has to do a certain action like react to a message or click somewhere in order to obtain a role indicating that the user is verified in the server.
                                        If your new mint server has a role for verified members, select it below. The verified role will be added alongside the whitelist role so that the member can get automatically verified in the server.`}/>
                                    </IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                        name="verified_role"
                                        rules={{ required: true, }}
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
                                                    placeholder='Select a Verified Role' >
                                                <option value=''>Select a Verified Role</option>
                                                    {whiteListRole && whiteListRole.map((role:any) =>{ return (<option  key={role.id} value={role.id}> {role.name} </option>)}  )}
                                                </select>
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )}}
                                    />
                                    </IonItem>
                                </div>

                                {/* Image Upload */}
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
                                                        accept="image/png, image/gif, image/jpeg" />
                                                    <p className="formError"> {error?.message} </p>
                                                </>
                                            )
                                        } } />
                                    </IonItem>
                                </div>
                                {/* Discord Invite Link */}
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
                                {/* Twitter Link */}
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
                                {/*  Magic Eden upvote URL */}
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

                                {/* Expiration Date */}
                                <div  className='mb-5'>
                                    <IonLabel className="text-white">Mint Date</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="mintDate"
                                    control={control}
                                    rules={{  required: true, }}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => {
                                        return (
                                            <div className='flex flex-col w-full'>
                                                <input type="date"
                                                className='w-full h-10 '
                                                style={{backgroundColor : 'transparent'}}
                                                name={name}
                                                value={moment(new Date(value)).format('yyyy-MM-DD')}
                                                onBlur={onBlur}
                                                required
                                                ref={ref}
                                                onChange={(e) => {
                                                    const value = new Date(e.target.value as string);
                                                    setValue('mintDate',value.toISOString())
                                                    }}
                                                />
                                                <p className="formError"> {error?.message} </p>
                                            </div>
                                        )
                                    }} />
                                </IonItem>
                                </div>

                                {/*  mintSupply */}
                                <div className='mb-5'>
                                    <IonLabel className="text-white">Mint Supply</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                        name="mintSupply"
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
                                                    placeholder='Add Mint Supply' />
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )} />
                                    </IonItem>
                                </div>
                                {/* mint Price */}
                                <div>
                                    <IonLabel className="text-white">Mint Price</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name='mintPrice'
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
                                                    placeholder='99.50'
                                                />
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )
                                    }} />
                                    </IonItem>
                                </div>



                                {/* description */}
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
                                {/*  */}
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
        </div>
    );
};

// @ts-ignore
export default AddMultipleWhiteList;
