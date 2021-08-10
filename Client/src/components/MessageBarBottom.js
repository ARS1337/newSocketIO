import { Container, TextField } from "@material-ui/core";
import React from "react";
import { useStyles } from "../utils/styles";

function MessageBarBottom(props) {
  const { handleSubmit, message, setMessage } = props;
  const classes = useStyles();
  return (
    <>
      <Container
        classes={{
          root: classes.bottomInputMessage,
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
    </>
  );
}

export default MessageBarBottom;
