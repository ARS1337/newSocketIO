import {serverURL}  from "./config";

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