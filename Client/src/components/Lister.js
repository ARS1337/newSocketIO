import { Box, Container, Divider, List, ListItemText, Paper } from "@material-ui/core";

function Lister(props) {
  const { response, userName, tempRef } = props;

  return (
    <List
      style={{
        backgroundColor: "lightskyblue",
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
                paddingLeft: "2vw",
                paddingRight: "2vw",
                backgroundColor: x.userName === userName ? "pink" : x.userName === "messageBot" ? "lightgrey" : "skyblue",
              }}
            >
              <Box>
                {x.userName+":"}
                <Divider/>
                <ListItemText
                  ref={tempRef}
                  primary={x.message || "' '"}
                  style={{
                    padding: "5px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    textAlign: "left",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    margin: 0,
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
