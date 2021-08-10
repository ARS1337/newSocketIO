import React from "react";
import {serverURL} from "./config";
import { io } from "socket.io-client";
// const { serverURL } = config;

export const socket = io(serverURL, {
  autoConnect: false,
});
export const SocketContext = React.createContext();
