import axios from "axios";

import { CONFIG } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class BlockService {

     API_ENDPOINT = CONFIG.server.endpoints;

     getBlockByCampusId = async(CampusId: string) => (internalApiService.getAsync(`/api/Blocks/ByCampus?campusId=${CampusId}`));

     getAllBlocks = async() => ( internalApiService.getAsync(`/api/Blocks`))
     
    
}
export default new BlockService();