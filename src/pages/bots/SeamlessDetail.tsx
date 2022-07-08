import React, { useEffect, useMemo ,useState} from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { IonLabel, IonButton, useIonToast, IonGrid, IonRow, IonCol, IonCard, IonItem, IonSelect, IonSelectOption, IonInput, IonTextarea, IonDatetime, IonSpinner, } from '@ionic/react';
import './SeamlessDetail.scss';
import {  useHistory, useLocation, useParams } from 'react-router';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import isAxiosError from '../../util/isAxiosError';
import { AxiosError } from 'axios';
import { TextFieldTypes } from '@ionic/core';
import { useQuery } from 'react-query';
import BotServerCard from './components/BotServerCard';
import Help from '../../components/Help';
import moment from 'moment';

/**
 * The page they see when they've clicked "initiate seamless" ... then clicked on a guild
 *
 * This lists the form for them to fill out
 */

interface FormFields {
    image: File & { path: string;} | '';
    target_server: number | '';
    max_users: number | '';
    expiration_date: any;
    type: 'raffle' | 'fcfs';
    whitelist_role: string;
    description: string;
    required_role: string;
    required_role_name: string;
    verified_role: string;
    twitter: string;
    discordInvite:string;
    magicEdenUpvoteUrl?:string;
}
const SeamlessDetail: React.FC<AppComponentProps> = () => {

    const server:any = useLocation();

    // new mint / source server --- comes from params
    const { serverId } = useParams<any>();

    const serverObject = localStorage.getItem('servers')
    let serverArray = serverObject &&  JSON.parse(serverObject)

    let history = useHistory();

    const now = useMemo(() => new Date(), []);
    const todayEnd = useMemo(() => {
        const date = new Date( + now + 86400 * 1000 );
        date.setHours(23,59,59,999);
        return date;
    }, [now]);

    const [formField,setFromFiled] = useState<any>({
        image: '',
        target_server:'',
        max_users: '',
        expiration_date: todayEnd,
        type:'fcfs',
        whitelist_role: '',
        description: '',
        required_role: server?.state?.requiredRoleId ? server.state.requiredRoleId : '',
        required_role_name: server?.state?.requiredRoleName ? server.state.requiredRoleName : '',
        twitter: '',
        discordInvite:'',
        magicEdenUpvoteUrl:'',
        })
    const { control, handleSubmit,  watch, reset,  setError, formState: { isSubmitting },setValue } = useForm<FormFields, any>();
    const [present] = useIonToast();

    const [whiteListRole,setWhiteListRole] = useState<any>([])
    const [whiteListRequireRole,setWhiteListRequireRole] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false);
    const [isBigImage, setIsBigImage] = useState<boolean>(false);


    useEffect(() => {
        reset(formField);
    }, [formField])




    const getUrlExtension = (url:any) => {
        return url
          .split(/[#?]/)[0]
          .split(".")
          .pop()
          .trim();
      }

    const onImageEdit = async (imgUrl: any) => {
        let fileObject:any
        const imgExt = getUrlExtension(imgUrl);
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        fileObject = new File([blob], "botProfile." + imgExt, { type: blob.type, });
        return fileObject
    }

    // TODO-ruchita: not working right - (1) this pulls from the very last WL partnership in the DB -- NOT there last WL paternership. Need to filter by source ID and use that one... (2) the whitelist_role was not being filled out ... and discordinvite /magiceden not being filled out ... image not filled out
    // const { data: whitelists = []  } = useQuery( ['whitelistPartnerships'],
    //     async () => {
    //         try {
    //             setIsLoading(true)
    //             const { data: whitelists } = await instance.post( '/getWhitelistPartnerships/me',{servers: serverArray});
    //             let imagePath = await onImageEdit(whitelists[whitelists.length-1]?.image);
    //             setFromFiled({
    //                 // image: imagePath || '',
    //                 // target_server:'',
    //                 // max_users: whitelists[whitelists.length-1]?.max_users || '',
    //                 expiration_date:whitelists[whitelists.length-1]?.expiration_date || '',
    //                 type:whitelists[whitelists.length-1]?.type || '',
    //                 whitelist_role: whitelists[whitelists.length-1]?.whitelist_role || '',
    //                 description: whitelists[whitelists.length-1]?.description || '',
    //                 // required_role: whitelists[whitelists.length-1]?.required_role || '',
    //                 twitter: whitelists[whitelists.length-1]?.twitter?.toString() || '',
    //                 // discordInvite:whitelists[whitelists.length-1]?.discordInvite?.toString() || '',
    //                 // magicEdenUpvoteUrl:whitelists[whitelists.length-1]?.magicEdenUpvoteUrl?.toString() || '',
    //                 })
    //             return whitelists;
    //         } catch (error) {
    //
    //         }
    //         finally {
    //             setIsLoading(false)
    //         }
    //
    //     }
    // );

    // get roles for the WL role we will give to people --- new mint --- source server
    const getWhiteListRole = async() =>{
        const errMsg = () => {
            present({
                message: 'Unable to get the roles from the new mint server. Please make sure the SOL Decoder bot is in that server!',
                color: 'danger',
                duration: 10000,
            });
        }

        try{
            const  data = await instance.get(`/getAllRoles/${serverId}`);
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
    const getWhiteListRequireRole = async() =>{
        const errMsg = () => {
            present({
                message: 'Unable to get the roles from the new mint server. Please make sure the SOL Decoder bot is in that server!',
                color: 'danger',
                duration: 10000,
            });
        }

        try{
            const data = await instance.get(`/getAllRoles/${server.state.discordGuildId}`);
            if(data?.data?.data){
                setWhiteListRequireRole(data.data.data);
            }else{
                // errMsg();
            }
        }catch(err){
            // errMsg();
        }

    }


    // load it on load...
    useEffect(() => {
        getWhiteListRole();
        getWhiteListRequireRole();

    }, [])

    return (
        <IonGrid>

            <IonRow>
                <IonCol size="12"><h2 className="ion-no-margin font-bold text-xl"> Seamless - fill out whitelist details</h2> </IonCol>

                <p>Note it is expected that you reach out to the DAOs before hand, and have them agree on receiving these spots</p>

                <IonCol size-xl="12" size-md="12" size-sm="12" size-xs="12" />

                <IonCol size-xl="4" size-md="6" size-sm="6" size-xs="12" >
                    <BotServerCard serverData={server.state} />
                </IonCol>

                <IonCol size-xl="8" size-md="6" size-sm="6" size-xs="12">
                    <form className="space-y-3"
                     // when submitting the form...
                     onSubmit={  handleSubmit(async (data) => {

                            try{
                                data.expiration_date = moment(data.expiration_date).format(); // "YYYY-MM-DD HH:MM:SS"
                            }catch(err){
                                present({
                                    message: 'Invalid Expiration Date',
                                    color: 'danger',
                                    duration: 10000,
                                });
                                return;
                            }

                            const { image, ...rest } = data;

                            const rawData = {
                                ...rest,
                                source_server: serverId,
                                target_server:server.state.discordGuildId,
                            };
                            const formData = new FormData();

                            Object.entries(rawData).forEach(([key, value]) => {
                                if (value) formData.append(key, value as string);
                            });
                            formData.append('image', image);

                            try {
                                await instance.post( '/createNewWhitelistPartnership', formData );

                                history.push(`/seamless`);

                                present({
                                    message: 'New Seamless partnership created successfully!',
                                    color: 'success',
                                    duration: 10000,
                                });
                                reset();

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
                        })}>

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

                            <div>
                                <IonLabel className="text-white">Expiration Date</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="expiration_date"
                                    control={control}
                                    rules={{  required: true, }}
                                    defaultValue={todayEnd.toISOString()}
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
                                                    setValue('expiration_date',value)
                                                    }}
                                                min={new Date(  +now + 86400 * 1000 ).toISOString()}
                                                max={new Date(  +now + 86400 * 365 * 1000 ).toISOString()}
                                                />
                                                <p className="formError"> {error?.message} </p>
                                            </div>
                                        )
                                        // return(
                                        //     <>
                                        //         <IonDatetime
                                        //             value={value}
                                        //             onIonChange={(e) => {
                                        //                 const value = new Date(e.detail.value as string);
                                        //                 value.setHours(23,59,59,999);
                                        //                 ( e.target as HTMLInputElement ).value =  value.toISOString();
                                        //                 onChange(e);
                                        //             }}
                                        //             name={name}
                                        //             ref={ref}
                                        //             onIonBlur={onBlur}
                                        //             placeholder='When this giveaway should expire'
                                        //             min={new Date(  +now + 86400 * 1000 ).toISOString()}
                                        //             max={new Date(  +now + 86400 * 365 * 1000 ).toISOString()} />
                                        //         <p className="formError"> {error?.message} </p>
                                        //     </>
                                        // )
                                    }} />
                                </IonItem>
                            </div>
                        </IonCard>

                        <IonCard className="ion-no-margin rounded-md ion-padding mb-2">
                            <div className='mb-5'>
                                <IonLabel className="text-white">Max Users</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                <Controller
                                name="max_users"
                                control={control}
                                render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => {
                                    return (
                                        <div className='flex flex-col w-full'>
                                            <IonInput
                                                className='w-full'
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
                                        </div>
                                    )
                                }} />
                                </IonItem>
                            </div>

                            <div className='mb-5'>
                                <IonLabel className="text-white">Whitelist Role (role they will get once Whitelisted in your new mint server)</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                <Controller
                                    name="whitelist_role"
                                    rules={{ required: true, }}
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, name, ref },  fieldState: { error }, }) =>{
                                    return (
                                        <div className='flex flex-col w-full'>
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
                                        </div>
                                    )}}
                                />

                                </IonItem>
                            </div>
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

                            {/* required roles filled out, so bot is in the existing DAO server */}
                            {whiteListRequireRole.length > 0 ?
                                <div>
                                    {/*-{server?.state?.requiredRoleId}-*/}
                                    <IonLabel className="text-white">Required Role (role required of them in '{server?.state?.name}' to enter the giveaway)</IonLabel>
                                    <IonItem className="ion-item-wrapper mt-1">
                                        <Controller
                                            name="required_role"
                                            rules={{ required: true, }}
                                            control={control}
                                            render={({ field: { onChange, onBlur, value, name, ref },  fieldState: { error }, }) => (
                                                <div className='flex flex-col w-full'>
                                                    <select className='w-full h-10 ' style={{backgroundColor : 'transparent'}}
                                                        onChange={onChange}
                                                        name={name}
                                                        onBlur={onBlur}
                                                        ref={ref}
                                                        placeholder='Select a Required Role'
                                                        value={value}
                                                        required
                                                        >
                                                            <option value=''>{server?.state?.requiredRoleId}</option>
                                                            <option value=''>Select a Required Role</option>
                                                            {whiteListRequireRole && whiteListRequireRole.map((role:any) =>{
                                                                return (<option  key={role.id}  value={role.id} selected={ server?.state?.requiredRoleId && role.id === server?.state?.requiredRoleId} > {role.name} </option>)}
                                                            )}
                                                    </select>
                                                    <p className="formError"> {error?.message} </p>
                                                </div>
                                            )}
                                        />
                                    </IonItem>
                                    <span className="font-bold text-green-500">
                                        {server?.state?.requiredRoleId && server?.state?.requiredRoleName ? `'${server?.state?.name}' recommends a Required Role of ${server?.state?.requiredRoleName}` : ''}
                                    </span>
                                </div>

                            // required roles ARE NOT filled out, so bot is NOT IN the existing DAO server
                            :
                                <div>
                                    <div>
                                        <IonLabel className="text-white">Required Role ID (Discord Role ID required of them in '{server?.state?.name}' to enter the giveaway)</IonLabel>
                                        <IonItem className="ion-item-wrapper mt-1">
                                            <Controller
                                            name="required_role"
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
                                            {server?.state?.requiredRoleId ? `'${server?.state?.name}' recommends a Required Role ID of ${server?.state?.requiredRoleId}` : ''}
                                        </span>
                                    </div>

                                    <div className='mt-5'>
                                        <IonLabel className="text-white">Required Role Name (Discord Role ID required of them in '{server?.state?.name}' to enter the giveaway)</IonLabel>
                                        <IonItem className="ion-item-wrapper mt-1">
                                            <Controller
                                            name="required_role_name"
                                            control={control}
                                            render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                                <div className='flex flex-col w-full'>
                                                    <IonInput
                                                        // readonly={server.state.requiredRoleName}
                                                        // value={server.state.requiredRoleName ? server.state.requiredRoleName : value}
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
                                        {server?.state?.requiredRoleName ? `'${server?.state?.name}' recommends a Required Role Name of ${server?.state?.requiredRoleName}` : ''}
                                    </span>
                                    </div>
                                </div>
                            }


                        </IonCard>

                        <IonCard className="ion-no-margin rounded-md ion-padding mb-2">
                            <div className='mb-5'>
                                <IonLabel className="text-white">Image to represent your DAO - Image must be less then 10MB</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="image"
                                    control={control}
                                    rules={{ required: true, }}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) =>{
                                        return(
                                            <div className='flex flex-col w-full'>
                                                <IonInput
                                                    className='w-full'
                                                    value={value as unknown as string}
                                                    onIonChange={(e) => {
                                                        const target = ( e.target as HTMLIonInputElement ).getElementsByTagName('input')[0];
                                                        const file = target .files?.[0] as FieldValues['image'];
                                                        if(file){
                                                            let file_size = file.size;
                                                            if((file_size/1024) < 10240){
                                                                setIsBigImage(false)
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
                                                    accept="image" />
                                                <p className="formError"> {error?.message} </p>
                                            </div>
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
                                        <div className='flex flex-col w-full'>
                                            <IonInput
                                                className='w-full'
                                                value={value}
                                                onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                type="url"
                                                required
                                                name={name}
                                                ref={ref}
                                                onIonBlur={onBlur}
                                                placeholder='Discord Invite Link' />
                                            <p className="formError"> {error?.message} </p>
                                        </div>
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
                                        <div className='flex flex-col w-full'>
                                            <IonInput
                                                className='w-full'
                                                value={value}
                                                onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                type="url"
                                                required
                                                name={name}
                                                ref={ref}
                                                onIonBlur={onBlur}
                                                placeholder='Twitter Link' />
                                            <p className="formError"> {error?.message} </p>
                                        </div>
                                    )} />
                                </IonItem>
                            </div>
                            <div className='mb-5'>
                                <IonLabel className="text-white">Magic Eden drops URL</IonLabel>
                                <IonItem className="ion-item-wrapper mt-1">
                                    <Controller
                                    name="magicEdenUpvoteUrl"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                        <div className='flex flex-col w-full'>
                                            <IonInput
                                                className='w-full'
                                                value={value}
                                                onIonChange={(e) => { ( e.target as HTMLInputElement ).value = e.detail.value as string; onChange(e); }}
                                                type="url"
                                                // required
                                                name={name}
                                                ref={ref}
                                                onIonBlur={onBlur}
                                                placeholder='Magic Eden drops URL (to get people to upvote it)' />
                                            <p className="formError"> {error?.message} </p>
                                        </div>
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
                                        <div className='flex flex-col w-full'>
                                            <IonTextarea
                                                className='w-full'
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
                                        </div>
                                    )}/>

                                </IonItem>
                                 <p className='mt-2'>Max character limit is 2000</p>
                            </div>
                        </IonCard>
                        <div className='ion-text-right'>
                            <IonButton className="cardButton" type={'submit'} disabled={isSubmitting || isBigImage}>
                                {isSubmitting ? ( <IonSpinner /> ) : ('Submit')}
                            </IonButton>
                        </div>
                    </form>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

// @ts-ignore
export default SeamlessDetail;
