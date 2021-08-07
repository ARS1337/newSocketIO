import { Box, Container, Divider, List, ListItemText, makeStyles, Paper } from "@material-ui/core";

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
    width:'100%'
  },
  primary:{
      
  }
});

function Lister(props) {
  const { response, userName, tempRef } = props;
  const classes = useStyles();

  return (
    <List
      classes={{
        root: classes.listRoot,
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
                maxWidth: "80%",
                padding: "1vw",
                paddingLeft: "2vw",
                paddingRight: "2vw",
                backgroundColor: x.userName === userName ? "pink" : x.userName === "messageBot" ? "lightgrey" : "skyblue",
              }}
            >
              <Box>
                {x.userName + ":"}
                <ListItemText
                  ref={tempRef}
                  primary={x.message || "' '"}
                  classes={{
                    root: classes.root,
                    multiline: classes.multiline,
                    primary:classes.primary,
                  }}
                />
              </Box>
            </Paper>
          </Container>
        );
      })}
    </List>
  );
}

export default Lister;
