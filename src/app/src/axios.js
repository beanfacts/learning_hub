import axios from "axios";

const instance = axios.create({
  //TODO change the randomuser to actual API
  baseURL: "http://localhost:5000/api/v1",
});

export default instance;
