import { makeStyles } from "@material-ui/core";
import {drawerWidth} from '../utils/config';

export const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
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
    bottomInputMessage: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth * 1.2}px)`,
      },
      width: "100%",
      position: "fixed",
      bottom: 0,
      opacity: 1,
    },
  }));

