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
import moment from 'moment';
import Help from '../../../components/Help';

/**
 * The page they see when they've clicked "initiate seamless" ... then clicked on a guild
 *
 * This lists the form for them to fill out
 */

interface mutipleServerDetails{
    max_users: number | '';
    required_role:string;
    required_role_name?: string;
    id:string;
    name:string;
    discordGuildId:string;
    required_role_dropdown:any[] ;
}

interface FormFields {
    whitelist_role:string;
    image: File & { path: string;} | '';
    target_server: number | '';
    verified_role: string;
    expiration_date: string;
    type: 'raffle' | 'fcfs';
    description: string;
    twitter: string;
    discordInvite:string;
    mutipleServerDetails:mutipleServerDetails[];
    magicEdenUpvoteUrl?:string;
    mintDate:string;
    mintSupply:string;
    mintPrice:any | ''
}
const AddMultipleWhiteList: React.FC<AppComponentProps> = () => {
    const getserver:any = useLocation();
    let history = useHistory();
    // get selected server list from redux store
    const multipleServerList:any = useSelector<RootState>(state => state.whiteList.selectMultipleServerList);
    const now = useMemo(() => new Date(), []);
    
    const todayEnd = useMemo(() => {
        const date = new Date( + now + 86400 * 1000 );
        date.setHours(23,59,59,999);
        return date;
    }, [now]);
    
    // create form data
    const [formField,setFromFiled] = useState<FormFields>({
        whitelist_role:'',
        verified_role:'',
        image: '',
        target_server:'',
        expiration_date: todayEnd.toISOString(),
        type:'fcfs',
        description: '',
        twitter: '',
        discordInvite:'',
        magicEdenUpvoteUrl:'',
        mutipleServerDetails:[],
        mintDate:new Date().toISOString(),
        mintSupply:'',
        mintPrice:'',
        })
    const { control, handleSubmit,  watch, reset,  setError, formState: { isSubmitting }, setValue} = useForm<FormFields, any>();
    
    const { fields, append } = useFieldArray({
        control,
        name: "mutipleServerDetails"
      });

    const [present] = useIonToast();
   
    const [whiteListRole,setWhiteListRole] = useState<any>([]) // Whitelist Role dropdown value
    const [loaderFlag, setLoaderFlag] = useState(false) //loader flag
    const [isBigImage, setIsBigImage] = useState<boolean>(false);
    const [isValidImage, setIsValidImage] = useState<boolean>(false);
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
                    max_users:'',
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
                // create multiple Api obj
                let WhiteListFomrArray = data.mutipleServerDetails.map((server)=>{
                    let createObj = {
                        image: data.image,
                        target_server: server.discordGuildId,
                        source_server: getserver.state,
                        max_users: server.max_users ,
                        expiration_date: data.expiration_date,
                        type: data.type,
                        description: data.description,
                        twitter: data.twitter,
                        discordInvite: data.discordInvite,
                        magicEdenUpvoteUrl:data.magicEdenUpvoteUrl || '',
                        whitelist_role:data.whitelist_role,
                        required_role:server.required_role,
                        required_role_name:server.required_role_name,
                        mintDate:data.mintDate,
                        mintSupply :data.mintSupply,
                        mintPrice :data.mintPrice,
                        verified_role:data.verified_role
                    }
                    return createObj
                })

                console.log("WhiteListFomrArray",WhiteListFomrArray)
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
                                    <IonCard className="ion-no-margin rounded-md ion-padding mb-2 multipleWhite-light-card" key={index}> 
                                <div className='mb-5'>
                                <IonLabel className="card-detail-wrapper">{controlledField.name}</IonLabel>
                                </div>

                                <div>
                                    <IonLabel className="card-detail-wrapper">Max Users</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name={`mutipleServerDetails.${index}.max_users` as const}
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
                                {controlledField.required_role_dropdown.length>0?
                                <div>
                                    <IonLabel className="card-detail-wrapper">Required Role (role required of them in the existing DAO server, to enter)</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        
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
                                    
                                    
                                    </IonItem>
                                    </div>:
                                    <div>
                                    <div>
                                        <IonLabel className="card-detail-wrapper">Required Role ID (Discord Role ID required of them in '{controlledField.name}' to enter the giveaway)</IonLabel>
                                        <IonItem className="c-item-wrapper mt-1">
                                            <Controller
                                           name={`mutipleServerDetails.${index}.required_role` as const}
                                            control={control}
                                            render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                                <div className='flex flex-col w-full'>
                                                    <IonInput
                                                        // readonly={server.state.requiredRoleId}
                                                        // value={server.state.requiredRoleId ? server.state.requiredRoleId : value}
                                                        value={value}
                                                        className='w-full'
                                                        onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                        type="text"
                                                        required
                                                        name={name}
                                                        ref={ref}
                                                        onIonBlur={onBlur}
                                                        placeholder='Required Role ID (ie. 966704866640662548)' />
                                                    <p className="formError"> {error?.message} </p>
                                                </div>
                                            )} />
                                        </IonItem>
                                        <span className="font-bold text-green-500">
                                            {controlledField.required_role ? `'${controlledField.name}' recommends a Required Role ID of ${controlledField.required_role}` : ''}
                                        </span>
                                    </div>

                                    <div className='mt-5'>
                                        <IonLabel className="card-detail-wrapper">Required Role Name (Discord Role ID required of them in '{controlledField.name}' to enter the giveaway)</IonLabel>
                                        <IonItem className="c-item-wrapper mt-1">
                                            <Controller
                                            name={`mutipleServerDetails.${index}.required_role_name` as const}
                                            control={control}
                                            render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                                <div className='flex flex-col w-full'>
                                                    <IonInput
                                                        value={value}
                                                        className='w-full'
                                                        onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                        type="text"
                                                        required
                                                        name={name}
                                                        ref={ref}
                                                        onIonBlur={onBlur}
                                                        placeholder='Required Role Name (ie. Verified Holder)' />
                                                    <p className="formError"> {error?.message} </p>
                                                </div>
                                            )} />
                                    </IonItem>
                                    <span className="font-bold text-green-500">
                                        {/* {server?.state?.requiredRoleName ? `'${server?.state?.name}' recommends a Required Role Name of ${server?.state?.requiredRoleName}` : ''} */}
                                    </span>
                                    </div>
                                </div>
                                }
                                
                            </IonCard>
                                )
                            })}
                            {/* 
                            */}                
                    </IonCol>



                    <IonCol size-xl="8" size-md="6" size-sm="6" size-xs="12">
                            <IonCard className="ion-no-margin rounded-md ion-padding mb-2 multipleWhite-light-card">
                                {/* type */}
                                <div className='mb-5'>
                                    <IonLabel className="card-detail-wrapper">Giveaway Type</IonLabel>
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
                                    <IonLabel className="card-detail-wrapper">Expiration Date</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                        name="expiration_date"
                                        control={control}
                                        rules={{  required: true, }}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                            <>
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

                                                
                                                <p className="formError"> {error?.message} </p>
                                            </>
                                        )} />
                                    </IonItem>
                                </div>
                                
                            </IonCard>

                            

                            <IonCard className="ion-no-margin rounded-md ion-padding mb-2 multipleWhite-light-card">
                            {/* whitelist_role */}
                            <div className='mb-5'>
                                    <IonLabel className="card-detail-wrapper">Whitelist Role (role they will get once Whitelisted in your new mint server)</IonLabel>
                                    <IonItem className="c-item-wrapper mt-1">
                                    <Controller
                                        name={`whitelist_role`}
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
                                {/* verified_role */}
                                <div className='mb-5'>
                                <IonLabel className="card-detail-wrapper">Verified role (a role that indicates a member of your new mint server is verified)
                                    <Help description={`Some servers have a verification system in place to prevent their server being overpopulated with fake members.
                                    Most systems work in a way that a member has to do a certain action like react to a message or click somewhere in order to obtain a role indicating that the user is verified in the server.
                                    If your new mint server has a role for verified members, select it below. The verified role will be added alongside the whitelist role so that the member can get automatically verified in the server.`}/>
                                </IonLabel>
                                <IonItem className="c-item-wrapper mt-1">
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
                                {/*  */}
                                 {/* Image Upload */}
                                <div className='mb-5'>
                                    <IonLabel className="card-detail-wrapper">Image to represent your DAO - Image must be less then 10MB</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                        name="image"
                                        control={control}
                                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) =>{
                                            return(
                                                <>
                                                    <IonInput
                                                        value={value as unknown as string}
                                                        onIonChange={(e) => {
                                                            const target = ( e.target as HTMLIonInputElement ).getElementsByTagName('input')[0];
                                                            const file = target .files?.[0] as FieldValues['image'];
                                                            if(file){
                                                                if(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpeg' ){
                                                                    setError('image', { type: 'custom', message: '' });
                                                                    setIsValidImage(false)
                                                                }else{
                                                                    setError('image', { type: 'custom', message: 'Please upload a valid Image' });
                                                                    setIsValidImage(true)
                                                                }
                                                                
                                                                let file_size = file.size;
                                                                if((file_size/1024) < 10240){
                                                                    setIsBigImage(false)
                                                                    setError('image', { type: 'custom', message: '' });
                                                                }else{
                                                                    setError('image', { type: 'custom', message: 'Maximum allowed file size is 10 MB' });
                                                                    setIsBigImage(true)
                                                                }
                                                            }
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
                                    <IonLabel className="card-detail-wrapper">Discord Invite Link (never expires, no invite limit)</IonLabel>
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
                                    <IonLabel className="card-detail-wrapper">Twitter Link</IonLabel>
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
                                    <IonLabel className="card-detail-wrapper">Magic Eden upvote URL</IonLabel>
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
                                {/* mintDate */}
                                <div  className='mb-5'>
                                        <IonLabel className="card-detail-wrapper">Mint Date</IonLabel>
                                        <IonItem className="c-item-wrapper mt-1">
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
                                        <IonLabel className="card-detail-wrapper">Mint Supply</IonLabel>
                                        <IonItem className="c-item-wrapper mt-1">
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
                                        <IonLabel className="card-detail-wrapper">Mint Price</IonLabel>
                                        <IonItem className="c-item-wrapper mt-1">
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
                                                        step="0.01"
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
                                    <IonLabel className="card-detail-wrapper">Description</IonLabel>
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
                                <IonButton className="cardButton" type={'submit'} disabled={isSubmitting || isValidImage || isBigImage}>
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
