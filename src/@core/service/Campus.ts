import axios from "axios";

import { CONFIG } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class CampusService {

    API_ENDPOINT = CONFIG.server.endpoints;

    getCampusById = async (CampusId: string) => (internalApiService.getAsync(`/api/Campus?id=${CampusId}`));
    
    getAllCampus = async () => (internalApiService.getAsync(`/api/Campus`));
    
}
export default new CampusService();