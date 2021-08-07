import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../utils/Socket";
import request from "../utils/utils";
import ReactJson from "react-json-view";
import { Button, Grid, Modal, TextField, Container } from "@material-ui/core";
import Lister from "./Lister";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // backgroundColor: "olive",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
      backgroundColor: "grey",
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "lightgrey",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
    width: `calc(100% - ${drawerWidth}px)`,
    // backgroundColor:'lightskyblue'
  },
  bottomInputMessage:{
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth*1.2}px)`,
    },
    width:'100%',
    position: "fixed",
    bottom: 0,
    opacity: 1,
  }
}));

function ResponsiveDrawer(props) {
  const Context = useContext(SocketContext);
  const socket = Context.socket;
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
    if (userName === "") {
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
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <Divider />
        <ListItem
          button
          onClick={() => {
            setModalOpen(!modalOpen);
          }}
        >
          <ListItemText primary={"Join Group"} />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            setPrivateModal(!privateModal);
          }}
        >
          <ListItemText primary={"Private Chat"} />
        </ListItem>
        <Divider />
      </List>
    </div>
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
            width:'100%',
          }}
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

          <Lister response={response} userName={userName} tempRef={tempRef} />
          <Container
            classes={{
              root:classes.bottomInputMessage
            }}
            fluid
            disableGutters={true}
          >
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
                <TextField
                  variant="filled"
                  label="message..."
                  value={message}
                  fullWidth
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
            </form>
          </Container>
        </Container>
      </main>
    </div>
  );
}

export default ResponsiveDrawer;
