import axios from "axios";
import Http from "../../domain/http/Http";

export default class HttpAxios implements Http {
  get(url: string): Promise<any> {
    return axios.get(url);
  }

  post(url: string, body: any): Promise<any> {
    return axios.post(url, body);
  }

  put(url: string, body: any): Promise<any> {
    return axios.put(url, body);
  }

  delete(url: string): Promise<any> {
    return axios.delete(url);
  }
}