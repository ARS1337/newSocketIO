import { ListItemText } from "@material-ui/core";
import { Divider, List, ListItem } from "@material-ui/core";
import React from "react";
import { useStyles } from "../utils/styles";

function MyDrawer(props) {
  const { setModalOpen, modalOpen, setPrivateModal, privateModal, groups, setResponse, setCurrGroup, getMoreMessages, userName, currGroup,socket } = props;
  const classes = useStyles();
  return (
    <>
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
          <Divider />
          {groups.map((x) => {
            return (
              <>
                <Divider />
                <ListItem
                  button
                  onClick={async () => {
                    setResponse([]);
                    await socket.emit("join", {
                      user: userName,
                      currGroup: currGroup,
                      joinWithGroup: x,
                    });
                    setCurrGroup(x);
                    await socket.emit("getUsersGroups", { user: userName });
                    getMoreMessages(x);
                  }}
                >
                  <ListItemText primary={x} />
                </ListItem>
              </>
            );
          })}
        </List>
      </div>
    </>
  );
}

export default MyDrawer;
