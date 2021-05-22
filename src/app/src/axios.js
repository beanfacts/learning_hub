import axios from "axios";

const instance = axios.create({
  //TODO change the randomuser to actual API
  baseURL: "https://iff6r2m3p6.execute-api.ap-southeast-1.amazonaws.com/api/v1/",
});

export default instance;
