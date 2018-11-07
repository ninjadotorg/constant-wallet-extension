import local from './localStore';
import {APP} from './constant';

export default class Server {


  static getList() {
  
    const result = local.get(APP.SERVERS);
    if (result) {
      return result;
    }
    return false;
  }

}