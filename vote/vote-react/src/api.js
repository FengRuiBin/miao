import axios from "axios";

var api = axios.create({
  baseURL: 'http://localhost:8008'
})

export default api