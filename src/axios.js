/* eslint-disable */
import axios from 'axios';

class Axios {
  static instance = null;
  static baseURL = 'http://127.0.0.0:8000/';
  static headers = { 'Content-Type': 'application/json' };

  static getInstance() {
    if (!Axios.instance) {
      Axios.instance = axios.create({ baseURL: Axios.baseURL, headers: Axios.headers });
      // Middleware to remove the extra "data" layer added by Axios
      Axios.instance.interceptors.response.use(res => {
        return { ...res.data, httpStatus: res.status };
      });
    }
    return Axios.instance;
  }

  static updateHeaders(headers) {
    Axios.instance.defaults.headers = { ...Axios.instance.defaults.headers, ...headers };
  }
}

export default Axios;
