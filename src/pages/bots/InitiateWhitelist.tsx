import { css } from '@emotion/react';
import { TextFieldTypes } from '@ionic/core';
import { IonButton, IonDatetime, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonSpinner, IonTextarea, useIonToast, } from '@ionic/react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { instance } from '../../axios';
import { Server } from '../../types/Server';
import { AxiosError } from 'axios';
import isAxiosError from '../../util/isAxiosError';
import './SeamlessDetail.scss';


interface FormFields {
    image: File & {
        path: string;
    };
    target_server: number;
    max_users: number;
    expiration_date: string;
    type: 'raffle' | 'fcfs';
    whitelist_role: string;
    description: string;
    required_role: string;
    twitter: string;
}
function InitiateWhitelist() {
    const { server } = useParams<{ server: string }>();

    const { data: servers = [] } = useQuery<Server[]>(
        ['allServers'],
        async () => {
            const {
                data: { guilds },
            } = await instance.get('/getAllGuilds');
            return guilds;
        }
    );

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { isSubmitting },
    } = useForm<FormFields, any>();

    const now = useMemo(() => new Date(), []);
    const image = watch('image');

	const todayEnd = useMemo(() => {
		const date = new Date( +now + 86400 * 1000 );
		date.setHours(23,59,59,999);
		return date;
	}, [now])
    const [present] = useIonToast();
  
        return (
            <>
                <div
                    className="p-10"
                    css={css`
                        /* Chrome, Safari, Edge, Opera */
                        input::-webkit-outer-spin-button,
                        input::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                        }
    
                        /* Firefox */
                        input[type='number'] {
                            -moz-appearance: textfield;
                        }
                    `}
                >
                    <h1 className="font-bold text-2xl mt-2 mb-5">  Initiate New Whitelist </h1>
                    <form
                        className="space-y-3"
                        onSubmit={handleSubmit(async (data) => {
                            const { image, ...rest } = data;
                            const rawData = { ...rest, source_server: server,   };
                            const formData = new FormData();
    
                            Object.entries(rawData).forEach(([key, value]) => {
                                if (value) formData.append(key, value as string);
                            });
                            formData.append('image', image);
                            try {
                                await instance.post( '/createWhitelistPartnership',  formData  );
                                present({
                                    message: 'Whitelist partnership created successfully!',
                                    color: 'success',
                                    duration: 2000,
                                });
                                reset();
                            } catch (error) {
                                if (isAxiosError(error)) {
                                    const { response: { data } = { errors: [] } } =
                                        error as AxiosError<{
                                            errors: {
                                                location: string;
                                                msg: string;
                                                param: string;
                                            }[];
                                        }>;
                                    if (!data || data.hasOwnProperty('error')) {
                                        present({
                                            message: ( data as unknown as { body: string } ).body,
                                            color: 'danger',
                                            duration: 1000,
                                        });
                                    } else if (data.hasOwnProperty('errors')) {
                                        data.errors.forEach(({ param, msg }) => {
                                            if (param !== 'source_server') {
                                                setError(  param as keyof FormFields, {  message: msg, type: 'custom', } );
                                            } else {
                                                present({
                                                    message: msg,
                                                    color: 'danger',
                                                    duration: 1000,
                                                });
                                            }
                                        });
                                    }
                                }
                            }
                        })}
                    >
                        <IonItem>
                            <IonLabel position="stacked">Select a server</IonLabel>
                            <Controller
                                name="target_server"
                                rules={{  required: true, }}
                                control={control}
                                render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error }, }) => (
                                    <>
                                        <IonSelect
                                            onIonChange={(e) => {
                                                (  e.target as HTMLInputElement ).value = e.detail.value;
                                                onChange(e);
                                            }}
                                            name={name}
                                            value={value}
                                            onIonBlur={onBlur}
                                            ref={ref}
                                        >
                                            {servers.map((server) =>
                                                server.name ? (
                                                    <IonSelectOption
                                                        key={server.id}
                                                        value={server.id}
                                                    >
                                                        {server.name}
                                                    </IonSelectOption>
                                                ) : null
                                            )}
                                        </IonSelect>
                                        <p className="formError">
                                            {error?.message}
                                        </p>
                                    </>
                                )}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Giveaway Type</IonLabel>
    
                            <Controller
                                name="type"
                                rules={{
                                    required: true,
                                }}
                                defaultValue="fcfs"
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { error },
                                }) => (
                                    <>
                                        <IonSelect
                                            onIonChange={(e) => {
                                                (
                                                    e.target as HTMLInputElement
                                                ).value = e.detail.value;
                                                onChange(e);
                                            }}
                                            name={name}
                                            value={value}
                                            onIonBlur={onBlur}
                                            ref={ref}
                                        >
                                            <IonSelectOption value="fcfs">
                                                FCFS
                                            </IonSelectOption>
                                            <IonSelectOption
                                                value="raffle"
                                                disabled
                                            >
                                                Raffle (Coming soon)
                                            </IonSelectOption>
                                        </IonSelect>
                                        <p className="formError">
                                            {error?.message}
                                        </p>
                                    </>
                                )}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Max users</IonLabel>
                            <Controller
                                name="max_users"
                                control={control}
                                defaultValue={10}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { error },
                                }) => (
                                    <>
                                        <IonInput
                                            onIonChange={(e) => {
                                                (
                                                    e.target as HTMLInputElement
                                                ).value = e.detail.value as string;
                                                onChange(e);
                                            }}
                                            required
                                            type="number"
                                            min="1"
                                            name={name}
                                            value={value}
                                            onIonBlur={onBlur}
                                            ref={ref}
                                        />
                                        <p className="formError">
                                            {error?.message}
                                        </p>
                                    </>
                                )}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Description</IonLabel>
                            <Controller
                                name="description"
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { error },
                                }) => (
                                    <>
                                        <IonTextarea
                                            value={value}
                                            onIonChange={(e) => {
                                                (
                                                    e.target as HTMLInputElement
                                                ).value = e.detail.value as string;
                                                onChange(e);
                                            }}
                                            required
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                        />
                                        <p className="formError">
                                            {error?.message}
                                        </p>
                                    </>
                                )}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Expiration Date</IonLabel>
                            <Controller
                                name="expiration_date"
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                defaultValue={todayEnd.toISOString()}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { error },
                                }) => (
                                    <>
                                        <IonDatetime
                                            value={value}
                                            onIonChange={(e) => {
                                                const value = new Date(e.detail.value as string);
                                                value.setHours(23,59,59,999);
                                                (
                                                    e.target as HTMLInputElement
                                                ).value =  value.toISOString();
                                                
                                                onChange(e);
                                            }}
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                            min={new Date(
                                                +now + 86400 * 1000
                                            ).toISOString()}
                                            max={new Date(
                                                +now + 86400 * 365 * 1000
                                            ).toISOString()}
                                        />
                                        <p className="formError">
                                            {error?.message}
                                        </p>
                                    </>
                                )}
                            />
                        </IonItem>
    
                        <IonItem>
                            <IonLabel position="stacked">Whitelist role</IonLabel>
                            <Controller
                                name="whitelist_role"
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { error },
                                }) => (
                                    <>
                                        <IonInput
                                            value={value}
                                            onIonChange={(e) => {
                                                (
                                                    e.target as HTMLInputElement
                                                ).value = e.detail.value as string;
                                                onChange(e);
                                            }}
                                            type="number"
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                            required
                                        />
                                        <p className="formError">
                                            {error?.message}
                                        </p>
                                    </>
                                )}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Required Role</IonLabel>
                            <Controller
                                name="required_role"
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { error },
                                }) => (
                                    <>
                                        <IonInput
                                            value={value}
                                            onIonChange={(e) => {
                                                (
                                                    e.target as HTMLInputElement
                                                ).value = e.detail.value as string;
                                                onChange(e);
                                            }}
                                            required
                                            type="number"
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                        />
                                        <p className="formError">
                                            {error?.message}
                                        </p>
                                    </>
                                )}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Twitter Link</IonLabel>
                            <Controller
                                name="twitter"
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { error },
                                }) => (
                                    <>
                                        <IonInput
                                            value={value}
                                            onIonChange={(e) => {
                                                (
                                                    e.target as HTMLInputElement
                                                ).value = e.detail.value as string;
                                                onChange(e);
                                            }}
                                            type="url"
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                        />
                                        <p className="formError">
                                            {error?.message}
                                        </p>
                                    </>
                                )}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel>Image</IonLabel>
                            <Controller
                                name="image"
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({
                                    field: { onChange, onBlur, value, name, ref },
                                    fieldState: { error },
                                }) => (
                                    <>
                                        <IonInput
                                            value={value as unknown as string}
                                            onIonChange={(e) => {
                                                const target = (
                                                    e.target as HTMLIonInputElement
                                                ).getElementsByTagName('input')[0];
                                                const file = target
                                                    .files?.[0] as FieldValues['image'];
    
                                                if (file)
                                                    file.path =
                                                        URL.createObjectURL(file);
                                                (
                                                    e.target as HTMLInputElement
                                                ).value = file as unknown as string;
                                                onChange(e);
                                            }}
                                            name={name}
                                            ref={ref}
                                            onIonBlur={onBlur}
                                            type={'file' as TextFieldTypes}
                                            accept="image"
                                        />
                                        <p className="formError">
                                            {error?.message}
                                        </p>
                                    </>
                                )}
                            />
                        </IonItem>
                        <img
                            src={image?.path}
                            className="max-h-80 mx-auto"
                            hidden={!image}
                        />
                        <div className="w-full flex justify-end">
                            <IonButton
                                type={'submit'}
                                className="w-24 h-10"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <IonSpinner className="" />
                                ) : (
                                    'Submit'
                                )}
                            </IonButton>
                        </div>
                    </form>
                </div>
            </>
        );

   
}


export default InitiateWhitelist;
