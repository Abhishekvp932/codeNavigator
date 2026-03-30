import axios from 'axios';


// const isLocal = window.location.hostname === "localhost";

// export const api = axios.create({
//   baseURL: isLocal
//     ? "http://localhost:4000"
//     : "https://codenavigator.ddns.net",
// });


export const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials:true,
})