import { Button, Container, Grid, TextField, ListItemText, List, Modal, Box } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../utils/Socket";
import request from "../utils/utils";
import ReactJson from "react-json-view";
import { Paper } from "@material-ui/core";
import { borders } from "@material-ui/system";

function SocketFile1(props) {
  const Context = useContext(SocketContext);
  const socket = Context.socket;
  const socketID = Context.socketID;
  const setSocketID = Context.setSocketID;
  const userName = Context.userName;
  const currGroup = Context.currGroup;
  const setCurrGroup = Context.setCurrGroup;
  const setUserName = Context.setUserName;

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState([]);
  const [entityName, setEntityName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [privateModal, setPrivateModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const tempRef = useRef(null);

  useEffect(() => {
    let tempName = localStorage.getItem("userName");
    if (userName == "") {
      setUserName(tempName);
    }
    if (!socket.connected) {
      let realSocket = socket.connect("http://192.168.1.6:3001");
      console.log(realSocket, "tried connecting");
    }
  });

  useEffect(() => {
    if (socket.connected) {
      socket.emit("join", {
        user: userName,
        currGroup: currGroup,
      });
    }
  }, [socket.connected]);

  useEffect(() => {
    socket.removeAllListeners();
    socket.on("chat", (chat) => {
      console.log(chat);
      let temp = [...response, chat];
      setResponse(temp);
      console.log("chat called");
      console.log("response is ", temp);
      tempRef.current.scrollIntoView();
    });

    socket.on("join", (data) => {
      console.log(data, "on join data");
      setSocketID(data.socketID);
      sessionStorage.setItem("socketid", data.socketID);
      socket.auth = { sessionID: data.socketID, userName: userName };
    });

    socket.on("joinMessage", (msg) => {
      let temp = [...response, msg];
      setResponse(temp);
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage();
  };

  const handleJoin = async () => {
    await request("/joinGroup", "POST", { group: entityName })
      .then(async (res) => {
        if (res.status !== 200) {
          setError(true);
        } else {
          sessionStorage.setItem("currGroup", entityName);
          socket.emit("join", { currGroup: entityName, user: userName });
          setCurrGroup(entityName);
          setModalOpen(!modalOpen);
        }
        return res;
      })
      .then((r) => r.json())
      .then((r) => {
        setErrorMessage(r.errors);
      });
  };

  const handlePrivate = async () => {
    await request("/privateChat", "POST", { connectTo: entityName, currUser: userName })
      .then(async (res) => {
        if (res.status !== 200) {
          setError(true);
        } else {
          //   sessionStorage.setItem("currGroup", entityName);
          //   socket.emit("join", { currGroup: entityName, user: userName });
          //   setCurrGroup(entityName);
          //   setModalOpen(!modalOpen);
        }
        return res;
      })
      .then((r) => r.json())
      .then((r) => {
        if (error) {
          setErrorMessage(r.errors);
        } else {
          socket.emit("join", { currGroup: r.groupName, user: userName });
          setCurrGroup(r.groupName);
          sessionStorage.setItem("currGroup", r.groupName);
          setPrivateModal(!privateModal);
        }
        console.log(r);
      });
  };

  const sendMessage = async () => {
    console.log("sendmessage called");
    await socket.emit("chat", {
      userName: userName,
      currGroup: currGroup,
      message: message,
    });
    setMessage("");
  };

  const joinCommon = () => {
    socket.emit(
      "joinCommon",
      {
        currGroup: "common",
        user: userName,
      },
      (res) => {
        alert(res.status);
      }
    );
    alert("joining common");
  };

  return (
    <>
      <Container
        sm={12}
        style={{
          backgroundColor: "#e4e9ea",
          // height: "100vh",
          height: "max-content",

          // width: "100%",
          display: "flex",
          alignContent: "stretch",
          position: "relative",
        }}
        fluid
        disableGutters={true}
      >
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(!modalOpen);
          }}
        >
          <Container style={{ backgroundColor: "lightGrey" }} justifyContent="center" alignItems="center">
            <Container style={{ padding: "5vh", backgroundColor: "white", alignSelf: "center" }}>
              <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                <Grid items>
                  <TextField
                    variant="filled"
                    label="Group Name..."
                    fullWidth
                    name="group"
                    value={entityName}
                    onChange={(e) => {
                      setEntityName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid items>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={async () => {
                      await handleJoin();
                    }}
                  >
                    Join Chat
                  </Button>
                </Grid>
                <Grid items>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setModalOpen(!modalOpen);
                    }}
                  >
                    close
                  </Button>
                </Grid>
              </Grid>
              {error ? <ReactJson src={errorMessage} /> : ""}
            </Container>
          </Container>
        </Modal>

        <Modal
          open={privateModal}
          onClose={() => {
            setPrivateModal(!privateModal);
          }}
        >
          <Container style={{ backgroundColor: "lightGrey" }} justifyContent="center" alignItems="center">
            <Container style={{ padding: "5vh", backgroundColor: "white", alignSelf: "center" }}>
              <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                <Grid items>
                  <TextField
                    variant="filled"
                    label="Group Name..."
                    fullWidth
                    name="connectTo"
                    value={entityName}
                    onChange={(e) => {
                      setEntityName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid items>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={async () => {
                      await handlePrivate();
                    }}
                  >
                    Join Chat
                  </Button>
                </Grid>
                <Grid items>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setModalOpen(!modalOpen);
                    }}
                  >
                    close
                  </Button>
                </Grid>
              </Grid>
              {error ? <ReactJson src={errorMessage} /> : ""}
            </Container>
          </Container>
        </Modal>

        <List
          style={{
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            position: "absolute",
            top: 0,
            height: "85vh",
            width: " 100%",
            overflow: "scroll",
            padding: "5px",
          }}
        >
          {response.map((x) => {
            return (
              <Container
                style={{
                  display: "flex",
                  justifyContent: x.userName === userName ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  variant="elevation"
                  elevation={24}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: x.userName === userName ? "flex-end" : "flex-start",
                    marginTop: "10px",
                    width: "max-content",
                    maxWidth: "75%",
                    padding: "1vw",
                    backgroundColor: x.userName === userName ? "pink" : x.userName === "messageBot" ? "lightgrey" : "skyblue",
                  }}
                >
                  <Box borderRadius="50%">
                    {x.userName}
                    <ListItemText
                      ref={tempRef}
                      primary={x.message || "' '"}
                      style={{
                        padding: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        textAlign: "left",
                        wordWrap: "break-word",
                        wordBreak:'break-word',
                        margin: 0,
                      }}
                    />
                  </Box>
                </Paper>
              </Container>
            );
          })}
        </List>

        <Container
          style={{
            position: "fixed",
            bottom: 0,
            height: "max-content",
            width: "100%",
            backgroundColor: "#cde8f3",
          }}
          fluid
          disableGutters={true}
        >
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <Container style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
              <TextField
                variant="filled"
                label="message..."
                value={message}
                fullWidth
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  console.log("send btn clicked");
                  sendMessage();
                }}
                style={{
                  height:'55px'
                }}
              >
                Send
              </Button>
            </Container>

            {/* <Button
                    variant="contained"
                    onClick={() => {
                      setModalOpen(!modalOpen);
                    }}
                  >
                    Join Group
                  </Button>{" "}
                  <Button
                    variant="contained"
                    onClick={() => {
                      setPrivateModal(!privateModal);
                    }}
                  >
                    Private Chat
                  </Button>{" "} */}
            {/* <Button
                    variant="contained"
                    onClick={() => {
                      joinCommon();
                    }}
                  >
                    join common
                  </Button>{" "} */}
          </form>
        </Container>
      </Container>
    </>
  );
}

export default SocketFile1;
