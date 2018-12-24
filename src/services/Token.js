import axios from 'axios';
import Server from './Server';

export default class Token {
    static getOption(method, methodName, params) {
        const server = Server.getDefault();
    
        if (server) {
          const auth = "Basic " + new Buffer(server.username + ':' + server.password).toString('base64');
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': auth
            },
            url: server.address,
            data: {
              "jsonrpc": "1.0",
              "method": methodName,
              "params": params,
              "id": 1
            }
          };
          console.log('Options:', options);
          return options;
        }
        else {
          return false;
        }
      }
    static async getListCustomTokenBalance(param) {
    
        const response = await axios(Token.getOption("GET","getlistcustomtokenbalance", param));
        if (response.status === 200) {
          if (response.data && response.data.Result)
            return response.data.Result;
        }
        return false;
    }
    static async getListPrivacyCustomTokenBalance(param) {
    
        const response = await axios(Token.getOption("GET","getlistprivacycustomtokenbalance", param));
        if (response.status === 200) {
          if (response.data && response.data.Result)
            return response.data.Result;
        }
        return false;
    }
}
