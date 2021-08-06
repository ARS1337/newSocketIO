import { Button, Container, Grid, TextField, ListItemText, List, Modal, Box } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../utils/Socket";
import request from "../utils/utils";
import ReactJson from "react-json-view";
import { Paper } from "@material-ui/core";
import SocketFile1 from "./SocketFile1";

function NewSocketFile(props) {
//   const Context = useContext(SocketContext);
//   const socket = Context.socket;
//   const socketID = Context.socketID;
//   const setSocketID = Context.setSocketID;
//   const userName = Context.userName;
//   const currGroup = Context.currGroup;
//   const setCurrGroup = Context.setCurrGroup;
//   const setUserName = Context.setUserName;

//   const [message, setMessage] = useState("");
//   const [response, setResponse] = useState([]);
//   const [entityName, setEntityName] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [privateModal, setPrivateModal] = useState(false);
//   const [error, setError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const tempRef = useRef(null);

  return (
    <div>
      <Box style={{ position: "relative", height: "100vh", backgroundColor: "#cde8f3" }}>
        {/* <Paper variant="elevation" elevation={24} fluid style={{ backgroundColor: "green", position: "fixed", left: 0, width: "15%", height: "100vh" }}>
          left
        </Paper> */}
        <Container variant="elevation" elevation={24}  fluid style={{ backgroundColor: "yellow", position: "fixed", right: 0, width: "100%", height: "max-content",padding:0,textShadow:"sdfsdf" }}>
          <SocketFile1/>
        </Container>
      </Box>
    </div>
  );
}

export default NewSocketFile;
