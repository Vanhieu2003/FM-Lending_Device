import axios from "axios";

import { CONFIG } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class FloorService {

   API_ENDPOINT = CONFIG.server.endpoints;

   getFloorByBlockId = async (blockId: string) => (
      internalApiService.getAsync(`/api/Floors/Block?BlockId=${blockId}`)
   );

}
export default new FloorService();