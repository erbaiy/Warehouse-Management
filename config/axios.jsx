import axios from "axios";

const apiClient = axios.create({

    baseURL: 'http://192.168.1.11:3000',
    timeout:2000,

})

export default apiClient;