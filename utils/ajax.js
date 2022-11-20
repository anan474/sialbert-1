import Axios from "axios";

const fetchWithToken = (url, method, token, schema = 'Bearer') => Axios[method](url, {
    headers:{
        Authorization:`${schema} ${token}`,
        'X-HTTp-Method-Overide': method
    }
});

const postWithToken = (url, token, schema = 'Bearer') => Axios.post(url, {
    headers:{
        Authorization:`${schema} ${token}`,
    }
});
export {fetchWithToken, postWithToken}