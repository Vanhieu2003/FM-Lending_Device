import internalApiService from "./base/internalApiService";
export class InfoService {
  getStudentList = async() =>{
    return internalApiService.getAsync(`/api/Students/Get-students`);
  }
  getStaffList = async() =>{
    return internalApiService.getAsync(`/api/Students/Get-teacher`);
  }
}

export default new InfoService();
