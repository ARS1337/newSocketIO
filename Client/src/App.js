import React, { useEffect, useState } from "react";
import { SocketContext, socket } from "./utils/Socket";
import Child from "./components/Child";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import First from "./components/First";
import SocketFile from "./components/SocketFile";

function App() {
  const [socketID, setSocketID] = useState("");
  const [userName, setUserName] = useState("");
  const [currGroup, setCurrGroup] = useState("");

  useEffect(() => {
    let tempUserName = sessionStorage.getItem("userName");
    let tempCurrGroup = sessionStorage.getItem("currGroup");
    setUserName(tempUserName || "");
    setCurrGroup(tempCurrGroup || "common");
    sessionStorage.setItem("currGroup","common");
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socket,
        socketID: socketID,
        userName: userName,
        currGroup: currGroup,
        setUserName: setUserName,
        setSocketID: setSocketID,
        setCurrGroup: setCurrGroup,
      }}
    >
      <Router>
        <Route path="/" exact component={First} />
        <Route path="/socket" exact component={SocketFile} />
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
