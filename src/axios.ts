import axios from "axios";
import { environment } from "./environments/environment";
import { auth } from "./firebase";

export const instance = axios.create({
	baseURL: environment.backendApi,
	transformRequest: axios.defaults.transformRequest,
});

instance.interceptors.request.use(async (config) => {
	// add firebase id bearer token to authorization header
	const token = await auth.currentUser?.getIdToken();
	return token
		? {
				...config,
				headers: {
					...config.headers,
					Authorization: `Bearer ${token}`,
				},
		  }
		: config;
});
