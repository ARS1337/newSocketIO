import React, { useEffect, useState } from "react";
import { SocketContext, socket } from "./utils/Socket";
import Child from "./components/Child";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import First from "./components/First";
import SocketFile from "./components/SocketFile";
import NewSocketFile from "./components/NewSocketFile";
import SocketFile1 from "./components/SocketFile1";
import ResponsiveDrawer from "./components/ResponsiveDrawer";


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
        <Route path="/socket" exact component={ResponsiveDrawer} />
        {/* <Route path="/socket" exact component={SocketFile1} /> */}
        {/* <Route path="/socket" exact component={NewSocketFile} /> */}
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
