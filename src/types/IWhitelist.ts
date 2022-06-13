import { ServerModel } from "./Server";

export interface IWhitelist {
	id: string;
	max_users : number;
	target_server : string;
	source_server : string;
	expiration_date : string;
	image : string;
	twitter : string | null;
	type : "raffle" | "fcfs";
	description : string;
	required_role : string;
	whitelist_role : string;
	required_role_name : string;
	whitelist_role_name : string;
	targetServer: ServerModel;
	sourceServer: ServerModel;
	claimed: boolean;
	claimCounts: number;
}