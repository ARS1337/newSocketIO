import React, { useEffect, useState } from "react";
import { SocketContext, socket } from "./utils/Socket";
import { Route, BrowserRouter as Router } from "react-router-dom";
import First from "./components/First";
import ResponsiveDrawer from "./components/ResponsiveDrawer";

function App() {
  const [socketID, setSocketID] = useState("");
  const [userName, setUserName] = useState("");
  const [currGroup, setCurrGroup] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    let tempUserName = sessionStorage.getItem("userName");
    let tempCurrGroup = sessionStorage.getItem("currGroup");
    setUserName(tempUserName || "");
    setCurrGroup(tempCurrGroup || "common");
    sessionStorage.setItem("currGroup", "common");
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
        groups: groups,
        setGroups: setGroups,
      }}
    >
      <Router>
        <Route path="/" exact component={First} />
        <Route path="/socket" exact component={ResponsiveDrawer} />
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
