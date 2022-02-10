import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
	defaultOptions : { 
		queries : { 
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
		}
	}
})
