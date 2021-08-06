import config  from "./config";
const {serverURL} = config;
// const serverUrl = "http://192.168.1.6:3001";

const headers = {
  "Content-Type": "application/json",
};

const request = async (url, type, body={}) => {
  let response;
    response = await fetch(`${serverURL}${url}`, {
      method: type,
      headers: headers,
      body:JSON.stringify(body),
    });

  return response;
};

export default request;