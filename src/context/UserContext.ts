import { createContext, useContext } from "react";
import { IUser } from "../types/User";

const UserContext = createContext<IUser | null | undefined>(null);

export default UserContext;

export const useUser = () => {
	const user = useContext(UserContext);
	return user;
};
