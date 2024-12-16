import axios from "axios";

import { CONFIG } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class BorrowService {

     
     getBorrowDetailByCode = async(code: string) => (internalApiService.getAsync(`/api/BorrowLog?code=${code}`));

     createBorrow = async(data: any) => (internalApiService.postAsync(`/api/BorrowLog`, data));
     
     getUserInfoByBorrowCode = async(code: string) => (internalApiService.getAsync(`/api/BorrowLog/GetGuestInfoByBorrowLogCode?borrowLogCode=${code}`));

     updateUserPhoneNumber = async(borrowCode:string,borrowType:string,phoneNumber:string) => (internalApiService.putAsync(`/api/BorrowLog/update-phone-number?borrowerCode=${borrowCode}&borrowerType=${borrowType}&newPhoneNumber=${phoneNumber}`));
    
     updateVisitorInfo = async(rfid:string,data:any) => (internalApiService.putAsync(`/api/Visitor/update-visitor?rfid=${rfid}`,data));

     createBorrowLog = async(data:any) => (internalApiService.postAsync(`/api/BorrowLog`, data));

     updateBorrowLog = async(data:any) => (internalApiService.putAsync(`/api/BorrowLog/update`, data));

     GetAllBorrowList = async (date:string,campusId:string) => {
          return internalApiService.getAsync(`/api/BorrowLog/GetAllBorrowingDetails?campusId=${campusId}&date=${date}`);
     }
}
export default new BorrowService();