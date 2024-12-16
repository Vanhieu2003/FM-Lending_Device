
import { CONFIG } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class RoomService {
     API_ENDPOINT = CONFIG.server.endpoints;
     getRoomsByFloorIdAndBlockId = async (floorId: string,blockId:string) => {
        return internalApiService.getAsync(`/api/Rooms/By-Floor&Block?floorId=${floorId}&blockId=${blockId}`);
     }
     getFullInfoByRoomId = async (roomId: string) => {
        return internalApiService.getAsync(`/api/Rooms?roomId=${roomId}`);
     }
 
     getRoomByCampusId = async(campusId:string)=>{
        return internalApiService.getAsync(`/api/Rooms/GetRoomByCampus?campusId=${campusId}`);
     }
}
export default new RoomService();