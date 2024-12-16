import { CONFIG } from 'src/config-global';
import { AxiosInitialize } from './axiosInitialize';

class InternalApiService extends AxiosInitialize {
  constructor() {
    super(CONFIG.server.endpoints, true);

  }
}
export default new InternalApiService();
