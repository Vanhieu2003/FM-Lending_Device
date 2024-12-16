import { CONFIG } from 'src/config-global';
import { AxiosInitialize } from './axiosInitialize';

class IdentityService extends AxiosInitialize {
  constructor() {
    super(CONFIG.server.identity_server_endpoint, true);
  }
}

export default new IdentityService();
