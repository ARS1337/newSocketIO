import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../utils/Socket";
import request from "../utils/utils";
import { Container, AppBar, CssBaseline, Drawer, Hidden, IconButton, Toolbar, Typography, useTheme } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MyModal from "./MyModal";
import { useStyles } from "../utils/styles";
import { serverURL } from "../utils/config";
import MessageBarBottom from "./MessageBarBottom";
import { Lister } from "./Lister/";
import MyDrawer from "./MyDrawer";

function ResponsiveDrawer(props) {
  const Context = useContext(SocketContext);
  const socket = Context.socket;
  const setSocketID = Context.setSocketID;
  const userName = Context.userName;
  const currGroup = Context.currGroup;
  const setCurrGroup = Context.setCurrGroup;
  const setUserName = Context.setUserName;
  const groups = Context.groups;
  const setGroups = Context.setGroups;

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState([]);
  const [entityName, setEntityName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [privateModal, setPrivateModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timesScrolled, setTimesScrolled] = useState(1);

  const tempRef = useRef(null);

  useEffect(() => {
    let tempName = localStorage.getItem("userName");
    if (userName === "") {
      setUserName(tempName);
    }
    if (!socket.connected) {
      socket.connect(serverURL);
    }
  });

  useEffect(() => {
    if (socket.connected) {
      socket.emit("join", {
        user: userName,
        currGroup: "",
        joinWithGroup: "common",
      });
      setCurrGroup("common");
      socket.emit("getMoreMessages", {
        groupName: currGroup,
        numberOfMessages: timesScrolled * 30,
      });
    }
  }, [socket.connected]);

  useEffect(() => {
    socket.emit("getUsersGroups", { user: userName });
    socket.emit("getMoreMessages", { groupName: currGroup, numberOfMessages: timesScrolled * 30 });
  }, []);

  useEffect(() => {
    socket.removeAllListeners();
    socket.on("chat", (chat) => {
      let temp = [...response, chat];
      setResponse(temp);
      tempRef.current.scrollIntoView();
    });

    socket.on("join", (data) => {
      setSocketID(data.socketID);
      sessionStorage.setItem("socketid", data.socketID);
      socket.auth = { sessionID: data.socketID, userName: userName };
    });

    socket.on("joinMessage", (msg) => {
      setResponse([...response, msg]);
    });

    socket.on("getUsersGroups", (data) => {
      if (data != null) {
        setGroups(data.groups);
      } else {
        socket.emit("getUsersGroups", { user: userName });
      }
    });

    socket.on("getMoreMessages", (data) => {
      if (data != null) {
        setResponse([...data, ...response]);
      } else {
        socket.emit("getMoreMessages", {
          groupName: currGroup,
          numberOfMessages: timesScrolled * 30,
        });
      }
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
          socket.emit("join", { joinWithGroup: entityName, currGroup: currGroup, user: userName });
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
        }
        return res;
      })
      .then((r) => r.json())
      .then((r) => {
        if (error) {
          setErrorMessage(r.errors);
        } else {
          socket.emit("join", { joinWithGroup: r.groupName, currGroup: currGroup, user: userName });
          setCurrGroup(r.groupName);
          sessionStorage.setItem("currGroup", r.groupName);
          setPrivateModal(!privateModal);
        }
      });
  };

  const sendMessage = async () => {
    await socket.emit("chat", {
      userName: userName,
      currGroup: currGroup,
      message: message,
    });
    setMessage("");
  };

  const getMoreMessages = async (groupName = currGroup) => {
    setResponse([]);
    socket.emit("getMoreMessages", { groupName: groupName, numberOfMessages: timesScrolled * 30 });
  };

  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <MyDrawer
      setModalOpen={setModalOpen}
      modalOpen={modalOpen}
      setPrivateModal={setPrivateModal}
      privateModal={privateModal}
      groups={groups}
      setResponse={setResponse}
      setCurrGroup={setCurrGroup}
      getMoreMessages={getMoreMessages}
      userName={userName}
      currGroup={currGroup}
      socket={socket}
    />
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {currGroup}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Container
          fluid
          disableGutters={true}
          style={{
            height: "100%",
            display: "flex",
            alignContent: "stretch",
            width: "100%",
          }}
        >
          <MyModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            entityName={entityName}
            setEntityName={setEntityName}
            handleClick={handleJoin}
            error={error}
            errorMessage={errorMessage}
          />

          <MyModal
            modalOpen={privateModal}
            setModalOpen={setPrivateModal}
            entityName={entityName}
            setEntityName={setEntityName}
            handleClick={handlePrivate}
            error={error}
            errorMessage={errorMessage}
          />

          <Lister response={response} userName={userName} tempRef={tempRef} getMoreMessages={getMoreMessages} />

          <MessageBarBottom handleSubmit={handleSubmit} message={message} setMessage={setMessage} />
        </Container>
      </main>
    </div>
  );
}

export default ResponsiveDrawer;
