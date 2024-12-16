import axios from "axios";
import { CONFIG } from "src/config-global";
import internalApiService from "./base/internalApiService";

export class QRScannerService {
   API_ENDPOINT = CONFIG.server.endpoints;
   SECRET_TOKEN = CONFIG.server.secret_token;
   
   getInfoByBorrowCode = async (code: string) => {
      return internalApiService.getAsync(`/api/QRScanner/validate/BorrowLog?code=${code}`);
   }

   getStudentInfo = async (code: string) => {
      return internalApiService.getAsync(`/api/QRScanner/validate/Student?code=${code}`);
   }
   getStaffInfo = async (code: string) => {
      
      return internalApiService.getAsync(`/api/QRScanner/validate/Staff?code=${code}`)
   }
   getVisitorInfo = async (code: string) => {
      return internalApiService.getAsync(`/api/QRScanner/validate/Visitor?code=${code}`);
   }
   getInfoByRFID = async (code:string)=> {
      return internalApiService.getAsync(`/api/QRScanner/validate/Person?codeRfid=${code}`)
   }

   updateRFIDIfNull = async (rfid:string,studentCode:string) => {
      return internalApiService.putAsync(`/api/Students/update-students?code=${studentCode}&rfid=${rfid}`)
   }

   getStudentInfoByQR_ID = async (QR_Link: string) => {
      const data = new FormData();
      data.append('QR_ID', QR_Link);
      const headers = {
         token: this.SECRET_TOKEN
      }
      return axios.post(`https://auto.fm.edu.vn/webhook/checkQRvinaID`, data, { headers });
   }
}
export default new QRScannerService();