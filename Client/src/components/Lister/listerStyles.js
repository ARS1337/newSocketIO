import { makeStyles } from "@material-ui/core";

 const useStyles = makeStyles({
    multiline: {
      wordBreak: "break-word",
    },
    root: {
      padding: "5px",
      paddingLeft: "10px",
      paddingRight: "10px",
      textAlign: "left",
      margin: 0,
      wordBreak: "break-word",
      overflowWrap: "break-word",
      width: "inherit",
    },
    listRoot: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    paperStyle: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "10px",
      width: "max-content",
      maxWidth: "80%",
      padding: "1vw",
      paddingLeft: "2vw",
      paddingRight: "2vw",
    },
  });

  export default useStyles;