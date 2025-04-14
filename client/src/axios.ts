import axios, { AxiosHeaders } from "axios";
const instance = axios.create({
    baseURL: "http://localhost:8080/api",
});
instance.interceptors.request.use(
    function (config) {
        const token =
            window.localStorage.getItem("persist:auth") &&
            JSON.parse(window.localStorage.getItem("persist:auth") as string)?.token.slice(
                1,
                -1
            );
        if (token) {
            if (config.headers instanceof AxiosHeaders) {
                config.headers.set('authorization', `Bearer ${token}`);
            } else {
                config.headers = new AxiosHeaders({
                    authorization: `Bearer ${token}`,
                });
            }
        }

        return config;
    },
    function (error) {
        console.log(error);
        return Promise.reject(error);
    }
);
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return error.response;
    }
);
export default instance;
